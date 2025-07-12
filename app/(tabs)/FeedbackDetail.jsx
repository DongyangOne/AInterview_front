import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, SafeAreaView } from 'react-native';


export default function FeedbackDetail() {
  const [memo, setMemo] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  labelGood: {
    color: '#7F3DFF',
    fontWeight: '600',
    marginBottom: 6,
  },
  labelBad: {
    color: '#B00020',
    fontWeight: '600',
    marginBottom: 6,
  },
  labelTip: {
    color: '#5E35B1',
    fontWeight: '600',
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  memoTitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  memoInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top', // Android에서 위 정렬
  },
});