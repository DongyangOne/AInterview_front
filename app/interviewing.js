import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import * as FileSystem from "expo-file-system";
import CustomModal from "../components/Modal/Close";

const { width } = Dimensions.get("window");
const PROGRESS_DURATION = 30; // 30초 녹화 제한 시간

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//  이전 파일 삭제 함수: 영구 저장소(documentDirectory)에서 모든 이전 영상 파일을 삭제합니다.
const deleteExistingVideo = async () => {
  const directoryUri = FileSystem.documentDirectory;
  try {
    const files = await FileSystem.readDirectoryAsync(directoryUri);

    for (const file of files) {
      // 이전에 저장된 interview_로 시작하는 영상 파일을 찾아서 삭제
      if (file.startsWith("interview_") && file.endsWith(".mp4")) {
        const fileUri = directoryUri + file;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (fileInfo.exists && !fileInfo.isDirectory) {
          await FileSystem.deleteAsync(fileUri, { idempotent: true });
          console.log(`[삭제됨] 이전 영상 파일: ${file}`);
        }
      }
    }
  } catch (error) {
    console.error("이전 파일 삭제 중 오류 발생:", error);
  }
};

export default function Interviewing() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(PROGRESS_DURATION);
  const [modalVisible, setModalVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [permission1, requestPermission1] = useMicrophonePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState(null);

  const cameraRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);
  const isMounted = useRef(true);

  const hasAutoRecordingStarted = useRef(false);

  // --- 1. 권한 요청 및 상태 관리 ---
  useEffect(() => {
    if (!permission?.granted && permission?.canAskAgain) {
      requestPermission();
    }
    if (!permission1?.granted && permission1?.canAskAgain) {
      requestPermission1();
    }
    return () => {
      hasAutoRecordingStarted.current = false;
    };
  }, [permission, permission1]);

  // --- 2. 자동 녹화 시작 로직 ---
  const handleCameraReady = async () => {
    if (
      permission?.granted &&
      permission1?.granted &&
      !hasAutoRecordingStarted.current
    ) {
      hasAutoRecordingStarted.current = true;
      await delay(1000);
      recordVideo();
    }
  };

  // --- 3. 타이머 및 진행 표시줄 시작/중단 로직 ---
  useEffect(() => {
    if (isRecording) {
      isMounted.current = true;
      startProgress();
      startTimer();
    }
    return () => {
      isMounted.current = false;
      animationRef.current?.stop();
      clearInterval(animationRef.current?.timer);
    };
  }, [isRecording]);

  // --- 4. 실제 녹화 실행 및 완료 처리 (URI 전달 핵심) ---
  const recordVideo = () => {
    if (
      !cameraRef.current ||
      isRecording ||
      !permission?.granted ||
      !permission1?.granted
    ) {
      console.warn("녹화 불가 또는 중복 시작 방지.");
      return;
    }

    setIsRecording(true);
    console.log("녹화 시작됨");

    cameraRef.current
      .recordAsync({ maxDuration: PROGRESS_DURATION })
      .then(async (newVideo) => {
        // 🚨 async 추가
        if (!newVideo || !newVideo.uri) {
          console.error("녹화 에러: 녹화 데이터가 생성되지 않았습니다.");

          return;
        }

        console.log(" 녹화 완료. 파일 URI:", newVideo.uri);
        setVideo(newVideo);

        let finalUri = newVideo.uri; // 기본값은 임시 URI

        // 🚨 1. 이전 파일 모두 삭제
        await deleteExistingVideo();

        // 🚨 2. 새 파일 복사 로직 (캐시 소멸 방지)
        try {
          const newFileName = `interview_${Date.now()}.mp4`;
          const permanentPath = FileSystem.documentDirectory + newFileName;

          await FileSystem.copyAsync({
            from: newVideo.uri, // 임시 캐시 URI
            to: permanentPath, // 영구 저장소 URI
          });
          finalUri = permanentPath;
          console.log(
            "[SUCCESS] 영상 파일이 영구 저장소로 즉시 복사됨:",
            permanentPath
          );
        } catch (error) {
          console.error("[FATAL] 파일 즉시 복사 실패. 임시 URI 유지:", error);
        }

        // URI와 feedbackId를 다음 화면으로 전달
        if (isMounted.current) {
          router.replace({
            pathname: "/Interview_result",
            params: {
              videoUri: finalUri, // ⬅복사된 새 (영구) URI 전달
            },
          });
        }
      })
      .catch((err) => {
        console.error("녹화 에러:", err);
      })
      .finally(() => {
        setIsRecording(false);
      });
  };

  const stopRecording = () => {
    if (cameraRef.current) cameraRef.current.stopRecording();
    console.log("녹화 중단됨");
  };

  // --- 5. 애니메이션 및 타이머 로직 ---
  const startProgress = () => {
    progressAnim.setValue(0);
    animationRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: PROGRESS_DURATION * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    animationRef.current.start();
  };

  const startTimer = () => {
    clearInterval(animationRef.current?.timer);
    setTimeLeft(PROGRESS_DURATION);
    animationRef.current.timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(animationRef.current?.timer);
          if (isRecording) stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 348],
  });

  // --- 6. 모달 관련 로직 ---
  const onOpenModal = () => {
    animationRef.current?.stop();
    clearInterval(animationRef.current?.timer);
    if (isRecording) stopRecording();
    setModalVisible(true);
  };

  const onCancelModal = () => {
    setModalVisible(false);
    if (isRecording) {
      startProgress();
      startTimer();
    }
  };

  const onFinishAndGoHome = () => {
    animationRef.current?.stop();
    clearInterval(animationRef.current?.timer);
    if (isRecording) stopRecording();
    router.replace("/home");
  };

  // --- 7. 권한 체크 UI ---
  if (!permission?.granted)
    return (
      <View style={styles.center}>
        <Text>카메라 권한 필요</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={{ color: "#fff" }}>권한 요청</Text>
        </TouchableOpacity>
      </View>
    );
  if (!permission1?.granted)
    return (
      <View style={styles.center}>
        <Text>마이크 권한 필요</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission1}
        >
          <Text style={{ color: "#fff" }}>권한 요청</Text>
        </TouchableOpacity>
      </View>
    );

  // --- 8. 메인 렌더링 (JSX) ---
  return (
    <>
      <CameraView
        ref={cameraRef}
        mode="video"
        style={StyleSheet.absoluteFill}
        facing="front"
        onCameraReady={handleCameraReady}
      />
      {isRecording && (
        <View style={styles.statusBox}>
          <Text style={styles.recordingText}>녹화 중...</Text>
        </View>
      )}

      <TouchableOpacity style={styles.closeButton} onPress={onOpenModal}>
        <Image
          source={require("../assets/icons/close.png")}
          style={{ width: 15, height: 15 }}
        />
      </TouchableOpacity>

      <CustomModal
        visible={modalVisible}
        onCancel={onCancelModal}
        onConfirm={onFinishAndGoHome}
      />

      <Text style={styles.questionText}>자기소개 부탁드립니다.</Text>

      <View style={styles.progressSection}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[styles.progressBar, { width: widthInterpolate }]}
            />
            <View style={styles.nextButton}>
              <Text style={styles.nextButtonText}>다음 질문</Text>
            </View>
          </View>
        </View>
        <Text style={styles.timerText}>남은 시간 {timeLeft}초</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  permissionButton: {
    padding: 12,
    backgroundColor: "#5900FF",
    borderRadius: 8,
    marginTop: 10,
  },
  closeButton: { position: "absolute", top: 40, left: 20, zIndex: 10 },
  statusBox: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 10,
    marginHorizontal: width * 0.2,
  },
  recordingText: { color: "#ff4040", fontWeight: "700", fontSize: 18 },
  questionText: {
    marginTop: 110,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  progressSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 50,
  },
  progressContainer: {
    width: 348,
    height: 67,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  progressBarBackground: {
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    width: 348,
    height: 67,
    overflow: "hidden",
    justifyContent: "center",
  },
  progressBar: {
    backgroundColor: "#5900FF",
    height: 67,
    borderRadius: 10,
    position: "absolute",
    left: 0,
    top: 0,
  },
  nextButton: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: { color: "#fff", fontSize: 20, fontWeight: "600" },
  timerText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});
