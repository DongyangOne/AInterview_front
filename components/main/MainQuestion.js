import { Text, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MainQuestion() {
  const [questToday, setQuestToday] = useState("");

  useEffect(() => {
    const fetchQuestion = async () => {
      const today = new Date().toLocaleDateString();
      try {
        const lastDate = await AsyncStorage.getItem("lastDate");
        const TodayQuest = await AsyncStorage.getItem("questToday");

        console.log("lastDate:", lastDate);
        console.log("TodayQuest:", TodayQuest);

        if (lastDate !== today) {
          // 날짜 다르면 새로운 질문 요청
          const res = await axios.get(
            "http://183.101.17.181:3001/question/today"
          );
          const question = res.data.data.question;

          console.log("새 질문 받아옴:", question);

          setQuestToday(question);
          await AsyncStorage.setItem("lastDate", today);
          await AsyncStorage.setItem("questToday", question);
        } else {
          // 날짜 같으면 저장된 질문 사용
          if (TodayQuest) {
            console.log("저장된 질문 사용");
            setQuestToday(TodayQuest);
          } else {
            console.log("저장된 질문 없음");
          }
        }
      } catch (err) {
        console.error("오류발생", err);
      }
    };

    fetchQuestion();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.questionTitle}>오늘의 질문</Text>
      <Text style={styles.questionContent}>
        {questToday ? questToday : "로딩 중..."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: "11%",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    marginTop: "7%",
    marginBottom: "5%",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 26,
  },
  questionTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: "#191919",
    marginBottom: "4%",
  },
  questionContent: {
    fontWeight: "400",
    fontSize: 14,
    color: "#191919",
  },
});
