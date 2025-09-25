import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import CustomModal from "../components/Modal/Close";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Interview_result() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>처리가 완료되었습니다.</Text>
      <TouchableOpacity
        onPress={() => router.push("/home")}
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>홈으로 이동하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Pretendard",
    color: "#191919",
    marginLeft: 8,
    marginBottom: 30,
    textAlign: "left",
  },
  saveButton: {
    height: 67,
    width: 348,
    marginLeft: 8,
    marginTop: 175,
    marginBottom: 140,
    borderRadius: 10,
    backgroundColor: "#5900FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Pretendard",
  },
});
