import { Pressable, StyleSheet, View, Text } from "react-native";

const EditListModal = ({
  item,                 // 선택된 아이템(id 또는 객체)
  setOpenModalItemId,
  isModalVisible,
  isPinned,             // <-- 추가: 현재 고정 여부
  onTogglePin,          // <-- 추가: 고정/해제 실행 함수
}) => {
  const close = () => setOpenModalItemId(isModalVisible ? null : item);

  return (
    <View style={styles.container}>
      {/* 최상단 고정 / 해제 */}
      <Pressable
        onPress={() => {
          close();
          onTogglePin && onTogglePin();   // axios PATCH 호출 (부모에서 전달)
        }}
        style={[styles.wrapText, { borderBottomWidth: 0.3 }]}
      >
        <Text style={styles.text}>{isPinned ? "최상단 고정 해제" : "최상단 고정"}</Text>
      </Pressable>

      {/* 아래 세 버튼은 기존 동작 그대로(닫기만) */}
      <Pressable onPress={close} style={[styles.wrapText, { borderBottomWidth: 0.3 }]}>
        <Text style={styles.text}>제목 수정</Text>
      </Pressable>
      <Pressable onPress={close} style={[styles.wrapText, { borderBottomWidth: 0.3 }]}>
        <Text style={styles.text}>메모 수정</Text>
      </Pressable>
      <Pressable onPress={close} style={styles.wrapText}>
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
  text: { fontSize: 14 },
});

export default EditListModal;
