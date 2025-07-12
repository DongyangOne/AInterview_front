import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing, ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');
const PROGRESS_DURATION = 30;

export default function Interview() {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [timeLeft, setTimeLeft] = useState(PROGRESS_DURATION);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: PROGRESS_DURATION * 1000,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: false,
    }).start();

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.8],
  });

  return (
    <ImageBackground
      source={require('../../assets/images/interviewface.png')}
      style={styles.background}
      resizeMode="cover"
    >

      <TouchableOpacity style={styles.closeButton}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>


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
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start'
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 2
  },
  closeText: {
    fontSize: 32,
    color: '#333'
  },
  questionText: {
    marginTop: 80,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  progressSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 60
  },
  progressContainer: {
    width: width * 0.8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  progressBarBackground: {
    backgroundColor: '#E0E0E0',
    borderRadius: 24,
    width: '100%',
    height: 48,
    overflow: 'hidden',
    justifyContent: 'center'
  },
  progressBar: {
    backgroundColor: '#6C4CF7',
    height: 48,
    borderRadius: 24,
    position: 'absolute',
    left: 0,
    top: 0
  },
  nextButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 48,
    justifyContent:
    'center',
    alignItems:
    'center'
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2 },
});
