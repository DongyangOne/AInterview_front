// app/SignUpForm.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

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

  const badWords = ["욕", "fuck", "shit", "바보", "멍청이"];

  const containsBadWord = (text) => {
    return badWords.some((word) => text.includes(word));
  };

  const validate = () => {
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

    if (valid) {
      router.replace("/Login");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>아이디</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="3~15자 영대소문자, 숫자 사용 가능"
          value={id}
          onChangeText={setId}
        />
        <TouchableOpacity style={styles.checkBtn}>
          <Text style={{ fontSize: 12 }}>중복확인</Text>
        </TouchableOpacity>
      </View>
      {!!idError && <Text style={styles.error}>{idError}</Text>}

      <Text style={styles.label}>닉네임</Text>
      <TextInput
        style={styles.input}
        placeholder="2~8자 한글, 영문, 숫자 사용 가능"
        value={nickname}
        onChangeText={setNickname}
      />
      {!!nicknameError && <Text style={styles.error}>{nicknameError}</Text>}

      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        style={styles.input}
        placeholder="8~16자 영문, 숫자, 특수문자 사용 가능"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {!!passwordError && <Text style={styles.error}>{passwordError}</Text>}

      <Text style={styles.label}>비밀번호 확인</Text>
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 다시 입력해 주세요."
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />
      {!!confirmPasswordError && (
        <Text style={styles.error}>{confirmPasswordError}</Text>
      )}

      <View style={styles.checkRow}>
        <TouchableOpacity onPress={() => setAgreeTerms(!agreeTerms)}>
          <View style={styles.checkbox}>
            {agreeTerms && <View style={styles.checkedBox} />}
          </View>
        </TouchableOpacity>
        <Text style={styles.checkText}>
          이용약관 동의{" "}
          <Text style={styles.link} onPress={() => router.push("/Terms")}>
            보기
          </Text>{" "}
          (필수)
        </Text>
      </View>
      {!!termsError && <Text style={styles.error}>{termsError}</Text>}

      <View style={styles.checkRow}>
        <TouchableOpacity onPress={() => setAgreePush(!agreePush)}>
          <View style={styles.checkbox}>
            {agreePush && <View style={styles.checkedBox} />}
          </View>
        </TouchableOpacity>
        <Text style={styles.checkText}>
          앱 푸시 수신 동의{" "}
          <Text style={styles.link} onPress={() => router.push("/PushTerms")}>
            보기
          </Text>{" "}
          (선택)
        </Text>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={validate}>
        <Text style={styles.submitText}>회원가입</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginTop: 8,
  },
  error: {
    color: "#e11d48",
    fontSize: 12,
    marginTop: 4,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkedBox: {
    width: 12,
    height: 12,
    backgroundColor: "#5900FF",
  },
  checkText: {
    fontSize: 13,
  },
  link: {
    textDecorationLine: "underline",
    color: "#5900FF",
  },
  submitBtn: {
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 28,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
