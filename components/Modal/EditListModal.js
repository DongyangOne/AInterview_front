import {
  Pressable, StyleSheet, View, Text, Modal, TextInput,
  TouchableOpacity, Alert, ScrollView, Image
} from "react-native";
import { useState, useEffect } from 'react';

const EditListModal = ({
  item,                 // 선택된 아이템(id 또는 객체)
  setOpenModalItemId,
  isModalVisible,
  isPinned,             // <-- 추가: 현재 고정 여부
  onTogglePin,          // <-- 추가: 고정/해제 실행 함수
}) => {
  const close = () => setOpenModalItemId(isModalVisible ? null : item);


  const [titleModalVisible, setTitleModalVisible] = useState(false);
  const [memoModalVisible, setMemoModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const handleDelete = () => {
    setFeedbacks((prevFeedbacks) =>
      prevFeedbacks.filter((item) => item.id !== selectedId)
    );
    setModalVisible(false);
  };


  const [inputText, setInputText] = useState("");
  const [titleNum, setTitleNum] = useState(0);
  const [memoNum, setMemoNum] = useState(0);

  useEffect(() => {
      setTitleNum(inputText.length);
    }, [inputText]);
  useEffect(() => {
    setMemoNum(inputText.length);
  }, [inputText]);

  const [feedbacks, setFeedbacks] = useState([
    { id: 1, memo: "기존 메모1" },
    { id: 2, memo: "기존 메모2" },
  ]);
  const [selectedId, setSelectedId] = useState(null); // 어떤 항목을 수정 중인지 식별

  // 제목 수정 누르면 모달 열기 + 선택된 id 저장
  const openModal = (id) => {
    setSelectedId(id);
    setModalVisible(true);
  };
  useEffect(() => {
    if (isModalVisible) {
      setInputText(item?.memo || "");
    }
  }, [isModalVisible, item]);


    if(titleNum>20) {
    alert("범위를 초과하였습니다");
    }
    else {
    }
    if(memoNum>=50) {
    alert("범위를 초과하였습니다");
    }
    else {
    }



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
      <Pressable
        onPress={() => {
          setTitleModalVisible(true);
          setInputText(item.title);
          setSelectedId(item.id);
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
              value={inputText}
              onChangeText={setInputText}
//              setTitleNum={inputText}
            />
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => {setTitleModalVisible(false), setTitleNum(0)}}>
                <View style={[styles.modalBtn, { marginRight: 15, marginTop: 15, backgroundColor: '#DDDDDD' }]}>
                  <Text style={{ fontSize: 16 }}>취소</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                setFeedbacks((prev) =>
                  prev.map((item) =>
                    item.id === selectedId ? { ...item, title: inputText } : item
                  )
                );
                setTitleModalVisible(false);
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
          setMemoModalVisible(true);
          setInputText(item.title);
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
            onChangeText={setInputText}
            />
            <View style={{ flexDirection: 'row', }}>
              <TouchableOpacity onPress={() => {setMemoModalVisible(false), setMemoNum(0)}}>
                <View style={[styles.modalBtn, { marginRight: 15, marginTop: 15, backgroundColor: '#DDDDDD' }]}>
                  <Text style={{ fontSize: 16, }}>취소</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                Alert.alert('저장 버튼 클릭됨');
                setMemoModalVisible(false);
                setFeedbacks((prev) =>
                  prev.map((item) =>
                    item.id === selectedId ? { ...item, memo: inputText } : item
                  )
                );
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
          setMemoModalVisible(true);
          setInputText(item.title);
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
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
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

              <TouchableOpacity onPress={handleDelete}>
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
  modalBtn: {
    width: 140,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EditListModal;
