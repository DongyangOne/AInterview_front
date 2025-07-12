'use client';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isMatch, setIsMatch] = useState(true);

  useEffect(() => {
    setIsMatch(newPassword === confirmPassword || confirmPassword === '');
  }, [newPassword, confirmPassword]);

  const isValid = newPassword.length >= 8 && isMatch;

  const handleSubmit = () => {
    if (!isValid) return;

    // 🔐 여기에 비밀번호 변경 API 호출 (백엔드 연동 필요)
    console.log('비밀번호 변경 완료');
    router.back(); // 이전 페이지로 이동
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>비밀번호 변경</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 입력 폼 */}
      <Text style={styles.label}>현재 비밀번호</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="현재 비밀번호"
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <Text style={styles.label}>새 비밀번호</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="8~16자 영대소문자, 숫자, 특수문자 사용 가능"
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="새 비밀번호 확인"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {!isMatch && (
        <Text style={styles.error}>비밀번호가 일치하지 않습니다.</Text>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isValid ? 'purple' : '#ccc' }]}
        disabled={!isValid}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  error: { color: 'red', fontSize: 12, marginBottom: 10 },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
