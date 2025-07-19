'use client';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

// 비밀번호 유효성 검사 함수
function validatePassword(password) {
  // 8~16자, 영문 대/소문자, 숫자, 특수문자 최소 1개 포함
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/;
  return regex.test(password);
}

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isMatch, setIsMatch] = useState(true);
  const [showFormatError, setShowFormatError] = useState(false);

  useEffect(() => {
    if (newPassword.length > 16) {
      setShowFormatError(true);
    } else {
      setShowFormatError(false);
    }
    setIsMatch(newPassword === confirmPassword || confirmPassword === '');
  }, [newPassword, confirmPassword]);

  const isValid =
    newPassword.length >= 8 &&
    newPassword.length <= 16 &&
    validatePassword(newPassword) &&
    isMatch;

  const handleSubmit = () => {
    if (newPassword.length > 16) {
      setShowFormatError(true);
      return;
    }
    if (newPassword.length >= 8 && newPassword.length <= 16 && !validatePassword(newPassword)) {
      setShowFormatError(true);
      return;
    }
    if (!isMatch) {
      return;
    }
    setShowFormatError(false);
    console.log('비밀번호 변경 완료');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require('../assets/icons/arrow1.png')}
            style={styles.backIcon}
            resizeMode="25"
          />
        </TouchableOpacity>
        <Text style={styles.title}>비밀번호 변경</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.form}>
          <Text style={styles.label}>현재 비밀번호</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <View style={{ height: 52 }} />

          <Text style={styles.label}>새 비밀번호</Text>
          <TextInput
            style={styles.input2}
            secureTextEntry
            placeholder="8~16자 영대소문자, 숫자, 특수문자 사용 가능"
            value={newPassword}
            onChangeText={setNewPassword}
          />

          {/* 고정 공간! */}
          <View style={styles.fixedGap}>
            <Text style={[styles.error, { opacity: showFormatError ? 1 : 0 }]}>
              비밀번호 양식이 올바르지 않습니다.
            </Text>
          </View>

          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {!isMatch && confirmPassword.length > 0 && (
            <Text style={styles.error}>비밀번호가 일치하지 않습니다.</Text>
          )}
        </View>
      </KeyboardAvoidingView>

      <View style={styles.bottomButtonWrapper}>
<TouchableOpacity
  style={styles.button}
  disabled={!isValid}
  onPress={handleSubmit}
>
  <Text style={styles.buttonText}>확인</Text>
</TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40, paddingHorizontal: 32 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20
  },
  backIcon: { width: 24, height: 24 },
  title: { fontSize: 20, fontWeight: '400' },
  form: { flex: 1 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 0,
  },
  input2: {
    height: 44,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 0,
  },
  fixedGap: {
    height: 33, // 무조건 33px!
    justifyContent: 'center',
  },
  error: { color: '#FF5151', fontSize: 12, marginBottom: 0, marginLeft: 4, textAlignVertical: 'center' },
  bottomButtonWrapper: {
    position: 'absolute',
    left: 32,
    right: 32,
    bottom: 30,
    backgroundColor: 'transparent',
  },
button: {
  height: 48,
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#5900FF',
},

  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});
