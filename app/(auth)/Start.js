import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Start() {
  const router = useRouter();

  const handleSocialLogin = (provider) => {
    router.push(`/auth/social/${provider}`);
  };

  const handleReset = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("초기화 완료", "저장된 사용자 정보가 모두 삭제되었어요.", [
        {
          text: "확인",
          onPress: () => router.replace("/(auth)/Login"),
        },
      ]);
    } catch (e) {
      Alert.alert("오류", "초기화 중 문제가 발생했어요.");
      console.error("초기화 실패:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>AINTERVIEW</Text>
      <Text style={styles.subTitle}>AI가 분석하는 나만의 면접</Text>

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => router.push("/(auth)/Login")}
      >
        <Text style={styles.loginBtnText}>아이디로 로그인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 30,
  },
  logo: {
    width: "35%",
    resizeMode: "contain",
    marginBottom: 16,
  },
  title: {
    fontSize: 31,
    fontWeight: "600",
    color: "#5900FF",
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 8,
    fontFamily: "SpaceMono-Regular",
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#808080",
    textAlign: "center",
    letterSpacing: 3,
    marginBottom: 32,
  },
  loginBtn: {
    backgroundColor: "#5900FF",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
