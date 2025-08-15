import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";

import React, { useState } from "react";

export default function MemoChangeModal({ visible, onCancel }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedId, setSelectedId] = useState(null); // 어떤 항목을 수정 중인지 식별

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
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
            height: 380,
            padding: 20,
            backgroundColor: "white",
            borderRadius: 10,
            elevation: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 600, marginBottom: 15 }}>
            메모 수정
          </Text>
          <Text
            style={{
              fontSize: 12,
              marginBottom: 7,
              marginLeft: 240,
              color: "#808080",
            }}
          >
            10/50
          </Text>
          <TextInput
            style={{
              width: 295,
              height: 230,
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: "#CCCCCC",
              paddingLeft: 20,
              paddingBottom: 170,
              fontSize: 16,
              multiline: "true",
            }}
            placeholder="메모를 작성해주세요"
            onChangeText={setInputText}
          />
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={onCancel}>
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

            <TouchableOpacity onPress={onCancel}>
              <View
                style={[
                  styles.modalBtn,
                  { marginTop: 15, backgroundColor: "#5900FF" },
                ]}
              >
                <Text style={{ fontSize: 16, color: "white" }}>저장</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  entire: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    top: 130,
    paddingTop: 20,
  },
  head: {
    marginTop: 70,
    height: 60,
    alignItems: "center",
  },
  search: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#cccccc",
    top: 40,
    width: 350,
    height: 50,
  },
  searchInput: {
    marginLeft: 20,
    top: 15,
    width: 280,
    fontSize: 15,
    // backgroundColor:'gray'
  },

  //--------------content-----------------

  contentBox: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#cccccc",
    width: 350,
    height: 135,
    // padding:15,
    marginBottom: 20,
    zIndex: 3,
  },
  fontTw1: {
    marginTop: 26,
    fontSize: 14,
    color: "#808080",
    marginLeft: 15,
  },
  fontTw2: {
    fontSize: 18,
    marginTop: 30,
    marginBottom: 5,
    fontWeight: "bold",
    left: 15,
  },
  fontTw3: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
    color: "#808080",
    left: 15,
  },
  modalBtn: {
    width: 140,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
