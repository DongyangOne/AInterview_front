import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function FeedbackDetail() {
  const [memo, setMemo] = useState('오늘은 표정이 좋았던 것 같다.');
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require('../../assets/icons/arrow1.png')}
            style={styles.headerIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>피드백 상세</Text>
        <TouchableOpacity>
          <Image
            source={require('../../assets/icons/dots.png')}
            style={styles.headerIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>피드백 및 평가</Text>

        <View style={styles.section}>
          <Text style={styles.labelGood}>장점</Text>
          <Text style={styles.bodyText}>
            사용자는 바른자세를 잘 유지하고 있으며, 표정 또한 좋은 모습을 보였고 말투도 적절한 속도였습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.labelBad}>단점</Text>
          <Text style={styles.bodyText}>
            반면, 사용자는 자신감에 있어 많이 부족한 모습을 보였으며 업무이해도에 있어서 대답을 많이 못하는 모습을 보였고
            위기대처에 대한 문답 또한 적절하지 못한 대답을 하였어요!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.labelTip}>피드백</Text>
          <Text style={styles.bodyText}>
            면접에 자신감을 갖고 하는 것도 좋은 방법입니다!
          </Text>
        </View>

        <Text style={styles.memoTitle}>메모</Text>
        <TextInput
          style={styles.memoInput}
          placeholder="메모를 입력하세요..."
          multiline
          value={memo}
          onChangeText={setMemo}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32, // <- 좌우 마진 32
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    marginTop: 24,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  container: {
    paddingHorizontal: 32, // <- 좌우 마진 32
    paddingTop: 32,
    paddingBottom: 28,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 28,
    fontWeight: '500',
    color: '#222',
  },
  section: {
    marginBottom: 22,
  },
  labelGood: {
    color: '#7F3DFF',
    fontWeight: '600',
    marginBottom: 5,
    fontSize: 13,
  },
  labelBad: {
    color: '#7F3DFF', // 보라색으로 통일
    fontWeight: '600',
    marginBottom: 5,
    fontSize: 13,
  },
  labelTip: {
    color: '#5E35B1',
    fontWeight: '600',
    marginBottom: 5,
    fontSize: 13,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  memoTitle: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 13,
    color: '#222',
  },
  memoInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 16, // padding도 조금 더 크게
    fontSize: 14,
    color: '#333',
    minHeight: 100, // <<<<< 더 넉넉하게 (기존 60 -> 100)
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    marginBottom: 18,
  },
});
