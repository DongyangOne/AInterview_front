import { View, StyleSheet } from "react-native";

export default function RoundedBar({
  value = 0,
  height = 7,
  backgroundColor = "#E4E4E4",
  barColor = "#5900FF",
}) {
  const percent = Math.max(0, Math.min(100, value));
  return (
    <View
      style={[
        styles.barContainer,
        { height, backgroundColor, borderRadius: height / 2 },
      ]}
    >
      <View
        style={{
          width: `${percent}%`,
          height: "100%",
          backgroundColor: barColor,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    flexDirection: "column",
    alignItems: "stretch",
    paddingHorizontal: "4%",
    paddingVertical: "3%",
    marginTop: "10%",
    marginBottom: "10%",
    overflow: "hidden",
  },
});
