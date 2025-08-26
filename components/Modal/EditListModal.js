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
  onUpdateTitle,
  onDelete,
}) => {
  const close = () => setOpenModalItemId(null);

  const [titleModalVisible, setTitleModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);



  const [titleInputText, setTitleInputText] = useState("");
  const [titleNum, setTitleNum] = useState(0);



  useEffect(() => {
    setTitleNum(titleInputText.length);
  }, [titleInputText]);


  const [selectedId, setSelectedId] = useState(null);


  const openModal = (id) => {
    setSelectedId(id);
    setModalVisible(true);
  };
  useEffect(() => {
    if (isModalVisible) {
      setTitleInputText(item?.title || "");
    }
  }, [isModalVisible, item]);

  if (titleNum > 20) {
    alert("범위를 초과하였습니다");
  }
  else {
  }


  const [newTitle, setNewTitle] = useState("");
  const changeTitle = async (itemId, newTitle) => {


    try {
      const usersId = await AsyncStorage.getItem("userId");
      const feedbackId = itemId;
      console.log(usersId);

      if (usersId) {
        await axios
          .get(`${process.env.EXPO_PUBLIC_API_URL}/feedback/${usersId}/${feedbackId}/title`)
          .then(async (res) => {
            const url = `${process.env.EXPO_PUBLIC_API_URL}/feedback/${usersId}/${feedbackId}/title`;
            const ress = await axios.patch(url, {
              title: newTitle,
            })
            const updatedFeedback = ress.data;
            console.log("수정된 데이터:", updatedFeedback);
            console.log("PATCH URL:", url);

          })
          .catch((err) => {
            console.error("title을 수정하지 못했습니다.", err);
          })
      }
      else {
        console.log("userId가 저장되어 있지 않습니다.");
      }


    } catch (err) {
      console.error("오류발생", err);
    }
  };




  const feedbackDelete = async (itemId) => {
    try {
      const usersId = await AsyncStorage.getItem("userId");
      const feedbackId = itemId;
      if (!usersId) return false;

      const url = `${process.env.EXPO_PUBLIC_API_URL}/feedback/${feedbackId}/${usersId}`;
      const res = await axios.delete(url);

      if (res?.data?.success) {
        console.log("삭제 완료");
        return true;
      } else {
        console.log("삭제 실패", res?.data);
        return false;
      }
    } catch (error) {
      console.error("삭제 중 오류 발생", error);
      return false;
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
          setTitleInputText(item.title);
          setSelectedId(item.id);
          setTitleModalVisible(true);
        }}
        style={[styles.wrapText, { borderBottomWidth: 0.3 }]}>
        <Text style={styles.text}>제목 수정</Text>
      </Pressable>
      <Modal
        animationType="fade"
        transparent={true}
        visible={titleModalVisible}
        onRequestClose={() => setTitleModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            width: 350,
            height: 210,
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 10,
            elevation: 5,
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 15 }}>제목 수정</Text>
            <Text style={{ fontSize: 12, marginBottom: 7, marginLeft: 240, color: '#808080' }}>{titleNum}/20</Text>
            <TextInput
              style={{
                width: 300, height: 50, borderRadius: 10,
                borderWidth: 0.5, borderColor: '#CCCCCC', paddingLeft: 20
              }}
              value={titleInputText}
              onChangeText={setTitleInputText}
            />
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => { setTitleModalVisible(false), setTitleNum(0) }}>
                <View style={[styles.modalBtn, { marginRight: 15, marginTop: 15, backgroundColor: '#DDDDDD' }]}>
                  <Text style={{ fontSize: 16 }}>취소</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={async () => {
                await changeTitle(selectedId, titleInputText);
                onUpdateTitle && onUpdateTitle(selectedId, titleInputText);
                setTitleModalVisible(false);
              }}>
                <View style={[styles.modalBtn, { marginTop: 15, backgroundColor: '#5900FF' }]}>
                  <Text style={{ fontSize: 16, color: 'white' }}>저장</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </Modal >


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
          setDeleteModalVisible(true);
          setSelectedId(item.id);
        }}
        style={styles.wrapText}
      >
        <Text style={styles.text}>기록 삭제</Text>
      </Pressable>
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 350,
              height: 215,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
              elevation: 5,
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/images/tri.png")}
              style={{ width: 50, height: 50 }}
            />

            <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 20 }}>
              정말 삭제 하시겠습니까?
            </Text>
            <Text style={{ fontSize: 14, color: "#808080", marginTop: 5 }}>
              삭제하시면 복구가 불가합니다.
            </Text>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => {
                setDeleteModalVisible(false);
              }}>
                <View
                  style={[
                    styles.modalBtn,
                    {
                      marginRight: 15,
                      marginTop: 15,
                      backgroundColor: "#DDDDDD",
                    },
                  ]}
                >
                  <Text style={{ fontSize: 16 }}>취소</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={async () => {
                const success = await feedbackDelete(selectedId);
                if (success) {
                  onDelete && onDelete(selectedId); // 부모 state 반영
                  close(); // 메인 모달도 닫기
                } else {
                  Alert.alert("삭제 실패", "서버에서 삭제하지 못했습니다.");
                }
                setDeleteModalVisible(false);
              }}>
                <View
                  style={[
                    styles.modalBtn,
                    { marginTop: 15, backgroundColor: "#FF3B30" },
                  ]}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>삭제</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
