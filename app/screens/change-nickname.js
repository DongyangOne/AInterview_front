"use client";
import React, { useState, useEffect } from "react";
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
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function ChangeNicknameScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const nicknameRegex = /^[a-z0-9가-힣]{2,8}$/i;
    setIsValid(nickname === "" || nicknameRegex.test(nickname));
  }, [nickname]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        console.log("userId from storage:", id);
        if (id) setUserId(id);
      } catch (error) {
        console.log("유저 ID 불러오기 실패", error);
      }
    };
    fetchUserId();
  }, []);

  const handleSubmit = () => {
    if (!isValid || nickname === "" || userId === "") return;
    setLoading(true);

    axios
      .post(`${process.env.EXPO_PUBLIC_API_URL}/user/changeName`, {
        userId: userId,
        newName: nickname,
      })
      .then((response) => {
        console.log("[changeName] Response:", response.data);
        if (response.data.success) {
          AsyncStorage.setItem("NickName", nickname)
            .then(() => {
              setModalVisible(true);
            })
            .catch((err) => {
              console.log("[AsyncStorage.setItem] Error:", err);
            });
        } else {
          Alert.alert(
            "실패",
            response.data.message || "닉네임 변경에 실패했습니다."
          );
        }
      })
      .catch((error) => {
        console.log("[changeName] Error:", error);
        Alert.alert("에러", "서버와의 통신에 실패했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

    const handleModalConfirm = () => {
        setModalVisible(false);
        router.replace("/myPage");
    };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/myPage")}>
          <Image
            source={require("../../assets/icons/arrow1.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.title}>닉네임 변경</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.form}>
          <Text style={styles.label}>닉네임 변경</Text>
          <TextInput
            style={styles.input}
            placeholder="2~8자 영대소문자, 한글, 숫자 사용 가능"
            value={nickname}
            onChangeText={setNickname}
          />

          {!isValid && (
            <Text style={styles.error}>닉네임 양식이 올바르지 않습니다.</Text>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* 확인 버튼 - 하단 고정 */}
      <View style={styles.bottomButtonWrapper}>
        <TouchableOpacity
          style={styles.button}
          disabled={!isValid || nickname === "" || loading}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>{loading ? "처리 중..." : "확인"}</Text>
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
            닉네임이 {nickname}(으)로 변경되었습니다.
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
  backIcon: { width: 24, height: 48 },
  title: { fontSize: 20, fontWeight: "Regular" },
  form: { flex: 1 },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#808080",
  },
  input: {
    height: 44,
    borderWidth: 0.5,
    borderColor: "#CCCCCC",
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
    color: "#808080",
  },
  error: { color: "#FF5151", fontSize: 12, marginBottom: 10 },
  bottomButtonWrapper: {
    position: "absolute",
    left: 20,
    right: 20,
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
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
