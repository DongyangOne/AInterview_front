import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import CustomModal from "../components/Modal/Close";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function Interview_result() {
  const router = useRouter();
  const [titleError, setTitleError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [usersId, setUsersId] = useState("");
  const [title, setTitle] = useState("");
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id) setUsersId(Number(id));
      } catch (error) {
        console.log("AsyncStorage error:", error);
      }
    };
    fetchUserId();
  }, []);

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError(true); // 제목 없으면 에러 표시
      return;
    } else {
      setTitleError(false);
    }

    if (!usersId) {
      console.log("유저 아이디가 없습니다.");
      return;
    }

    axios
      .post(`${process.env.EXPO_PUBLIC_API_URL}/feedback`, {
        userId: usersId,
        title,
        memo,
        good,
        bad,
        content,
        pose: parseInt(pose),
        confidence: parseInt(confidence),
        facial: parseInt(facial),
        risk_response: parseInt(riskResponse),
        tone: parseInt(tone),
        understanding: parseInt(understanding),
      })
      .then((response) => {
        const feedbackId = response.data.data.feedbackId;
        console.log("피드백 생성 성공:", response.data);
        router.push({
          pathname: "/interview_image", // 이동할 페이지 경로
          params: { feedbackId }, // 쿼리 파라미터로 전달
        });
      })
      .catch((error) => {
        console.log("Error:", error.message || error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setModalVisible(true)}
      >
        <View>
          <Image
            source={require("../assets/icons/close.png")}
            style={{
              top: 23,
              left: 20,
              width: 17,
              height: 17,
            }}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
      <CustomModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={() => {
          // 종료 처리 로직
          setModalVisible(false);
        }}
      />
      <Text style={styles.header}>면접이 종료되었습니다.</Text>
      <Text style={styles.label}>면접 제목을 입력해주세요.</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (titleError) setTitleError(false);
        }}
        placeholder="면접 제목을 입력해주세요."
        placeholderTextColor="#808080"
      />
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>저장하기</Text>
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
  header: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Pretendard",
    color: "#191919",
    marginLeft: 8,
    marginBottom: 30,
    textAlign: "left",
  },
  label: {
    fontSize: 18,
    fontFamily: "Pretendard",
    fontWeight: 500,
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
    fontFamily: "Pretendard",
    color: "#171717",
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
  saveButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Pretendard",
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginLeft: 16,
  },
});
