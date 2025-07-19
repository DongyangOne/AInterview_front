import { StyleSheet, Text, View,SafeAreaView } from "react-native";
import FeedbackDetail from '../screens/FeedbackDetail.jsx';

export default function Feedback() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex:1}}>
      <FeedbackDetail/>
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
