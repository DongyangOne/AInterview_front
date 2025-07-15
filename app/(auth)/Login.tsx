import React, { useState } from "react";
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

export default function Login() {
  const router = useRouter();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [keepLogin, setKeepLogin] = useState(true);

  const [idError, setIdError] = useState("");
  const [pwError, setPwError] = useState("");

  const handleLogin = () => {
    setIdError("");
    setPwError("");

    if (id.trim() === "") {
      setIdError("아이디를 입력해 주세요.");
    } else if (id !== "one1234") {
      setIdError("존재하지 않는 아이디입니다.");
    }

    if (pw.trim() === "") {
      setPwError("비밀번호를 확인해 주세요.");
    } else if (pw !== "one1234**") {
      setPwError("비밀번호를 확인해 주세요.");
    }

    if (id === "one1234" && pw === "one1234*") {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace("/Start")}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>로그인</Text>

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
            style={[styles.input, { flex: 1 }]}
            placeholder="비밀번호를 입력해 주세요."
            secureTextEntry={!showPw}
            value={pw}
            onChangeText={setPw}
          />
          <TouchableOpacity onPress={() => setShowPw(!showPw)}>
            <Ionicons
              name={showPw ? "eye" : "eye-off"}
              size={24}
              color="gray"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        {pwError !== "" && <Text style={styles.error}>{pwError}</Text>}
      </View>

      <TouchableOpacity
        style={styles.keepWrap}
        onPress={() => setKeepLogin(!keepLogin)}
      >
        <Ionicons
          name={keepLogin ? "checkbox" : "square-outline"}
          size={20}
          color="#5900FF"
        />
        <Text style={styles.keepText}>로그인 유지</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginBtnText}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.socialWrap}>
        <Image
          source={require("../../assets/images/kakao.png")}
          style={styles.icon}
        />
        <Image
          source={require("../../assets/images/google.png")}
          style={styles.icon}
        />
        <Image
          source={require("../../assets/images/naver.png")}
          style={styles.icon}
        />
        <Image
          source={require("../../assets/images/facebook.png")}
          style={styles.icon}
        />
      </View>

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
  title: {
    fontSize: 18,
    fontWeight: "600",
    alignSelf: "center",
    marginBottom: 28,
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
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    marginLeft: 8,
  },
  error: {
    color: "#e11d48",
    fontSize: 12,
    marginTop: 4,
  },
  keepWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  keepText: {
    marginLeft: 8,
    fontSize: 14,
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
  socialWrap: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 32,
  },
  icon: {
    width: 44,
    height: 44,
    resizeMode: "contain",
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
