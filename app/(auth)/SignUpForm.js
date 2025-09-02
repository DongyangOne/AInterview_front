import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function SignUpForm() {
  const router = useRouter();

  const [id, setId] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePush, setAgreePush] = useState(false);
  const [idError, setIdError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const badWords = ["욕", "fuck", "shit", "바보", "멍청이"];
  const containsBadWord = (t) => badWords.some((w) => t.includes(w));

  const checkDuplicateId = async () => {
    const trimmedId = id.trim();

    if (!trimmedId) {
      setIdError("아이디를 입력해 주세요.");
      return;
    }
    if (!/^[A-Za-z0-9]{3,15}$/.test(trimmedId)) {
      setIdError("아이디는 3~15자의 영문자, 숫자만 사용할 수 있어요.");
      return;
    }

    axios
      .post(`${process.env.EXPO_PUBLIC_API_URL}/sign/userIdCheck`, {
        loginUserId: trimmedId,
      })
      .then((res) => {
        console.log("[userIdCheck:success]", res.status, res.data);
        setIdError("");
      })
      .catch((err) => {
        console.log(
          "[userIdCheck:error]",
          err.response?.status,
          err.response?.data || err.message
        );
        if (err?.response?.status === 409) {
          setIdError(err.response.data.message || "이미 사용 중인 아이디예요.");
        } else {
          setIdError("");
        }
      });
  };

  const validate = async () => {
    if (submitting) return;

    let valid = true;
    setIdError("");
    setNicknameError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setTermsError("");

    if (!id.trim()) {
      setIdError("아이디를 입력해 주세요.");
      valid = false;
    } else if (!/^[A-Za-z0-9]{3,15}$/.test(id)) {
      setIdError("아이디는 3~15자의 영문자, 숫자만 사용할 수 있어요.");
      valid = false;
    }

    if (!nickname.trim()) {
      setNicknameError("닉네임을 입력해 주세요.");
      valid = false;
    } else if (!/^[A-Za-z0-9가-힣]{2,8}$/.test(nickname)) {
      setNicknameError("닉네임은 2~8자, 한글/영문/숫자만 가능해요.");
      valid = false;
    } else if (containsBadWord(nickname)) {
      setNicknameError("사용할 수 없는 단어가 포함되어 있어요.");
      valid = false;
    }

    if (!password) {
      setPasswordError("비밀번호를 입력해 주세요.");
      valid = false;
    } else if (!/^.{8,16}$/.test(password)) {
      setPasswordError("비밀번호는 8~16자여야 해요.");
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않아요.");
      valid = false;
    }

    if (!agreeTerms) {
      setTermsError("이용약관에 동의해 주세요.");
      valid = false;
    }

    if (!valid) return;

    setSubmitting(true);

    axios
      .post(
        `${process.env.EXPO_PUBLIC_API_URL}/sign/signup`,
        {
          loginUserId: id.trim(),
          nickname: nickname.trim(),
          password,
          service: agreeTerms ? "Y" : "N",
          appPush: agreePush ? "Y" : "N",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then(async (res) => {
        console.log("[signup:success]", res.status, res.data);
        await AsyncStorage.setItem("userId", id.trim());
        if (res?.data?.token) {
          await AsyncStorage.setItem("accessToken", res.data.token);
        }
        router.replace("/Login");
      })
      .catch((e) => {
        console.log(
          "[signup:error]",
          e.response?.status,
          e.response?.data || e.message
        );
        if (e.response?.data?.message) {
          setConfirmPasswordError(e.response.data.message);
        }
      })
      .finally(() => {
        setSubmitting(false);
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
        <Text style={styles.headerText}>회원가입</Text>
      </View>

      <ScrollView>
        <Text style={styles.label}>아이디</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputFull}
            placeholder="3~15자 영대소문자, 숫자 사용 가능"
            value={id}
            onChangeText={(t) => {
              setId(t);
              setIdError("");
            }}
            autoCapitalize="none"
            editable={!submitting}
          />
          <TouchableOpacity
            style={styles.checkBtn}
            onPress={checkDuplicateId}
            disabled={submitting}
          >
            <Text style={{ fontSize: 12 }}>중복확인</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorBox}>
          <Text style={styles.error}>{idError}</Text>
        </View>

        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={styles.input}
          placeholder="2~8자 영대소문자, 한글, 숫자 사용 가능"
          value={nickname}
          onChangeText={setNickname}
          editable={!submitting}
        />
        <View style={styles.errorBox}>
          <Text style={styles.error}>{nicknameError}</Text>
        </View>

        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="8~16자 영대소문자, 숫자, 특수문자 사용 가능"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          editable={!submitting}
        />
        <View style={styles.errorBox}>
          <Text style={styles.error}>{passwordError}</Text>
        </View>

        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 다시 입력해 주세요."
          value={confirmPassword}
          secureTextEntry
          onChangeText={setConfirmPassword}
          editable={!submitting}
        />
        <View style={styles.errorBox}>
          <Text style={styles.error}>{confirmPasswordError}</Text>
        </View>

        <View style={styles.checkRow}>
          <TouchableOpacity
            onPress={() => setAgreeTerms(!agreeTerms)}
            disabled={submitting}
          >
            <Ionicons
              name={agreeTerms ? "checkbox" : "square-outline"}
              size={20}
              color="#5900FF"
            />
          </TouchableOpacity>
          <Text style={styles.checkText}>
            이용약관 동의
            <Text style={styles.link} onPress={() => router.push("/Terms")}>
              보기
            </Text>
            (필수)
          </Text>
        </View>
        <View style={styles.errorBox}>
          <Text style={styles.error}>{termsError}</Text>
        </View>

        <View style={styles.checkRow}>
          <TouchableOpacity
            onPress={() => setAgreePush(!agreePush)}
            disabled={submitting}
          >
            <Ionicons
              name={agreePush ? "checkbox" : "square-outline"}
              size={20}
              color="#5900FF"
            />
          </TouchableOpacity>
          <Text style={styles.checkText}>
            앱 푸시 수신 동의
            <Text style={styles.link} onPress={() => router.push("/PushTerms")}>
              보기
            </Text>
            (선택)
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
          onPress={validate}
          disabled={submitting}
        >
          <Text style={styles.submitText}>회원가입</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
    backgroundColor: "#fff",
    paddingBottom: 48,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 57,
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
  label: { fontSize: 14, fontWeight: "500", marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginTop: 8,
  },
  inputRow: { position: "relative", marginTop: 8 },
  inputFull: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    paddingRight: 90,
  },
  checkBtn: {
    position: "absolute",
    right: 6,
    top: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  errorBox: { height: 18, marginTop: 4, justifyContent: "center" },
  error: { color: "#e11d48", fontSize: 12 },
  checkRow: { flexDirection: "row", alignItems: "center" },
  checkText: { fontSize: 13, marginLeft: 8 },
  link: { textDecorationLine: "underline", color: "#5900FF" },
  submitBtn: {
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 28,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});
