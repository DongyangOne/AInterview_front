import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import CustomModal from "../components/Modal/Close";

const PROGRESS_DURATION = 10; // 10초

export default function Interview_analysis() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(PROGRESS_DURATION);
  const isAnimating = useRef(false);
  const isMounted = useRef(true);

  // 컴포넌트 마운트 확인
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 프로그래스바 애니메이션 제어 함수
  const startProgress = () => {
    if (!isMounted.current) return;
    progressAnim.stopAnimation((currentValue) => {
      // 남은 시간 계산
      const remained = 1 - currentValue;
      if (remained <= 0) {
        // 프로그래스바가 끝나면 이동
        if (isMounted.current) router.replace("/interview_end");
        return;
      }
      const remainedMs = 10000 * remained; // 총길이 10초 기준

      animationRef.current = Animated.timing(progressAnim, {
        toValue: 1,
        duration: remainedMs,
        easing: Easing.linear,
        useNativeDriver: false, // width 애니메이션은 false
      });
      isAnimating.current = true;
      animationRef.current.start(({ finished }) => {
        if (finished && isMounted.current) {
          router.replace("/interview_end");
        }
      });
    });
  };

  // 타이머 시작
  const startTimer = () => {
    clearInterval(animationRef.current?.timer);
    setTimeLeft(PROGRESS_DURATION);
    animationRef.current.timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
  };

  // 모달 열기
  const onOpenModal = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      isAnimating.current = false;
    }
    clearInterval(animationRef.current?.timer);
    setModalVisible(true);
  };

  // 모달 닫기(취소): 프로그래스바 재시작
  const onCancelModal = () => {
    setModalVisible(false);
    if (!isAnimating.current) {
      startProgress();
      startTimer();
    }
  };

  // 모달에서 종료(홈 이동)
  const onFinishAndGoHome = () => {
    setModalVisible(false);
    if (animationRef.current) {
      animationRef.current.stop();
      clearInterval(animationRef.current?.timer);
    }
    router.replace("/home");
  };

  // 타이머 동기화(프로그래스바 값이 바뀔 때마다 timeLeft 갱신)
  useEffect(() => {
    const listener = progressAnim.addListener(({ value }) => {
      setTimeLeft(Math.ceil(PROGRESS_DURATION * (1 - value)));
    });
    return () => {
      progressAnim.removeListener(listener);
    };
  }, []);

  // 애니메이션 및 타이머 최초 시작
  useEffect(() => {
    startProgress();
    startTimer();
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        clearInterval(animationRef.current.timer);
      }
    };
  }, []);

  // 모달이 닫히면 애니메이션/타이머 재시작
  useEffect(() => {
    if (!modalVisible && !isAnimating.current) {
      startProgress();
      startTimer();
    }
  }, [modalVisible]);

  //프로그래스바 퍼센트
  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onOpenModal}>
        <View>
          <Image
            source={require("../assets/icons/close.png")}
            style={{
              top: 21,
              left: 20,
              width: 15,
              height: 15,
            }}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
      <CustomModal
        visible={modalVisible}
        onCancel={onCancelModal}
        onConfirm={onFinishAndGoHome}
      />
      <View style={styles.doneText}>
        <Text style={styles.textBold}>
          <Text style={styles.textExtraBold}>답변</Text>을 평가 완료 {"\n"}
          하였습니다...
        </Text>
        <Text style={styles.textBold}>
          <Text style={styles.textExtraBold}>결과</Text>를 분석 완료 {"\n"}
          하였습니다...
        </Text>
        <Text style={styles.textBold}>
          <Text style={styles.textExtraBold}>피드백</Text>을 생성 완료 {"\n"}
          하였습니다...
        </Text>
      </View>
      <Text style={styles.waitText}>잠시만 기다려 주세요...</Text>
      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[styles.progressBarFill, { width: widthInterpolated }]}
        />
        <View style={styles.progressBarTextContainer} pointerEvents="none">
          <Text style={styles.progressBarText}>처리 중...</Text>
        </View>
      </View>
    </View>
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
  closeText: {
    fontSize: 32,
    color: "#333",
  },
  doneText: {
    marginTop: "auto",
  },
  textBold: {
    fontSize: 24,
    fontWeight: "500",
    fontFamily: "Pretendard",
    color: "#191919",
    marginLeft: 80,
    marginTop: 20,
    marginBottom: 8,
    textAlign: "left",
  },
  textExtraBold: {
    fontWeight: "700",
    fontFamily: "Pretendard",
    color: "#171717",
  },
  waitText: {
    fontSize: 16,
    color: "#808080",
    fontFamily: "Pretendard",
    marginTop: "auto",
    marginBottom: 10,
    textAlign: "center",
  },
  progressBarBackground: {
    height: 67,
    width: 348,
    borderRadius: 10,
    backgroundColor: "#d9d9d9",
    overflow: "hidden",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 200,
    MarginHorizontal: 32,
  },
  progressBarFill: {
    height: 67,
    backgroundColor: "#5900FF",
    position: "absolute",
    left: 0,
    top: 0,
  },
  progressBarTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 67,
  },
  progressBarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Pretendard",
    position: "absolute",
    width: "100%",
    textAlign: "center",
  },
});
