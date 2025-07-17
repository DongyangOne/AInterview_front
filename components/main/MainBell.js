import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function MainBell() {
  const router = useRouter();

  return (
    <View style={styles.mainBellView}>
      <TouchableOpacity
        onPress={() => router.push("../(auth)/bell")}
        style={styles.bell}
      >
        <Image
          source={require("../../assets/icons/bell.png")}
          style={styles.bellImg}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBellView: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: "4%",
  },
  bellImg: { width: 24, height: 24, right: 32 },
  bell: { padding: 6 },
});
