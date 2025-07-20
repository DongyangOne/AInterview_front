import { StyleSheet, View, SafeAreaView } from "react-native";
import Feedback_result from '../screens/Feedback_result.jsx';

export default function Feedback() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 0 }}>
      <Feedback_result />
    </SafeAreaView>
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
