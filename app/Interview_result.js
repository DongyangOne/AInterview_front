import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import CustomModal from '../components/Modal/Close';

export default function Interview_result() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setModalVisible(true)}
        >
            <View>
                <Image
                source={require("../assets/icons/close.png")}
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
      <Text style={styles.header}>처리가 완료되었습니다.</Text>
      <Text style={styles.label}>면접 제목을 입력해주세요.</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="면접 제목을 입력해주세요."
        placeholderTextColor="#808080"
      />
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>저장 및 결과 확인하기</Text>
      </TouchableOpacity>
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
    top: 50,
    left: 20,
    zIndex: 2,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard',
    color: '#191919',
    marginLeft: 8,
    marginBottom: 30,
    textAlign: 'left',
  },
  label: {
    fontSize: 18,
    fontFamily: 'Pretendard',
    fontWeight: 500,
    color: '#171717',
    marginLeft: 8,
    marginBottom: 10,
    textAlign: 'left',
  },
  input: {
    height: 50,
    width: 348,
    borderColor: '#ccc',
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginLeft: 8,
    marginBottom: 30,
    fontSize: 16,
    fontFamily: 'Pretendard',
    color: '#171717',
  },
  saveButton: {
    height: 67,
    width: 348,
    marginLeft: 8,
    marginTop: 50,
    marginBottom: 140,
    borderRadius: 10,
    backgroundColor: '#5900FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Pretendard',
  },
});
