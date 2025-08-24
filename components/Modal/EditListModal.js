import {
  Pressable, StyleSheet, View, Text, Modal, TextInput,
  TouchableOpacity, Alert, ScrollView, Image
} from "react-native";
import { useState, useEffect } from 'react';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";

const screenHeight = Dimensions.get("window").height;

const menuHeight = 200; // 예상 메뉴 높이
const topPosition = 50;
const adjustedTop = topPosition + menuHeight > screenHeight
  ? screenHeight - menuHeight - 20
  : topPosition;

const EditListModal = ({
  item,
  setOpenModalItemId,
  isModalVisible,
  isPinned,
}) => {
  const close = () => setOpenModalItemId(null);



  const [titleInputText, setTitleInputText] = useState("");
  const [memoInputText, setMemoInputText] = useState("");
  const [titleNum, setTitleNum] = useState(0);
  const [memoNum, setMemoNum] = useState(0);



  useEffect(() => {
    setTitleNum(titleInputText.length);
  }, [titleInputText]);
  useEffect(() => {
    setMemoNum(memoInputText.length);
  }, [memoInputText]);

  const [selectedId, setSelectedId] = useState(null);


  if (titleNum > 20) {
    alert("범위를 초과하였습니다");
  }
  else {
  }
  if (memoNum >= 50) {
    alert("범위를 초과하였습니다");
  }
  else {
  }







  return (

    <View style={[styles.container, { top: adjustedTop }]}>
      <Pressable
        style={[styles.wrapText, { borderBottomWidth: 0.3 }]}
      >
        <Text style={styles.text}>{isPinned ? "최상단 고정 해제" : "최상단 고정"}</Text>
      </Pressable>


      <Pressable
        onPress={() => {
          setTitleInputText(item.title);
          setSelectedId(item.id);
        }}
        style={[styles.wrapText, { borderBottomWidth: 0.3 }]}>
        <Text style={styles.text}>제목 수정</Text>
      </Pressable>


      <Pressable
        onPress={() => {
          setSelectedId(item.id);
        }}
        style={[styles.wrapText, { borderBottomWidth: 0.3 }]}
      >
        <Text style={styles.text}>메모 수정</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          setSelectedId(item.id);
        }}
        style={styles.wrapText}
      >
        <Text style={styles.text}>기록 삭제</Text>
      </Pressable>

    </View >
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
  modalBtn: {
    width: 140,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EditListModal;
