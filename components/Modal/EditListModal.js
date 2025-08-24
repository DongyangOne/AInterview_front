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
  onUpdateMemo,
}) => {
  const close = () => setOpenModalItemId(null);


  const [memoModalVisible, setMemoModalVisible] = useState(false);


  const [memoInputText, setMemoInputText] = useState("");
  const [memoNum, setMemoNum] = useState(0);


  useEffect(() => {
    setMemoNum(memoInputText.length);
  }, [memoInputText]);

  const [selectedId, setSelectedId] = useState(null);

  const openModal = (id) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  useEffect(() => {
    if (isModalVisible) {
      setMemoInputText(item?.memo || "");
    }
  }, [isModalVisible, item]);



  if (memoNum >= 50) {
    alert("범위를 초과하였습니다");
  }
  else {
  }

  const [newMemo, setNewMemo] = useState("");



  const changeMemo = async (itemId, newMemo) => {


    try {
      const usersId = await AsyncStorage.getItem("userId");
      const feedbackId = itemId;
      console.log(usersId);

      if (usersId) {
        await axios
          .get(`${process.env.EXPO_PUBLIC_API_URL}/feedback/${usersId}/${feedbackId}/memo`)
          .then(async (res) => {
            const url = `${process.env.EXPO_PUBLIC_API_URL}/feedback/${usersId}/${feedbackId}/memo`;
            const ress = await axios.patch(url, {
              memo: newMemo,
            })
            const updatedFeedback = ress.data;
            console.log("수정된 데이터:", updatedFeedback);
            console.log("PATCH URL:", url);

          })
          .catch((err) => {
            console.error("memo를 수정하지 못했습니다.", err);
          })
      }
      else {
        console.log("memo가 저장되어 있지 않습니다.");
      }


    } catch (err) {
      console.error("오류발생", err);
    }
  };









  return (

    <View style={[styles.container, { top: adjustedTop }]}>
      <Pressable
        style={[styles.wrapText, { borderBottomWidth: 0.3 }]}
      >
        <Text style={styles.text}>{isPinned ? "최상단 고정 해제" : "최상단 고정"}</Text>
      </Pressable>


      <Pressable
        onPress={() => {
          setSelectedId(item.id);
        }}
        style={[styles.wrapText, { borderBottomWidth: 0.3 }]}>
        <Text style={styles.text}>제목 수정</Text>
      </Pressable>



      <Pressable
        onPress={() => {
          setMemoModalVisible(true);
          setMemoInputText(item.memo);
          setSelectedId(item.id);
        }}
        style={[styles.wrapText, { borderBottomWidth: 0.3 }]}
      >
        <Text style={styles.text}>메모 수정</Text>
      </Pressable>
      <Modal
        animationType="fade"
        transparent={true}
        visible={memoModalVisible}
        onRequestClose={() => setMemoModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            width: 350,
            height: 380,
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 10,
            elevation: 5,
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 18, fontWeight: 600, marginBottom: 15 }}>메모 수정</Text>
            <Text style={{ fontSize: 12, marginBottom: 7, marginLeft: 240, color: '#808080' }}>{memoNum}/50</Text>
            <TextInput style={{
              width: 295, height: 230, borderRadius: 10,
              borderWidth: 0.5, borderColor: '#CCCCCC', paddingLeft: 20,
              paddingBottom: 170, fontSize: 16, multiline: 'true',
            }} placeholder='메모를 작성해주세요'
              value={memoInputText}
              onChangeText={setMemoInputText}
            />
            <View style={{ flexDirection: 'row', }}>
              <TouchableOpacity onPress={() => { setMemoModalVisible(false), setMemoNum(0) }}>
                <View style={[styles.modalBtn, { marginRight: 15, marginTop: 15, backgroundColor: '#DDDDDD' }]}>
                  <Text style={{ fontSize: 16, }}>취소</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={async () => {
                await changeMemo(selectedId, memoInputText); // 서버 PATCH
                onUpdateMemo && onUpdateMemo(selectedId, memoInputText); // 부모에 반영
                setMemoModalVisible(false);
              }}>
                <View style={[styles.modalBtn, { marginTop: 15, backgroundColor: '#5900FF' }]}>
                  <Text style={{ fontSize: 16, color: 'white' }}>저장</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
