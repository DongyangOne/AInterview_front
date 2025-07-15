import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Terms() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>이용약관 동의서</Text>

      <Text style={styles.purpleText}>AInterview 약관 동의</Text>

      <Text style={styles.sectionTitle}>제1장 총칙</Text>

      <Text style={styles.text}>
        1. 제1조 (목적){"\n"}이 약관은 ONE(이하 “운영자”라 한다)이 운영하는
        AInterview(이하 “어플리케이션”이라 한다)에서 제공하는 인터넷 기반의 면접
        시 서비스(이하 “서비스”라 한다)를 이용과 관련하여, 운영자와 이용자 간의
        권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
      </Text>

      <Text style={styles.text}>
        2. 제2조 (정의){"\n"}
        “어플리케이션”이란 운영자가 모바일 기기를 통해 제공하는 “AInterview”라는
        명칭의 소프트웨어로, 인공지능(AI)을 활용한 면접 관련 서비스를 제공하기
        위해 제작된 프로그램을 말합니다.{"\n\n"}
        “이용자”란 “어플리케이션”에 접속하여 본 약관에 따라 “어플리케이션”이
        제공하는 서비스를 받는 회원을 말합니다.
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
    marginBottom: 4,
  },
  purpleText: {
    fontSize: 14,
    color: "#5900FF",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 13,
    color: "#333",
    marginBottom: 16,
    lineHeight: 22,
  },
});
