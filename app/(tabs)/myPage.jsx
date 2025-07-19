"use client";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import Logout from "../../components/modal/Logout";
import AccountDelete from "../../components/modal/AccountDelete";

export default function MyPage() {
  const [logout, setLogout] = useState(false);
  const [deleteAcc, setDeleteAcc] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {logout ? <Logout logout={logout} setLogout={setLogout} /> : null}
      {deleteAcc ? (
        <AccountDelete deleteAcc={deleteAcc} setDeleteAcc={setDeleteAcc} />
      ) : null}
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Image
            source={require("../../assets/icons/setting.png")}
            style={styles.settingsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 프로필 */}
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
          <Text style={styles.value}>dana1234</Text>
        </View>

        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push("/change-nickname")}
        >
          <Text style={styles.label}>닉네임</Text>
          <View style={styles.right}>
            <Text style={styles.value}>김다나</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: { fontSize: 16, fontWeight: "bold" },
  settingsIcon: { width: 24, height: 24 },
  profileSection: { alignItems: "center", marginBottom: 30 },
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
    backgroundColor: "transparent", // 투명 배경으로
    borderRadius: 12,
    padding: 0,
  },
  editImageIcon: {
    width: 24,
    height: 24,
    right: 15,
  },
  section: { marginBottom: 30 },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    color: "#000",
  },
  divider: { height: 1, backgroundColor: "#ccc", marginBottom: 10 },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 14, color: "#333" },
  value: { fontSize: 14, color: "#888" },
  right: { flexDirection: "row", alignItems: "center", gap: 4 },
  arrowIcon: { width: 18, height: 18, marginLeft: 4 },
});
