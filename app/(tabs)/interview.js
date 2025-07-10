import React, {useState} from 'react';
import { Tabs } from "expo-router";
import { StyleSheet,
         Text,
         TouchableOpacity,
         View,
         Modal,
         Dimensions,
         Image,
         } from "react-native";

const { width } = Dimensions.get('window');

export default function Interview() {
    const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
        <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(true)}
        >
            <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
        {/* 중앙 텍스트} */}
        <View style={styles.centerContent}>
            <Text style={styles.title}>프론트{'\n'}면접 연습을{'\n'}시작합니다.</Text>
            <View style={styles.tipContainer}>
                <Text style={styles.tipTitle}>Tip 1.</Text>
                <Text style={styles.tipText}>
                면접 중 카메라를 사용하므로{'\n'}안정적으로 고정헤 주세요.{'\n\n'}
                </Text>
            </View>
            <View>
                <Text style={styles.tipTitle}>Tip 2.</Text>
                <Text style={styles.tipText}>
                정확한 평가를 위해{'\n'}소음이 없는 조용한 환경에서{'\n'}면접을 진행해 주세요.
                </Text>
            </View>
        </View>

        {/* 하단 시작 버튼 */}
        <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>시작</Text>
        </TouchableOpacity>

        {/* 알럿(모달)창 */}
        <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.alertBox}>
                    <Image
                          source={require("../../assets/icons/warning.png")}
                          style={{
                              marginBottom: 10,
                              width: 18,
                              height: 20,
                              alignItems: 'center'
                              }}
                          resizeMode="contain"
                    />
                    <Text style={styles.alertTitle}>정말 종료 하시겠습니까?</Text>
                    <Text style={styles.alertMessage}>진행 중인 내용은 저장되지 않습니다.</Text>
                    <View style={styles.alertButtonRow}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.endButton}
                            onPress={() => {
                                setModalVisible(false);
                                // 종료 처리 로직 추가
                            }}
                        >
                            <Text style={styles.endButtonText}>종료</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#888',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#222',
    marginBottom: 40,
  },
  tipContainer: {
    marginBottom: 20,
  },
  tipTitle: {
    color: '#5900FF',
    fontWeight: 'bold'
  },
  tipText: {
    color: '#222',
    fontWeight: 'normal',
  },
  startButton: {
    backgroundColor: '#5900FF',
    marginHorizontal: 32,
    marginBottom: 110,
    borderRadius: 10,
    height: 57,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(217,217,217,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    },
  alertBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    width: width * 0.8,
    alignItems: 'center',
    elevation: 5,
    },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222'
    },
  alertMessage: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center'
  },
  alertButtonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  endButton: {
    flex: 1,
    backgroundColor: '#5900FF',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center' ,
  },
  cancelButtonText: {
    color: '#222',
    fontSize: 16,
  },
  endButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
