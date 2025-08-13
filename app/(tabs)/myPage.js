import { EXPO_PUBLIC_API_URL } from '@env';
"use client";
import axios from 'axios';
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import Logout from "../../components/Modal/Logout";
import AccountDelete from "../../components/Modal/AccountDelete";

export default function MyPage() {
  const [logout, setLogout] = useState(false);
  const [deleteAcc, setDeleteAcc] = useState(false);
  const router = useRouter();
  const [myInfo, setMyInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        setError('');
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/myPage/myInfo`,
          {
            params: { userId: 1 },
            withCredentials: true
          }
        );
        setMyInfo(res.data);
      } catch (err) {
        setError(
          "내 정보 불러오기 실패: " +
            (err?.response?.data?.message || err.message)
        );
        setMyInfo(null);
      }
    };
    fetchMyInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {logout ? <Logout logout={logout} setLogout={setLogout} /> : null}
      {deleteAcc ? (
        <AccountDelete deleteAcc={deleteAcc} setDeleteAcc={setDeleteAcc} />
      ) : null}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <TouchableOpacity onPress={() => router.push("/screens/settings")}>
          <Image
            source={require("../../assets/icons/setting.png")}
            style={styles.settingsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={{ color: "red", marginBottom: 20 }}>{error}</Text>
      ) : myInfo && (
        <>
          {/* 프로필 섹션 */}
          <View style={styles.profileSection}>
            <Image
              source={require("../../assets/images/user.png")}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.editIcon}>
              <Image
                source={require("../../assets/icons/user2.png")}
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
              <Text style={styles.value}>
                {myInfo.userId}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push("/screens/change-nickname")}
            >
              <Text style={styles.label}>닉네임</Text>
              <View style={styles.right}>
                <Text style={styles.value}>{myInfo.nickname}</Text>
                <Image
                  source={require("../../assets/icons/arrow2.png")}
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

            <TouchableOpacity onPress={() => setLogout(true)} style={styles.row}>
              <Text style={styles.label}>로그아웃</Text>
              <Image
                source={require("../../assets/icons/arrow2.png")}
                style={styles.arrowIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setDeleteAcc(true)} style={styles.row}>
              <Text style={styles.label}>회원탈퇴</Text>
              <Image
                source={require("../../assets/icons/arrow2.png")}
                style={styles.arrowIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 20,
    marginLeft: 140,
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 110,
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 0,
  },
  editImageIcon: {
    width: 24,
    height: 24,
    right: 15,
  },
  section: { marginBottom: 30, marginHorizontal: 12 },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    color: "#000000",
  },
  divider: { height: 1, backgroundColor: "#000000", marginBottom: 10 },
  row: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "Pretendard-Medium",
  },
  value: {
    fontSize: 14,
    color: "#808080",
    fontFamily: "Pretendard-Medium",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  arrowIcon: {
    width: 18,
    height: 18,
    marginLeft: 4,
  },
});
