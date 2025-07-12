import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Interview() {
  const router = useRouter();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      router.replace('/Interview_result');
    });
  }, [progressAnim, router]);

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>
      <View style={styles.doneText}>
        <Text style={styles.textBold}>
          <Text style={styles.textExtraBold}>답변</Text>
          을 평가 완료 {'\n'}하였습니다...
        </Text>
        <Text style={styles.textBold}>
          <Text style={styles.textExtraBold}>결과</Text>
          를 분석 완료 {'\n'}하였습니다...
        </Text>
        <Text style={styles.textBold}>
          <Text style={styles.textExtraBold}>피드백</Text>
          을 생성 완료 {'\n'}하였습니다...
        </Text>
      </View>
      <Text style={styles.waitText}>잠시만 기다려 주세요...</Text>
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBarFill, { width: widthInterpolated }]} />
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
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 2,
  },
  closeText: {
    fontSize: 32,
    color: '#333',
  },
  doneText: {
    marginTop: 'auto',
  },
  textBold: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard',
    color: '#171717',
    marginLeft: 80,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'left',
  },
  textExtraBold: {
    fontWeight: '900',
    fontFamily: 'Pretendard',
    color: '#171717',
  },
  waitText: {
    fontSize: 16,
    color: '#808080',
    fontFamily: 'Pretendard',
    marginTop: 'auto',
    marginBottom: 10,
    textAlign: 'center',
  },
  progressBarBackground: {
    height: 50,
    width: 300,
    borderRadius: 15,
    backgroundColor: '#eee',
    overflow: 'hidden',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 100,
    marginLeft: 30,
  },
  progressBarFill: {
    height: 50,
    backgroundColor: '#5900FF',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressBarTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  progressBarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Pretendard',
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
  },
});
