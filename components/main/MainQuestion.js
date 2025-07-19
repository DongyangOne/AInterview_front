import { Text, View, StyleSheet } from "react-native";

export default function MainQuestion() {
  return (
    <View style={styles.container}>
      <Text style={styles.questionTitle}>오늘의 질문</Text>
      <Text style={styles.questionContent}>
        가장 최선을 다했던 경험은 무엇인가요?
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
