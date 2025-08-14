import { Pressable, StyleSheet, View, Text } from "react-native";

const EditListModal = ({ item, setOpenModalItemId, isModalVisible }) => {
  const onClick = () => {
    setOpenModalItemId(isModalVisible ? null : item);
  };
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onClick}
        style={[styles.wrapText, { borderBottomWidth: 0.3 }]}
      >
        <Text style={styles.text}>최상단 고정</Text>
      </Pressable>
      <Pressable
        onPress={onClick}
        style={[styles.wrapText, { borderBottomWidth: 0.3 }]}
      >
        <Text style={styles.text}>제목 수정</Text>
      </Pressable>
      <Pressable
        onPress={onClick}
        style={[styles.wrapText, { borderBottomWidth: 0.3 }]}
      >
        <Text style={styles.text}>메모 수정</Text>
      </Pressable>
      <Pressable onPress={onClick} style={styles.wrapText}>
        <Text style={styles.text}>기록 삭제</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: 157,
    height: 182,
    position: "absolute",
    top: 50,
    right: 1,
    zIndex: 10000,
    elevation: 10000,
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 9999,
  },
  wrapText: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
  },
});

export default EditListModal;
