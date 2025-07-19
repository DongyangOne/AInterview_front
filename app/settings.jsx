'use client';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const router = useRouter();

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require('../assets/icons/arrow1.png')}
            style={styles.backIcon}
            resizeMode="20"
          />
        </TouchableOpacity>
        <Text style={styles.title}>설정</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 알림 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>알림</Text>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>알림 수신 설정</Text>
          <Switch
            trackColor={{ false: '#ccc', true: '#8e44ad' }}
            thumbColor={isEnabled ? '#fff' : '#fff'}
            ios_backgroundColor="#ccc"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </TouchableOpacity>
      </View>

      {/* 기타 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>기타</Text>
        <TouchableOpacity style={styles.row} onPress={() => router.push('/change-password')}>
          <Text style={styles.label}>비밀번호 변경</Text>
          <Image
            source={require('../assets/icons/arrow2.png')}
            style={styles.arrowIcon}
            resizeMode="contain"
          />
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
  title: { fontSize: 20, fontWeight: 'regular' },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9', // 구분선 컬러 변경
  },
  label: { fontSize: 16, fontWeight:'Medium', color: '#000000' },
  arrowIcon: {
    width: 18,
    height: 18,
    marginLeft: 4,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
});
