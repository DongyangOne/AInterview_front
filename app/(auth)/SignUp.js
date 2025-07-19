import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function SignUp() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>소셜 계정으로 가입하기</Text>

      <View style={styles.socialRow}>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/kakao.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/google.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/naver.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/facebook.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.separatorWrap}>
        <View style={styles.separator} />
        <Text style={styles.or}>또는</Text>
        <View style={styles.separator} />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(auth)/SignUpForm")}
      >
        <Text style={styles.buttonText}>아이디로 회원가입</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        이미 계정이 있나요?{" "}
        <Text
          style={styles.link}
          onPress={() => router.replace("/(auth)/Login")}
        >
          로그인
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 14,
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginBottom: 30,
  },
  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 8,
  },
  separatorWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "80%",
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  or: {
    marginHorizontal: 8,
    fontSize: 12,
    color: "#777",
  },
  button: {
    backgroundColor: "#5900FF",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  loginText: {
    marginTop: 20,
    fontSize: 12,
    color: "#777",
  },
  link: {
    color: "#5900FF",
    textDecorationLine: "underline",
  },
});
