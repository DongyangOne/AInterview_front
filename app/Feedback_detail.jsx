import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';

export default function FeedbackDetail() {
  const [memo, setMemo] = useState('');

  const handleSave = () => {
    console.log('저장된 메모:', memo);
  };

  const handleDelete = () => {
    setMemo('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* 상단 타이틀 */}
        <Text style={styles.topTitle}>ONE 회사 면접</Text>
        <Text style={styles.date}>2025년 06월 27일</Text>

        {/* 분석 그래프 타이틀 */}
        <Text style={styles.graphTitle}>사용자 분석 그래프</Text>

        {/* 그래프 이미지 + 라벨 */}
        <View style={styles.graphWrapper}>
          <Image
            source={require('../assets/images/feedbackdetail.png')}
            style={styles.graphImage}
          />
          <Text style={[styles.graphLabel, styles.labelTopLeft]}>자세</Text>
          <Text style={[styles.graphLabel, styles.labelTopRight]}>자신감</Text>
          <Text style={[styles.graphLabel, styles.labelLeft]}>표정</Text>
          <Text style={[styles.graphLabel, styles.labelRight]}>
            위기 대처{'\n'}능력
          </Text>
          <Text style={[styles.graphLabel, styles.labelBottomLeft]}>말투</Text>
          <Text style={[styles.graphLabel, styles.labelBottomRight]}>업무이해도</Text>
        </View>

        {/* 저번보다 문구 */}
        <Text style={styles.improvementText}>
          저번보다 <Text style={styles.highlight}>자세</Text>가 더 좋아졌어요!
        </Text>

        {/* 피드백 및 평가 타이틀 */}
        <Text style={styles.feedbackTitle}>피드백 및 평가</Text>

        {/* 장점 */}
        <Text style={styles.labelGood}>장점</Text>
        <Text style={styles.bodyText}>
          사용자는 바른자세를 잘 유지하고 있으며, 표정 또한 좋은 모습을 보였고 말투도 적절한 속도였습니다.
        </Text>

        {/* 단점 */}
        <Text style={styles.labelBad}>단점</Text>
        <Text style={styles.bodyText}>
          반면, 사용자는 자신감에 있어 많이 부족한 모습을 보였으며 업무이해도에 있어서 대답을 많이 못하는 모습을 보였고
          위기대처에 대한 문답 또한 적절하지 못한 대답을 하였어요!
        </Text>

        {/* 피드백 */}
        <Text style={styles.labelTip}>피드백</Text>
        <Text style={styles.bodyText}>면접에 자신감을 갖고 하는 것도 좋은 방법입니다!</Text>

        {/* 메모 입력 */}
        <Text style={styles.memoTitle}>메모</Text>
        <TextInput
          style={styles.memoInput}
          multiline
          placeholder="메모를 입력하세요..."
          value={memo}
          onChangeText={setMemo}
        />

        {/* 저장 및 삭제 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>피드백 삭제</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>피드백 저장</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
  },
  topTitle: {
    position: 'absolute',
    top: 153,
    left: 32,
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Pretendard',
    color: '#191919',
  },
  date: {
    position: 'absolute',
    top: 153,
    right: 32,
    fontSize: 18,
    fontWeight: '300',
    fontFamily: 'Pretendard',
    color: '#808080',
  },
  graphTitle: {
    marginTop: 237,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '300',
    fontFamily: 'Pretendard',
    color: '#191919',
  },
  graphWrapper: {
    width: 206,
    height: 206,
    alignSelf: 'center',
    marginTop: 20,
    position: 'relative',
  },
  graphImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  graphLabel: {
    position: 'absolute',
    fontSize: 12,
    fontFamily: 'Pretendard',
    color: '#191919',
  },
  labelTopLeft: {
    top: -24,
    left: 58,
  },
  labelTopRight: {
    top: -24,
    right: 55,
  },
  labelLeft: {
    top: '42%',
    left: -40,
  },
  labelRight: {
    top: '38%',
    right: -45,
    width: 60,
    textAlign: 'center',
  },
  labelBottomLeft: {
    bottom: -30,
    left: 54,
  },
  labelBottomRight: {
    bottom: -30,
    right: 48,
  },
  improvementText: {
    marginTop: 28,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#808080',
    fontFamily: 'Pretendard',
  },
  highlight: {
    color: '#7F3DFF',
  },
  feedbackTitle: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '300',
    color: '#191919',
    fontFamily: 'Pretendard',
  },
  labelGood: {
    marginTop: 24,
    color: '#7F3DFF',
    fontWeight: '600',
    fontFamily: 'Pretendard',
  },
  labelBad: {
    marginTop: 24,
    color: '#B00020',
    fontWeight: '600',
    fontFamily: 'Pretendard',
  },
  labelTip: {
    marginTop: 24,
    color: '#5E35B1',
    fontWeight: '600',
    fontFamily: 'Pretendard',
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    fontFamily: 'Pretendard',
    marginTop: 6,
  },
  memoTitle: {
    marginTop: 32,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Pretendard',
  },
  memoInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 100,
    marginTop: 12,
    textAlignVertical: 'top',
    fontFamily: 'Pretendard',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  deleteButton: {
    flex: 1,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderColor: '#191919',
    borderWidth: 0.3,
    borderRadius: 10,
    paddingVertical: 14,
  },
  saveButton: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: '#191919',
    borderRadius: 10,
    paddingVertical: 14,
  },
  deleteButtonText: {
    color: '#808080',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Inter',
    letterSpacing: -0.5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Inter',
    letterSpacing: -0.5,
  },
});
