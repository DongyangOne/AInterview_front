'use client';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function ChangeNicknameScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const nicknameRegex = /^[a-z0-9가-힣]{2,8}$/i;
    setIsValid(nickname === '' || nicknameRegex.test(nickname));
  }, [nickname]);

  const handleSubmit = () => {
    if (!isValid || nickname === '') return;
    // ✅ 닉네임 저장 처리 (예: 서버 API 요청)
    console.log('변경된 닉네임:', nickname);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require('../assets/icons/arrow1.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.title}>닉네임 변경</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.form}>
          <Text style={styles.label}>닉네임 변경</Text>
          <TextInput
            style={styles.input}
            placeholder="2~8자 영대소문자, 한글, 숫자 사용 가능"
            value={nickname}
            onChangeText={setNickname}
          />

          {!isValid && (
            <Text style={styles.error}>닉네임 양식이 올바르지 않습니다.</Text>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* 확인 버튼 - 하단 고정 */}
      <View style={styles.bottomButtonWrapper}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isValid && nickname ? 'purple' : '#ccc' }]}
          disabled={!isValid || nickname === ''}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20
  },
  backIcon: { width: 24, height: 24 },
  title: { fontSize: 16, fontWeight: 'bold' },
  form: { flex: 1 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  error: { color: 'red', fontSize: 12, marginBottom: 10 },
  bottomButtonWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 30,
    backgroundColor: 'transparent',
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
