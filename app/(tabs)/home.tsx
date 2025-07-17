import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountDelte from "../(auth)/AccountDelete";
export default function home() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>메인페이지</Text>
      <View style={styles.separator} />
      <AccountDelte />
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
