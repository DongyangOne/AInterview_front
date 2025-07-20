import { StyleSheet, View, Text, Pressable } from "react-native";

const AlignModal = ({ setOpen }) => {
  const onClick = () => {
    setOpen(false);
  };
  return (
    <View style={styles.conatiner}>
      <Pressable
        onPress={onClick}
        style={[styles.wrapText, { borderBottomWidth: 0.3 }]}
      >
        <Text style={styles.text}>최근 날짜 순</Text>
      </Pressable>
      <Pressable onPress={onClick} style={styles.wrapText}>
        <Text style={styles.text}>가나다 순</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    backgroundColor: "white",
    width: 113,
    height: 66,
    position: "absolute",
    top: 30,
    right: 1, // <- SafeAreaView padding에 맞추기
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 9999,
  },
  wrapText: {
    height: 33,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
  },
});

export default AlignModal;
