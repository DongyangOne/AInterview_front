<<<<<<< Updated upstream
import { StyleSheet, Text, View } from "react-native";
=======
'use client';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { useRouter } from 'expo-router';
>>>>>>> Stashed changes

export default function MyPage() {
  return (
<<<<<<< Updated upstream
    <View style={styles.container}>
      <Text style={styles.title}>마이페이지</Text>
      <View style={styles.separator} />
    </View>
=======
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Image
            source={require('../../assets/icons/setting.png')}
            style={styles.settingsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 프로필 */}
      <View style={styles.profileSection}>
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.profileImage}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.editIcon}>
          <Image
            source={require('../../assets/icons/user2.png')}
            style={styles.editImageIcon}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      {/* 내 정보 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>내 정보 관리</Text>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>아이디</Text>
          <Text style={styles.value}>dana1234</Text>
        </View>

        <TouchableOpacity style={styles.row} onPress={() => router.push('/change-nickname')}>
          <Text style={styles.label}>닉네임</Text>
          <View style={styles.right}>
            <Text style={styles.value}>김다나</Text>
            <Image
              source={require('../../assets/icons/arrow2.png')}
              style={styles.arrowIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* 계정 관리 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>계정 관리</Text>
        <View style={styles.divider} />

        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>로그아웃</Text>
          <Image
            source={require('../../assets/icons/arrow2.png')}
            style={styles.arrowIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>회원탈퇴</Text>
          <Image
            source={require('../../assets/icons/arrow2.png')}
            style={styles.arrowIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
>>>>>>> Stashed changes
  );
}

const styles = StyleSheet.create({
<<<<<<< Updated upstream
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
=======
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  settingsIcon: { width: 24, height: 24 },
  profileSection: { alignItems: 'center', marginBottom: 30 },
  profileImage: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#eee' },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 110,
    backgroundColor: 'transparent', // 투명 배경으로
    borderRadius: 12,
    padding: 0,
  },
  editImageIcon: {
    width: 24,
    height: 24,
    right:15
>>>>>>> Stashed changes
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
<<<<<<< Updated upstream
=======
  label: { fontSize: 14, color: '#333' },
  value: { fontSize: 14, color: '#888' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  arrowIcon: { width: 18, height: 18, marginLeft: 4 },
>>>>>>> Stashed changes
});
