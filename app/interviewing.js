import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  ImageBackground,
  Image,
  Alert,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import CustomModal from "../components/Modal/Close";

const { width } = Dimensions.get("window");
const PROGRESS_DURATION = 15;

export default function Interviewing() {
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState(PROGRESS_DURATION);
  const [modalVisible, setModalVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);
  const isAnimating = useRef(false);
  const isMounted = useRef(true);

  // 권한 요청
  useEffect(() => {
    if (permission && permission.status !== "granted") {
      if (permission.canAskAgain) {
        requestPermission();
      } else {
        Alert.alert("권한 필요", "앱 설정에서 카메라 권한을 허용해주세요.", [
          { text: "취소", style: "cancel" },
          { text: "설정", onPress: () => Linking.openSettings() },
        ]);
      }
    }
  }, [permission]);

  // 타이머 + 프로그래스 시작
  useEffect(() => {
    isMounted.current = true;
    startProgress();
    startTimer();
    return () => {
      isMounted.current = false;
      animationRef.current?.stop();
      clearInterval(animationRef.current?.timer);
    };
  }, []);

  // 프로그래스바 애니메이션
  const startProgress = () => {
    progressAnim.stopAnimation((currentValue) => {
      const remained = 1 - currentValue;
      if (remained <= 0) {
        if (isMounted.current) router.replace("/interview_analysis");
        return;
      }

      const duration = remained * PROGRESS_DURATION * 1000;
      animationRef.current = Animated.timing(progressAnim, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: false,
      });

      isAnimating.current = true;
      animationRef.current.start(({ finished }) => {
        if (finished && isMounted.current) {
          router.replace("/interview_analysis");
        }
      });
    });
  };

  // 타이머
  const startTimer = () => {
    clearInterval(animationRef.current?.timer);
    setTimeLeft(PROGRESS_DURATION);
    animationRef.current.timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(animationRef.current?.timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 모달 컨트롤
  const onOpenModal = () => {
    animationRef.current?.stop();
    clearInterval(animationRef.current?.timer);
    setModalVisible(true);
  };

  const onCancelModal = () => {
    setModalVisible(false);
    startProgress();
    startTimer();
  };

  const onFinishAndGoHome = () => {
    animationRef.current?.stop();
    clearInterval(animationRef.current?.timer);
    router.replace("/home");
  };

  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 348],
  });

  // 권한 없을 경우
  if (!permission || permission.status !== "granted") {
    return (
      <View style={styles.center}>
        <Text>카메라 권한이 필요합니다.</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={{ color: "#fff" }}>권한 요청</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      {/* <ImageBackground
        source={require("../assets/images/interviewface.png")}
        style={styles.background}
        resizeMode="cover"
      > */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="front"
      />

      <TouchableOpacity style={styles.closeButton} onPress={onOpenModal}>
        <Image
          source={require("../assets/icons/close.png")}
          style={{ width: 15, height: 15 }}
          resizeMode="contain"
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
      {/* </ImageBackground> */}
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    marginTop: 46,
    marginBottom: 48,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#5900FF",
    borderRadius: 8,
    marginTop: 10,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
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
  nextButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  timerText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});
