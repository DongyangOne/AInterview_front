import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 비밀번호 유효성 검사 함수
function validatePassword(password) {
  const regex = /^[A-Za-z\d\W_]{8,16}$/;
  return regex.test(password);
}

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // 각각 에러 메시지
  const [currentPwError, setCurrentPwError] = useState("");
  const [formatError, setFormatError] = useState("");
  const [matchError, setMatchError] = useState("");
  const [apiError, setApiError] = useState("");

  const handleSubmit = async () => {
    setCurrentPwError("");
    setFormatError("");
    setMatchError("");
    setApiError("");

    if (
      newPassword.length < 8 ||
      newPassword.length > 16 ||
      !validatePassword(newPassword)
    ) {
      setFormatError("비밀번호 양식이 올바르지 않습니다.");
      return;
    }

    if(
       newPassword == currentPassword ||
       !validatePassword(newPassword)
    ) {
        setFormatError("새 비밀번호가 기존 비밀번호와 같습니다.");
        return;
    }

    if (newPassword !== confirmPassword) {
      setMatchError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const usersId = await AsyncStorage.getItem("userId");
      await axios
        .post(`${process.env.EXPO_PUBLIC_API_URL}/user/changePw`, {
          userId: usersId ,
          password: currentPassword,
          newPassword: newPassword,
          newPasswordCheck: confirmPassword,
        })
        .then((response) => {
          console.log("[changePw] Response:", response.data);
          setModalVisible(true);
        });
    } catch (error) {
      console.log("[changePw] Error:", error?.response?.data || error);

      const errArr = error?.response?.data?.error ?? [];
      if (
        Array.isArray(errArr) &&
        errArr.some(
          (e) =>
            e.includes("현재 비밀번호") ||
            e.includes("틀렸") ||
            e.includes("일치하지 않습니다")
        )
      ) {
        setCurrentPwError("비밀번호가 일치하지 않습니다.");
        return;
      }

      const msg = error?.response?.data?.message ?? "";
      if (
        msg.includes("현재 비밀번호") ||
        msg.includes("일치하지 않습니다") ||
        msg.includes("틀림")
      ) {
        setCurrentPwError("비밀번호가 일치하지 않습니다.");
        return;
      }

      if (msg) {
        setApiError(msg);
      } else {
        setApiError("비밀번호 변경 중 오류가 발생했습니다.");
      }
    }
  };

  const handleModalConfirm = () => {
      setModalVisible(false);
      router.replace("/myPage");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/myPage")}>
          <Image
            source={require("../../assets/icons/arrow1.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.title}>비밀번호 변경</Text>
        <View style={{ width: 24 }} />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.form}>
          <Text style={styles.label}>현재 비밀번호</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChangeText={(t) => {
              setCurrentPassword(t);
              setCurrentPwError("");
            }}
          />
          {currentPwError ? (
            <Text style={styles.error}>{currentPwError}</Text>
          ) : null}
          <View style={{ height: 52 }} />

          <Text style={styles.label}>새 비밀번호</Text>
          <TextInput
            style={styles.input2}
            secureTextEntry
            placeholder="8~16자 영대소문자, 숫자, 특수문자 사용 가능"
            value={newPassword}
            onChangeText={(t) => {
              setNewPassword(t);
              setFormatError("");
              setMatchError("");
            }}
          />
          <View style={styles.fixedGap}>
            {formatError ? (
              <Text style={styles.error}>{formatError}</Text>
            ) : null}
          </View>

          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirmPassword(t);
              setMatchError("");
            }}
          />
          {matchError && confirmPassword.length > 0 ? (
            <Text style={styles.error}>{matchError}</Text>
          ) : null}
          {apiError ? (
            <Text style={styles.error}>{apiError}</Text>
          ) : null}
        </View>
      </KeyboardAvoidingView>
      <View style={styles.bottomButtonWrapper}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>확인</Text>
        </TouchableOpacity>
      </View>

      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleModalConfirm}
          >
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000040",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 339,
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#000000",
                fontWeight: "600",
                marginBottom: 24,
              }}
            >
              비밀번호 변경 완료
            </Text>

            <TouchableOpacity
              style={{
                width: "100%",
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                backgroundColor: "#5900FF",
                marginTop: 8,
              }}
              onPress={handleModalConfirm}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                완료
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    marginBottom: 36,
  },
  backIcon: {
    width: 24,
    height: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: "400",
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 0,
  },
  input2: {
    height: 44,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 0,
  },
  fixedGap: {
    height: 33,
    justifyContent: "center",
  },
  error: {
    color: "#FF5151",
    fontSize: 12,
    marginBottom: 0,
    marginLeft: 4,
    textAlignVertical: "center",
  },
  bottomButtonWrapper: {
    position: "absolute",
    left: 32,
    right: 32,
    bottom: 30,
    backgroundColor: "transparent",
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5900FF",
  },
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});
