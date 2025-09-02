import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { useState, useEffect, memo } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenHeight = Dimensions.get("window").height;

const menuHeight = 200;
const topPosition = 50;
const adjustedTop =
  topPosition + menuHeight > screenHeight ? screenHeight - menuHeight - 20 : topPosition;

const EditListModal = ({
  item,
  setOpenModalItemId,
  isModalVisible,
  isPinned,
  onUpdateTitle,
  onUpdateMemo,
  onDelete,
  onPin,
}) => {
  const close = () => setOpenModalItemId(null);

  const [titleModalVisible, setTitleModalVisible] = useState(false);
  const [memoModalVisible, setMemoModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [titleInputText, setTitleInputText] = useState("");
  const [memoInputText, setMemoInputText] = useState("");
  const [titleNum, setTitleNum] = useState(0);
  const [memoNum, setMemoNum] = useState(0);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTitleNum(titleInputText.length);
  }, [titleInputText]);

  useEffect(() => {
    setMemoNum(memoInputText.replace(/\r?\n/g, "").length);
  }, [memoInputText]);

  useEffect(() => {
    if (isModalVisible) {
      setTitleInputText(item?.title || "");
      setMemoInputText(item?.memo || "");
    }
  }, [isModalVisible, item]);

  const [selectedId, setSelectedId] = useState(null);

  const changeTitle = async (itemId, newTitle) => {
    try {
      const usersId = await AsyncStorage.getItem("userId");
      const feedbackId = itemId;

      if (usersId) {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/feedback/${usersId}/${feedbackId}/title`;
        const res = await axios.patch(url, {
          title: newTitle,
        });
        const updatedFeedback = res.data;
        onUpdateTitle(itemId, newTitle);
        console.log("수정된 데이터:", updatedFeedback);
      } else {
        console.log("userId가 저장되어 있지 않습니다.");
      }
    } catch (err) {
      console.error("title을 수정하지 못했습니다.", err);
    }
  };

  const changeMemo = async (itemId, newMemo) => {
    try {
      const usersId = await AsyncStorage.getItem("userId");
      const feedbackId = itemId;

      if (usersId) {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/feedback/${usersId}/${feedbackId}/memo`;
        const res = await axios.patch(url, {
          memo: newMemo,
        });
        const updatedFeedback = res.data;
        onUpdateMemo(itemId, newMemo);
        console.log("수정된 데이터:", updatedFeedback);
      } else {
        console.log("userId가 저장되어 있지 않습니다.");
      }
    } catch (err) {
      console.error("memo를 수정하지 못했습니다.", err);
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

  const feedbackPin = async (itemId) => {
    try {
      const usersId = await AsyncStorage.getItem("userId");
      const feedbackId = itemId;
      if (!usersId) return;

      const url = `${process.env.EXPO_PUBLIC_API_URL}/feedback/pin/${feedbackId}/${usersId}`;
      const res = await axios.patch(url);
      const updatedFeedback = res.data;
      onPin(feedbackId, "Y");
      console.log("최상단 고정 완료 feedbackId:", feedbackId, updatedFeedback);
    } catch (err) {
      console.error("최상단 고정을 수정하지 못했습니다.", err);
    }
  };

  const feedbackUnPin = async (itemId) => {
    try {
      const usersId = await AsyncStorage.getItem("userId");
      const feedbackId = itemId;
      if (!usersId) return;

      const url = `${process.env.EXPO_PUBLIC_API_URL}/feedback/unpin/${feedbackId}/${usersId}`;
      const res = await axios.patch(url);
      const updatedFeedback = res.data;
      onPin(feedbackId, "N");
      console.log("최상단 고정 해제 완료 feedbackId:", feedbackId, updatedFeedback);
    } catch (err) {
      console.error("최상단 고정해제를 수정하지 못했습니다.", err);
    }
  };

  const handleTitleChange = (text) => {
    if (text.length >= 20) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    setTitleInputText(text);
  };

  const handleMemoChange = (text) => {
    const cleanedText = text.replace(/\r?\n/g, "");
    if (cleanedText.length >= 50) {
      setOpen(true);
      setMemoInputText(text.substring(0, text.length));
    } else {
      setOpen(false);
      setMemoInputText(text);
    }
  };
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open]);
  const handleSaveMemo = async () => {
    const memoToSave = memoInputText.replace(/\r?\n/g, "");
    await changeMemo(selectedId, memoToSave);
    setMemoModalVisible(false);
  };

  const handleSaveTitle = async () => {
    await changeTitle(selectedId, titleInputText);
    setTitleModalVisible(false);
  };

  const handleConfirmDelete = async () => {
    const success = await feedbackDelete(selectedId);
    if (success) {
      onDelete && onDelete(selectedId);
      close();
    } else {
      Alert.alert("삭제 실패", "서버에서 삭제하지 못했습니다.");
    }
    setDeleteModalVisible(false);
  };

  return (
    <View style={[styles.container, { top: adjustedTop }]}>
      {isPinned ? (
        <Pressable onPress={() => feedbackUnPin(item.id)} style={[styles.wrapText, { borderBottomWidth: 0.3 }]}>
          <Text style={styles.text}>최상단 고정 해제</Text>
        </Pressable>
      ) : (
        <Pressable onPress={() => feedbackPin(item.id)} style={[styles.wrapText, { borderBottomWidth: 0.3 }]}>
          <Text style={styles.text}>최상단 고정</Text>
        </Pressable>
      )}

      <Pressable
        onPress={() => {
          setTitleModalVisible(true);
          setTitleInputText(item.title);
          setSelectedId(item.id);
        }}
        style={[styles.wrapText, { borderBottomWidth: 0.3 }]}
      >
        <Text style={styles.text}>제목 수정</Text>
      </Pressable>
      <Modal animationType="fade" transparent={true} visible={titleModalVisible} onRequestClose={() => setTitleModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>제목 수정</Text>
            <Text style={styles.charCount}>{titleNum}/20</Text>
            <TextInput
              style={styles.textInput}
              value={titleInputText}
              onChangeText={handleTitleChange}
              maxLength={20}
            />
            {open ? (<Modal visible={open} transparent={true} animationType="fade">
              <View style={styles.limitModal2}>
                <Image source={require("../../assets/icons/warning2.png")} style={styles.warningIcon} />
                <Text style={styles.warningText}>글자 수 제한을 초과하였습니다.</Text>
                <Text style={styles.subWarningText}>다시 확인해주세요.</Text>
              </View>
            </Modal>
            ) : null}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setTitleModalVisible(false)}>
                <View style={[styles.modalBtn, styles.cancelBtn]}>
                  <Text style={styles.btnText}>취소</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveTitle}>
                <View style={[styles.modalBtn, styles.saveBtn]}>
                  <Text style={[styles.btnText, styles.saveText]}>저장</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
      <Modal animationType="fade" transparent={true} visible={memoModalVisible} onRequestClose={() => setMemoModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.memoModalContent]}>
            <Text style={styles.modalTitle}>메모 수정</Text>
            <Text style={styles.charCount}>{memoNum}/50</Text>
            <TextInput
              style={styles.memoTextInput}
              placeholder="메모를 작성해주세요"
              value={memoInputText}
              onChangeText={handleMemoChange}
              multiline={true}
              textAlignVertical="top"
              maxLength={50}
            />
            {open ? (<Modal visible={open} transparent={true} animationType="fade">
              <View style={styles.limitModal2}>
                <Image source={require("../../assets/icons/warning2.png")} style={styles.warningIcon} />
                <Text style={styles.warningText}>글자 수 제한을 초과하였습니다.</Text>
                <Text style={styles.subWarningText}>다시 확인해주세요.</Text>
              </View>
            </Modal>
            ) : null}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setMemoModalVisible(false)}>
                <View style={[styles.modalBtn, styles.cancelBtn]}>
                  <Text style={styles.btnText}>취소</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveMemo}>
                <View style={[styles.modalBtn, styles.saveBtn]}>
                  <Text style={[styles.btnText, styles.saveText]}>저장</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <Pressable
        onPress={() => {
          setDeleteModalVisible(true);
          setSelectedId(item.id);
        }}
        style={styles.wrapText}
      >
        <Text style={styles.text}>기록 삭제</Text>
      </Pressable>
      <Modal animationType="fade" transparent={true} visible={deleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image source={require("../../assets/images/tri.png")} style={styles.deleteIcon} />
            <Text style={styles.deleteTitle}>정말 삭제 하시겠습니까?</Text>
            <Text style={styles.deleteSubtitle}>삭제하시면 복구가 불가합니다.</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
                <View style={[styles.modalBtn, styles.cancelBtn]}>
                  <Text style={styles.btnText}>취소</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmDelete}>
                <View style={[styles.modalBtn, styles.deleteBtn]}>
                  <Text style={[styles.btnText, styles.saveText]}>삭제</Text>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 350,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  memoModalContent: {
    height: 380,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  charCount: {
    fontSize: 12,
    marginBottom: 7,
    marginLeft: "auto",
    color: "#808080",
  },
  textInput: {
    width: 300,
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#CCCCCC",
    paddingLeft: 20,
  },
  memoTextInput: {
    width: 295,
    height: 230,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#CCCCCC",
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  modalBtn: {
    width: 140,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 7.5,
  },
  cancelBtn: {
    backgroundColor: "#DDDDDD",
  },
  saveBtn: {
    backgroundColor: "#5900FF",
  },
  deleteBtn: {
    backgroundColor: "#FF3B30",
  },
  btnText: {
    fontSize: 16,
  },
  saveText: {
    color: "white",
  },
  limitModal: {
    position: "absolute",
    top: 167,
    left: 75,
    width: 240,
    height: 80,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    padding: 10,
  },
  limitModal2: {
    position: "absolute",
    top: 92,
    left: 75,
    width: 240,
    height: 80,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    padding: 10,
  },
  warningIcon: {
    width: 13,
    height: 13,
  },
  warningText: {
    fontSize: 14,
    marginTop: 5,
  },
  subWarningText: {
    fontSize: 14,
    color: "#808080",
    marginTop: 2,
  },
  deleteIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
  },
  deleteSubtitle: {
    fontSize: 14,
    color: "#808080",
    marginTop: 5,
  },
});

export default EditListModal;