import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function SignUp() {
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

        <Text style={styles.headerText}>회원가입</Text>
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
    paddingHorizontal: 24,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 300,
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
    textAlign: "center",
  },
  link: {
    color: "#5900FF",
    textDecorationLine: "underline",
  },
});
