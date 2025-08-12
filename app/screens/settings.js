import { API_URL } from '@env';
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

export default function SettingsScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const router = useRouter();

  // 1. 페이지 진입 시 서버의 푸시 상태 가져오기
  useEffect(() => {
    const fetchPushStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/setAppPush`);
        // 서버 status는 대문자 "Y"/"N"을 기대
        if (res.data && typeof res.data.status === "string") {
          setIsEnabled(res.data.status === "Y");
        }
      } catch (err) {
        console.log("상태 불러오기 실패:", err);
      }
    };
    fetchPushStatus();
  }, []);

  // 2. 스위치 변경 시 서버에도 저장
  const toggleSwitch = async () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);

    try {
      const res = await axios.get(
        `${API_URL}/user/setAppPush`
      );

      if (res.data && res.data.success) {
        console.log("현재 서버 상태:", res.data.status);
        console.log("서버 메시지:", res.data.message);
      } else {
        setIsEnabled(isEnabled); // 실패시 복구
        console.log("API failure:", res.data);
      }
    } catch (err) {
      setIsEnabled(isEnabled);
      console.log("API Error!", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/myPage")}>
          <Image
            source={require("../../assets/icons/arrow1.png")}
            style={styles.backIcon}
            resizeMode="contain"
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
            trackColor={{ false: "#ccc", true: "#8e44ad" }}
            thumbColor="#fff"
            ios_backgroundColor="#ccc"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </TouchableOpacity>
      </View>

      {/* 기타 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>기타</Text>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push("/screens/change-password")}
        >
          <Text style={styles.label}>비밀번호 변경</Text>
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
    paddingHorizontal: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: "regular" },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9", // 구분선 컬러 변경
  },
  label: { fontSize: 16, fontWeight: "Medium", color: "#000000" },
  arrowIcon: {
    width: 18,
    height: 18,
    marginLeft: 4,
  },
  backIcon: {
    width: 24,
    height: 48,
  },
});
