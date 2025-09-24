import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Login() {
  const router = useRouter();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [idError, setIdError] = useState("");
  const [pwError, setPwError] = useState("");

  const handleLogin = async () => {
    setIdError("");
    setPwError("");

    const loginUserId = id.trim();
    if (!loginUserId) {
      setIdError("아이디를 입력해 주세요.");
      return;
    }
    if (!pw) {
      setPwError("비밀번호를 입력해 주세요.");
      return;
    }

    await axios
      .post(`${process.env.EXPO_PUBLIC_API_URL}/sign/login`, {
        loginUserId,
        password: pw,
      })
      .then(async (res) => {
        console.log(res.data.userId);
        AsyncStorage.setItem("userId", String(res.data.userId));
        AsyncStorage.setItem("NickName", res.data.nickname);

        router.replace("/(tabs)/home");
      })
      .catch((error) => {
        if (error.status === 404) {
          setIdError("존재하지 않는 아이디입니다.");
        } else {
          setPwError("비밀번호를 확인해 주세요.");
        }
      });
  };

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

        <Text style={styles.headerText}>로그인</Text>
      </View>
      <View style={styles.inputWrap}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          style={styles.input}
          placeholder="아이디를 입력해 주세요."
          value={id}
          onChangeText={setId}
          autoCapitalize="none"
        />
        {idError !== "" && <Text style={styles.error}>{idError}</Text>}
      </View>

      <View style={styles.inputWrap}>
        <Text style={styles.label}>비밀번호</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력해 주세요."
            secureTextEntry={!showPw}
            value={pw}
            onChangeText={setPw}
          />
          <TouchableOpacity
            style={styles.eyeContainer}
            onPress={() => setShowPw(!showPw)}
          >
            <Ionicons
              name={showPw ? "eye" : "eye-off"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {pwError !== "" && <Text style={styles.error}>{pwError}</Text>}
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginBtnText}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <View style={styles.signUpWrap}>
        <Text style={styles.signUpText}>아직 회원이 아니신가요?</Text>
        <TouchableOpacity
          style={styles.signUpBtn}
          onPress={() => router.push("../(auth)/SignUp")}
        >
          <Text style={styles.signUpBtnText}>회원가입</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 63,
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
  inputWrap: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 14,
    fontSize: 14,
    paddingRight: 40,
  },
  passwordRow: {
    position: "relative",
    justifyContent: "center",
  },
  eyeContainer: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  error: {
    color: "#e11d48",
    fontSize: 12,
    marginTop: 4,
  },
  loginBtn: {
    backgroundColor: "#5900FF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 36,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 32,
  },
  signUpWrap: {
    alignItems: "center",
  },
  signUpText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  signUpBtn: {
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  signUpBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
