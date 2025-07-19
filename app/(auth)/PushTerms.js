import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function PushTerms() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../../assets/icons/bell_arrow.png")}
            style={{ width: 24, height: 48 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.headerText}>앱 푸시 수신 동의서</Text>
      </View>

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
    paddingTop: 40,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  headerText: {
    position: "absolute",
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "400",
    color: "#191919",
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
