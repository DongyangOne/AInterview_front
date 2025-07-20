import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import CustomModal from '../components/Modal/Close';

const { width, height } = Dimensions.get('window');
const PROGRESS_DURATION = 30; // 30초

export default function Interviewing() {
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
    progressAnim.stopAnimation(currentValue => {
      // 남은 시간 계산
      const remained = 1 - currentValue;
      if (remained <= 0) {
        // 프로그래스바가 끝나면 이동
        if (isMounted.current) router.replace('/interview_analysis');
        return;
      }
      const remainedMs = PROGRESS_DURATION * 1000 * remained;
      animationRef.current = Animated.timing(progressAnim, {
        toValue: 1,
        duration: remainedMs,
        easing: Easing.linear,
        useNativeDriver: false,
      });
      isAnimating.current = true;
      animationRef.current.start( ({ finished }) => {
        if (finished && isMounted.current) {
          router.replace('/interview_analysis');
        }
      });
    });
  };

  // 타이머 시작
  const startTimer = () => {
    clearInterval(animationRef.current?.timer);
    setTimeLeft(PROGRESS_DURATION);
    animationRef.current.timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
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
    router.replace('/home');
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

  // 프로그래스바 퍼센트
  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 348],
  });

  return (
    <ImageBackground
      source={require('../assets/images/interviewface.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.closeButton} onPress={onOpenModal}>
        <Image
          source={require("../assets/icons/close.png")}
          style={{ top: 15, left: 20, width: 15, height: 15 }}
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
            <Animated.View style={[styles.progressBar, { width: widthInterpolate }]} />
            <View style={styles.nextButton}>
              <Text style={styles.nextButtonText}>다음 질문</Text>
            </View>
          </View>
        </View>
        <Text style={styles.timerText}>남은 시간 {timeLeft}초</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    marginTop: 46,
    marginBottom: 48,
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start'
  },
  closeButton: {
    position: 'absolute',
    top: 1,
    left: 20,
    zIndex: 2
  },
  closeText: {
    fontSize: 32,
    color: '#333'
  },
  questionText: {
    marginTop: 110,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  progressSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 50
  },
  progressContainer: {
    width: 348,
    height: 67,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60
  },
  progressBarBackground: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    width: 348,
    height: 67,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressBar: {
    backgroundColor: '#5900FF',
    height: 67,
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    top: 0
  },
  nextButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600'
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  }
});
