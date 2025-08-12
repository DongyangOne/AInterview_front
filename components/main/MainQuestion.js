import { Text, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@env";

export default function MainQuestion() {
  const [questToday, setQuestToday] = useState("");

  useEffect(() => {
    const getQuestion = async () => {
      const today = new Date().toLocaleDateString("ko-KR");
      try {
        const lastDate = await AsyncStorage.getItem("lastDate");
        const TodayQuest = await AsyncStorage.getItem("questToday");
        // 1. 날짜가 다르거나, 저장된 질문 자체가 없을 때 무조건 새로 가져옴
        if (lastDate !== today || !TodayQuest) {
          const res = await axios.get(`${API_URL}/question/today`);
          const question = res.data.data[0].question;
          console.log("새 질문 받아옴:", question);
          setQuestToday(question);
          await AsyncStorage.setItem("lastDate", today);
          await AsyncStorage.setItem("questToday", question);
          console.log(today);
          console.log(question);
        } else {
          // 2. 오늘 날짜고 저장된 질문 있으면 그걸 사용
          setQuestToday(TodayQuest);
          console.log("저장된 질문:", questToday);
          console.log("저장된 날짜:", today);
        }
      } catch (err) {
        console.error("오류발생", err);
      }
    };

    getQuestion();
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
