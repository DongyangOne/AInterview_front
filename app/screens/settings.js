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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPushStatus = async () => {
      const usersId = await AsyncStorage.getItem("userId");
      setError('');

      axios
        .get(`${process.env.EXPO_PUBLIC_API_URL}/user/getAppPush`, {
          params: { userId: usersId },
          withCredentials: true,
        })
        .then((res) => {
          console.log("[getAppPush] Response:", res.data);
          setIsEnabled(res.data.status === "Y");
        })
        .catch((err) => {
          console.error("[getAppPush] Error:", err?.response?.data || err);
          setError(
            "알림 상태 가져오기 실패: " +
              (err?.response?.data?.message || err.message)
          );
          setIsEnabled(false);
        });
    };

    fetchPushStatus();
  }, []);

  const toggleSwitch = async () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);

    const usersId = await AsyncStorage.getItem("userId");
    const statusParam = newEnabled ? "Y" : "N";

    axios
      .get(`${process.env.EXPO_PUBLIC_API_URL}/user/setAppPush`, {
        params: { userId: usersId, status: statusParam },
        withCredentials: true,
      })
      .then((res) => {
        console.log("[setAppPush] Response:", res.data);
        if (res.data && res.data.success) {
          setIsEnabled(res.data.status === "Y");
        } else {
          setIsEnabled(isEnabled);
        }
      })
      .catch((err) => {
        console.error("[setAppPush] Error:", err?.response?.data || err);
        setIsEnabled(isEnabled);
        setError(
          "알림 상태 변경 실패: " +
            (err?.response?.data?.message || err.message)
        );
      });
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
        <View style={styles.row}>
          <Text style={styles.label}>알림 수신 설정</Text>
          <Switch
            trackColor={{ false: "#ccc", true: "#8e44ad" }}
            thumbColor="#fff"
            ios_backgroundColor="#ccc"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        {!!error && (
          <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>
        )}
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
    borderBottomColor: "#D9D9D9",
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
