import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function Interview_result() {
  const [title, setTitle] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>
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
    left: 30,
    zIndex: 2,
  },
  closeText: {
    fontSize: 32,
    color: '#333',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard',
    color: '#171717',
    marginLeft: 8,
    marginBottom: 30,
    textAlign: 'left',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Pretendard',
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
    borderRadius: 10,
    backgroundColor: '#5900FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard',
  },
});
