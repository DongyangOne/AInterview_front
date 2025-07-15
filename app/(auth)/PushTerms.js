import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function PushTerms() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>앱 푸시 수신 동의서</Text>

      <Text style={styles.text}>
        ONE은 전자적 전송매체(앱 푸시)를 통해 이용자에게 맞춤 푸시 알림을 전송할
        수 있습니다.{"\n\n"}
        푸시 알림에 대한 설정은 AInterview 앱 {">"} 마이 페이지 {">"} 설정 {">"}{" "}
        알림 수신 설정에서 언제든지 변경하실 수 있습니다.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backBtn: {
    marginBottom: 10,
  },
  backArrow: {
    fontSize: 22,
    color: "#333",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
  },
  text: {
    fontSize: 13,
    color: "#333",
    lineHeight: 22,
  },
});
