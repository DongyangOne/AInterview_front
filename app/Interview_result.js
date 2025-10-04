import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomModal from "../components/Modal/Close";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function Interview_result() {
  const router = useRouter();

  const { videoUri } = useLocalSearchParams(); //  URI 수신

  const [titleError, setTitleError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [usersId, setUsersId] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const [memo, setMemo] = useState("");
  const [good, setGood] = useState("");
  const [bad, setBad] = useState("");
  const [content, setContent] = useState("");
  const [pose, setPose] = useState("");
  const [confidence, setConfidence] = useState("");
  const [facial, setFacial] = useState("");
  const [riskResponse, setRiskResponse] = useState("");
  const [tone, setTone] = useState("");
  const [understanding, setUnderstanding] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id) setUsersId(Number(id));
      } catch (error) {
        console.error("AsyncStorage error:", error);
        setUsersId(0);
      }
    };
    fetchUserId();
  }, []);

  const handleSave = () => {
    // 1. 유효성 검사
    if (!title.trim()) {
      setTitleError(true);
      setSaveError(null);
      return;
    }

    if (!videoUri) {
      console.error(
        "오류",
        "영상 파일 경로(URI)가 전달되지 않아 저장을 계속할 수 없습니다."
      );
      return;
    }

    if (!usersId) {
      console.error("유저 아이디가 없습니다.");
      return;
    }

    // 2. 데이터 준비
    const data = {
      userId: usersId,
      title,
      memo,
      good,
      bad,
      content,
      pose: parseInt(pose) || 0,
      confidence: parseInt(confidence) || 0,
      facial: parseInt(facial) || 0,
      risk_response: parseInt(riskResponse) || 0,
      tone: parseInt(tone) || 0,
      understanding: parseInt(understanding) || 0,
    };

    setLoading(true);
    setSaveError(null);

    // 3. API 호출 및 다음 단계로 이동
    axios
      .post(`${process.env.EXPO_PUBLIC_API_URL}/feedback`, data)
      .then((response) => {
        const newFeedbackId = response.data?.data?.feedbackId;

        if (!newFeedbackId) {
          throw new Error("서버 응답에 feedbackId가 누락되었습니다.");
        }

        console.log("피드백 생성 성공:", response.data);

        router.push({
          pathname: "/interview_image",
          params: {
            feedbackId: newFeedbackId,
            videoUri: videoUri, // ⬅️ URI를 다음 화면으로 반드시 재전달!
          },
        });
      })
      .catch((error) => {
        const message = error.response?.data?.message || error.message;
        console.error("Error saving feedback:", message);
        setSaveError(`저장 실패: ${message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setModalVisible(true)}
        disabled={loading}
      >
        <View>
          <Image
            source={require("../assets/icons/close.png")}
            style={styles.closeImage}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>

      {/* 모달 */}
      <CustomModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          router.replace("/home");
        }}
      />

      <Text style={styles.header}>면접이 종료되었습니다.</Text>

      <Text style={styles.label}>면접 제목을 입력해주세요.</Text>
      <TextInput
        style={[styles.input, titleError && styles.inputError]}
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (titleError) setTitleError(false);
          if (saveError) setSaveError(null);
        }}
        placeholder="면접 제목을 입력해주세요."
        placeholderTextColor="#808080"
        editable={!loading}
      />

      {/* 🔴 제목 에러 메시지 표시 */}
      {titleError && (
        <Text style={styles.errorText}>면접 제목은 필수 항목입니다.</Text>
      )}

      {/* 🔴 API 저장 에러 메시지 표시 */}
      {saveError && <Text style={styles.errorText}>{saveError}</Text>}

      {/* 🔴 비디오 URI 상태 표시 (디버깅용) */}
      {!videoUri && (
        <Text style={styles.uriMissingText}>
          🚨 영상 경로 누락: 이전 화면에서 URI가 전달되지 않았습니다.
        </Text>
      )}

      <TouchableOpacity
        onPress={handleSave}
        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
        disabled={loading || !videoUri} // URI가 없으면 저장 버튼 비활성화
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>저장하고 다음 단계로</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 24,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 2,
  },
  closeImage: {
    top: 23,
    left: 20,
    width: 17,
    height: 17,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#191919",
    marginLeft: 8,
    marginBottom: 30,
    textAlign: "left",
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    color: "#171717",
    marginLeft: 8,
    marginBottom: 10,
    textAlign: "left",
  },
  input: {
    height: 50,
    width: width * 0.85,
    borderColor: "#ccc",
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 5,
    fontSize: 16,
    color: "#171717",
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1.5,
  },
  saveButton: {
    height: 67,
    width: width * 0.85,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 50,
    marginBottom: 140,
    borderRadius: 10,
    backgroundColor: "#5900FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },
  saveButtonDisabled: {
    opacity: 0.6,
    backgroundColor: "#808080",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginLeft: 16,
    marginTop: 5,
  },
  uriMissingText: {
    fontSize: 14,
    color: "orange",
    marginLeft: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
});
