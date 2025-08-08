import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";

export default function FeedbackDetail() {
  const [memo, setMemo] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // 실제 값으로 교체
  const userId = "1";
  const feedbackId = "34";

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get(`http://183.101.17.181:3001/feedback/${userId}/${feedbackId}`);
        // res.data.data가 단일 객체임!
        const feedback = res.data.data;
        setMemo(feedback.memo || "");
        setTitle(feedback.title || "");
        setContent(feedback.content || "");
      } catch (error) {
        console.error("피드백 조회 실패:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <Text>로딩중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../../assets/icons/arrow1.png")}
            style={styles.headerIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>피드백 상세</Text>
        <TouchableOpacity>
          <Image
            source={require("../../assets/icons/dots.png")}
            style={styles.headerIcon2}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.bodyText}>{content}</Text>
        <Text style={styles.memoTitle}>메모</Text>
        <TextInput
          style={styles.memoInput}
          placeholder="메모를 입력하세요..."
          multiline
          value={memo}
          onChangeText={setMemo}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32, // <- 좌우 마진 32
    backgroundColor: "#fff",
  },
  headerIcon: {
    width: 24,
    height: 48,
  },
  headerIcon2: {
    width: 28,
    height: 28,
  },
  headerTitle: {
    fontSize: 20,
    color: "#191919",
  },
  container: {
    paddingHorizontal: 32, // <- 좌우 마진 32
    paddingTop: 32,
    paddingBottom: 28,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 28,
    fontWeight: "500",
    color: "#191919",
  },
  section: {
    marginBottom: 22,
  },
  labelGood: {
    color: "#A495CF",
    fontWeight: "600",
    marginBottom: 15,
    fontSize: 13,
  },
  labelBad: {
    color: "#A495CF", // 보라색으로 통일
    fontWeight: "600",
    marginBottom: 15,
    fontSize: 13,
  },
  labelTip: {
    color: "#A495CF",
    fontWeight: "600",
    marginBottom: 15,
    fontSize: 13,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#191919",
    marginBottom: 10,
  },
  memoTitle: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 51,
    marginBottom: 13,
    color: "#191919",
  },
  memoInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 16, // padding도 조금 더 크게
    fontSize: 16,
    color: "#333",
    minHeight: 100, // <<<<< 더 넉넉하게 (기존 60 -> 100)
    textAlignVertical: "top",
    backgroundColor: "#fff",
    marginBottom: 18,
  },
});
