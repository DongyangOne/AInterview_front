import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
// 🟢 최종 복구: expo-av로 임포트 변경
import { Video } from "expo-av";
const VideoComponent = Video; // ⬅️ VideoComponent 이름 유지
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// FileSystem 및 MediaLibrary 임포트는 제거되었습니다.

export default function InterviewVideo() {
  const params = useLocalSearchParams();
  const { feedbackId } = params;
  const videoUri = params.videoUri; // 🟢 영구 저장소 URI를 받습니다.

  const router = useRouter();
  const [usersId, setUsersId] = useState(null);
  const [loading, setLoading] = useState(false); // AI 서버 업로드 상태
  const [uploadError, setUploadError] = useState(null);

  const file1Name = `${feedbackId}_${Date.now()}.mp4`;

  // --- 1. 사용자 ID 불러오기 ---
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id) setUsersId(Number(id));
      } catch (error) {
        console.error("AsyncStorage error:", error);
        Alert.alert("오류", "사용자 정보를 불러오는 데 실패했습니다.");
      }
    };
    fetchUserId();
  }, [videoUri]);

  // ------------------------------------------
  // 🔴 2. 영상 업로드 처리 (handleSave)
  // ------------------------------------------
  const handleSave = async () => {
    if (!videoUri) {
      setUploadError("녹화된 영상 파일 경로가 유효하지 않습니다.");
      Alert.alert("전송 실패", "녹화된 영상 파일 경로가 유효하지 않습니다.");
      return;
    }
    if (!usersId) {
      setUploadError("사용자 ID를 불러오지 못했습니다.");
      Alert.alert("전송 실패", "사용자 정보를 확인할 수 없습니다.");
      return;
    }

    setUploadError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("userId", usersId);
      formData.append("feedbackId", feedbackId);

      formData.append("file1", {
        uri: videoUri,
        type: "video/mp4",
        name: file1Name,
      });

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/file/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("업로드 성공:", response.data);
      Alert.alert("업로드 성공", "AI 분석을 위해 영상 전송이 완료되었습니다.");

      // AI 분석 페이지로 이동
      router.push("/interview_analysis");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "예상치 못한 오류가 발생했습니다.";
      setUploadError(errorMessage);
      console.error("업로드 실패:", error.response?.data || error.message);
      Alert.alert("업로드 실패", `영상 전송에 실패했습니다: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. 렌더링 ---

  if (usersId === null || !feedbackId) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5900FF" />
        <Text style={{ marginTop: 10 }}>데이터를 준비하는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        녹화 완료! 영상을 확인하고 분석을 시작하세요.
      </Text>

      {/* 🟢 영상 미리보기 섹션 */}
      {videoUri ? (
        <View style={styles.videoContainer}>
          {/* 🟢 expo-av Video 컴포넌트를 사용 */}
          <VideoComponent
            source={{ uri: videoUri }} // expo-av는 객체 방식을 사용
            style={styles.videoPlayer}
            useNativeControls
            resizeMode="contain"
            isLooping={false}
            shouldPlay={true} // ⬅️ 자동 재생 강제
            // 📢 expo-av의 로딩 이벤트 (이벤트 이름은 expo-av 기준)
            onLoadStart={() =>
              console.log("VIDEO DEBUG: Loading started (via expo-av)")
            }
            onLoad={() =>
              console.log("VIDEO DEBUG: Loaded successfully (via expo-av)")
            }
          />
        </View>
      ) : (
        <View style={styles.videoContainer}>
          <View style={styles.noVideoBox}>
            <Text style={styles.noVideoText}>
              녹화된 영상 파일을 찾을 수 없습니다.
            </Text>
            <Text style={styles.noVideoHint}>
              전달된 URI 값:{" "}
              {videoUri ? videoUri.substring(0, 10) + "..." : "NULL/Undefined"}
            </Text>
          </View>
        </View>
      )}

      {/* 🔴 에러 메시지 표시 */}
      {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}

      {/* 🔴 업로드 버튼 */}
      <TouchableOpacity
        style={[styles.nextBtn, loading && styles.disabledBtn]}
        onPress={handleSave}
        disabled={loading || !videoUri}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>AI 서버로 전송 및 분석 시작</Text>
        )}
      </TouchableOpacity>

      {/* 🔴 재녹화 버튼 */}
      <TouchableOpacity
        style={[styles.nextBtn, styles.secondaryBtn]}
        onPress={() => router.back()}
        disabled={loading}
      >
        <Text style={styles.secondaryBtnText}>다시 녹화하기</Text>
      </TouchableOpacity>

      {/* 🔴 전송할 파일 정보는 하단에 배치 */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.infoTextSmall}>파일 이름: {file1Name}</Text>
        <Text style={styles.infoTextSmall}>사용자 ID: {usersId}</Text>
        <Text style={styles.infoTextSmall}>피드백 ID: {feedbackId}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
  },
  videoContainer: {
    width: "100%",
    height: 250,
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  videoPlayer: {
    flex: 1,
    backgroundColor: "#000",
  },
  noVideoBox: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noVideoText: {
    textAlign: "center",
    color: "#555",
    fontWeight: "bold",
  },
  noVideoHint: {
    marginTop: 10,
    fontSize: 12,
    color: "#999",
  },
  nextBtn: {
    width: "90%",
    height: 50,
    borderRadius: 8,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5900FF", // 기본 업로드 버튼 색상
  },
  disabledBtn: {
    opacity: 0.6,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryBtn: {
    backgroundColor: "#E0E0E0",
    marginTop: 10,
  },
  secondaryBtnText: {
    color: "#333",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF3B30",
    marginTop: 15,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoTextSmall: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});
