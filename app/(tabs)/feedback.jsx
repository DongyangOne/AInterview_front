import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import Feedback_detail from '../Feedback_detail';
import Feedback_result from '../Feedback_result';



export default function Feedback() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>피드백 페이지</Text>
      <View style={styles.separator} />
       <SafeAreaView style={{ flex: 1 }}>
            <Feedback_detail />
            <Feedback_result />
          </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
