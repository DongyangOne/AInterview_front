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

// navigation이 있다면 아래 주석 해제
// import { useNavigation } from '@react-navigation/native';

const today = new Date();
const formattedDate = today.toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).replace(/\. /g, '.').replace(/\.$/, '');

export default function FeedbackResult() {
  const [memo, setMemo] = useState('');
  // navigation이 있다면 아래 주석 해제
  // const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 커스텀 헤더 */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => {
            // navigation이 있다면 아래 코드 사용
            // navigation.goBack();
          }}
        >
          <Image source={require('../../assets/icons/arrow.png')} style={styles.arrowIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>피드백 상세</Text>
        <TouchableOpacity onPress={() => { /* 점 세개 메뉴 이벤트 */ }}>
          <Image source={require('../../assets/icons/dots.png')} style={styles.dotsIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.topTitle}>ONE 회사 면접</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        <View style={styles.headerLine} />
        <Text style={styles.graphTitle}>사용자 분석 그래프</Text>
        <View style={styles.graphWrapper}>
          <Image
            source={require('../../assets/images/feedbackresult.png')}
            style={styles.graphImage}
          />
          <Text style={[styles.graphLabel, styles.labelTopLeft]}>자세</Text>
          <Text style={[styles.graphLabel, styles.labelTopRight]}>자신감</Text>
          <Text style={[styles.graphLabel, styles.labelLeft]}>표정</Text>
          <Text style={[styles.graphLabel, styles.labelRight]}>위기 대처{"\n"}능력</Text>
          <Text style={[styles.graphLabel, styles.labelBottomLeft]}>말투</Text>
          <Text style={[styles.graphLabel, styles.labelBottomRight]}>업무이해도</Text>
        </View>
        <Text style={styles.improvementText}>
          저번보다 <Text style={styles.highlight}>자세</Text>가 더 좋아졌어요!
        </Text>
        <Text style={styles.feedbackTitle}>피드백 및 평가</Text>
        <Text style={styles.labelGood}>장점</Text>
        <Text style={styles.bodyText}>
          사용자는 바른자세를 잘 유지하고 있으며, 표정 또한 좋은 모습을 보였고 말투도 적절한 속도였습니다.
        </Text>
        <Text style={styles.labelBad}>단점</Text>
        <Text style={styles.bodyText}>
          반면, 사용자는 자신감에 있어 많이 부족한 모습을 보였으며 업무이해도에 있어서 대답을 많이 못하는 모습을 보였고
          위기대처에 대한 문답 또한 적절하지 못한 대답을 하였어요!
        </Text>
        <Text style={styles.labelTip}>피드백</Text>
        <Text style={styles.bodyText}>면접에 자신감을 갖고 하는 것도 좋은 방법입니다!</Text>
        <Text style={styles.memoTitle}>메모</Text>
        <TextInput
          style={styles.memoInput}
          multiline
          placeholder="메모를 입력하세요..."
          value={memo}
          onChangeText={setMemo}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={() => setMemo('')}>
            <Text style={styles.deleteButtonText}>피드백 삭제</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={() => {}}>
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
    paddingTop: 0,
  },
  // 커스텀 헤더
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 30,  // 상태바 공간 확보(조절 가능)
    paddingBottom: 12,
    paddingHorizontal: 6,
    backgroundColor: '#fff',
  },
  arrowIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#191919',
    fontFamily: 'Pretendard',
  },
  dotsIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  // 본문 기존 스타일
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10, // 헤더 아래 간격만 살짝
  },
  headerLine: {
    height: 2,
    backgroundColor: '#DDDDDD',
    marginTop: 7,
    marginBottom: 20,
    borderRadius: 3,
  },
  topTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Pretendard',
    color: '#191919',
  },
  date: {
    fontSize: 15,
    fontWeight: '300',
    fontFamily: 'Pretendard',
    color: '#808080',
  },
  graphTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
    fontFamily: 'Pretendard',
    color: '#191919',
    marginBottom: 30,
  },
  graphWrapper: {
    width: 206,
    height: 206,
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  graphImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  graphLabel: {
    position: 'absolute',
    fontSize: 13,
    fontFamily: 'Pretendard',
    color: '#191919',
    fontWeight: '400',
  },
  labelTopLeft: { top: -18, left: 48 },
  labelTopRight: { top: -18, right: 38 },
  labelLeft: { top: '42%', left: -44 },
  labelRight: { top: '40%', right: -55, width: 68, textAlign: 'center' },
  labelBottomLeft: { bottom: -16, left: 54 },
  labelBottomRight: { bottom: -16, right: 48 },
  improvementText: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#808080',
    fontFamily: 'Pretendard',
    marginBottom: 10,
  },
  highlight: { color: '#7F3DFF' },
  feedbackTitle: {
    marginTop: 36,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '400',
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
    color: '#5E35B1',
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
