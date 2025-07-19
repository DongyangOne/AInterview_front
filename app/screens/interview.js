import { useState} from 'react';
import { Tabs,  useLocalSearchParams } from "expo-router";
import { StyleSheet,
         Text,
         TouchableOpacity,
         View,
         Dimensions,
         Image,
         } from "react-native";
import CustomModal from '../../components/Modal/Close';

const { width } = Dimensions.get('window');

export const unstable_settings = {
  initialRouteName: 'interview',
};

export const options = {
  tabBarStyle: { display: 'none' }, // 현재 이미 있음
  headerShown: false,
};


export default function Interview() {
const [modalVisible, setModalVisible] = useState(false);
const { role } = useLocalSearchParams(); // role은 (서버 관리자 / 백엔드 / 프론트)
const displayRole = role || "프론트";
  return (
    <View style={styles.container}>
    <TouchableOpacity
    style={styles.closeButton}
    onPress={() => setModalVisible(true)}
    >
        <View>
            <Image
            source={require("../../assets/icons/close.png")}
            style={{
            top: 23,
            left: 20,
            width: 17,
            height: 17,
            }}
            resizeMode="contain"
            />
        </View>
    </TouchableOpacity>
    <CustomModal
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onConfirm={() => {
              // 종료 처리 로직
              setModalVisible(false);
            }}
          />
        {/* 중앙 텍스트} */}
        <Text style={styles.title}>{displayRole}{'\n'}면접 연습을{'\n'}시작합니다.</Text>
            <View style={styles.tipsContainer}>
              <View style={styles.tipRow}>
                <Text style={styles.tipTitle}>Tip 1.</Text>
                <Text style={styles.tipText}>면접 중 카메라를 사용하므로{'\n'}안정적으로 고정해 주세요.</Text>
              </View>
              <View style={styles.tipRow}>
                <Text style={styles.tipTitle}>Tip 2.</Text>
                <Text style={styles.tipText}>정확한 평가를 위해{'\n'}소음이 없는 조용한 환경에서{'\n'}면접을 진행해 주세요.</Text>
              </View>
            </View>


        {/* 하단 시작 버튼 */}
        <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>시작</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 44,
    fontWeight: 600,
    textAlign: 'left',
    color: '#222',
    marginTop: 140,          // 필요에 따라 위치 조정
    marginBottom: 0,        // tipsContainer와의 겹침 방지
  },
  tipsContainer: {
    marginTop: 94,          // 타이틀과의 간격 충분히 주기
    marginBottom: 55,
    width: 240
    },
    tipRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 45, // 두 줄 사이 간격
    },
    tipTitle: {
      fontFamily: 'Pretendard',
      fontSize: 14,
      fontWeight: '600',
      color: '#5900FF',
      marginRight: 8, // 타이틀과 내용 간격
    },
    tipText: {
      fontFamily: 'Pretendard',
      fontSize: 16,
      color: '#171717',
      fontWeight: '500',
      flexShrink: 1,       // 줄바꿈 자연스럽게
      lineHeight: 22,
    },
  startButton: {
    backgroundColor: '#5900FF',
    marginHorizontal: 32,
    marginBottom: 170,
    borderRadius: 10,
    width: 348,
    height: 67,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },
  startButtonText: {
    fontFamily: 'Pretendard',
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    },
  cancelButton: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
});
