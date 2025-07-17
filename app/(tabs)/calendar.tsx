import { StyleSheet, View, Text } from "react-native";
import Logout from "../(auth)/Logout";
export default function Calendar() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>캘린더 페이지</Text>
      <View style={styles.separator} />
      <Logout></Logout>
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
