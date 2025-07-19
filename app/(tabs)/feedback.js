
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import useWindowDimensions from "react-native";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";

export default function Feedback() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("basic");
  const [items, setItems] = useState([
    { label: "정렬 기준", value: "basic" },
    { label: "최근 날짜 순", value: "latest" },
    { label: "가나다 순", value: "name" },
  ]);

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [value1, setValue1] = useState("basic");
  const [items1, setItems1] = useState([
    { label: "정렬 기준", value: "basic" },
    { label: "최상단 고정", value: "static" },
    { label: "제목 수정", value: "title" },
    { label: "메모 수정", value: "memo" },
    { label: "기록 삭제", value: "delete" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // 'title', 'memo', 'delete'

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.head}>
        <Text style={{ fontSize: 20, top: 10, fontWeight: "bold" }}>
          나의 피드백 목록
        </Text>
        <View style={styles.search}>
          <TextInput
            style={styles.searchInput}
            placeholder="제목, 날짜, 메모 검색"
          />
          <Image
            source={require('./assets/images/search.png')}
            style={{ width: 25, height: 25, marginLeft: 300, top: -30 }}
          />
        </View>
        <View style={{ top: 60, width: "85%", flexDirection: "row" }}>
          <Text
            style={{ fontSize: 15, marginRight: 140, top: 5, color: "#808080" }}
          >
            모든 피드백
          </Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            style={{
              top: -12,
              width: 130,
              height: 40,
              zIndex: 2000,
              borderWidth: 0,
            }}
            dropDownContainerStyle={{
              fontSize: 14,
              width: 115,
              maxHeight: 80,
            }}
            textStyle={{ fontSize: 15 }}
          />
        </View>
      </View>

      <ScrollView style={[styles.entire, { position: "relative" }]}>
        <View style={styles.subEntire}>
          <View style={styles.empty} />
          <View style={[styles.contentBox, { position: "relative", marginTop: 30 }]}>
            <Image
              source={require('./assets/images/bookmark.png')}
              style={{ width: 50, height: 50, marginLeft: 270, top: -12, position: 'absolute' }}
            />
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.fontTw1}>2025.07.06</Text>
              <TouchableOpacity
                style={{ top: 20, right: 14 }}
                onPress={() => {
                  setOpen(false);
                  setModalVisible(true);
                }}
              >
                <Text style={{ marginLeft: 240 }}>•</Text>
                <Text style={{ marginLeft: 240, top: -10 }}>•</Text>
                <Text style={{ marginLeft: 240, top: -20 }}>•</Text>
              </TouchableOpacity>
              {open1 && (
                <DropDownPicker
                  open={open1}
                  value={value1}
                  items={items1}
                  setOpen={setOpen1}
                  setValue={setValue1}
                  setItems={setItems1}
                  style={styles.dropdown}
                  zIndex={3000}
                  zIndexInverse={1000}
                  dropDownContainerStyle={styles.dropdownContainer}
                  onChangeValue={(val) => {
                    console.log("선택된 항목:", val);
                    setValue1(val);
                    setOpen1(false);
                    if (val === "title") {
                      setModalVisible(true);
                    }
                  }}
                />
              )}
            </View>
            <View style={{ top: -15 }}>
              <Text style={styles.fontTw2}>삼성 회사 면접</Text>
              <Text style={styles.fontTw3}>&lt 앞으로 자신감...</Text>
            </View>
          </View>
        //2
          <View style={styles.contentBox}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.fontTw1}>2025.07.06</Text>
              <TouchableOpacity
                onPress={() => {
                  setOpen(false);
                  setOpen1(!open1);
                }}
                style={{ top: 20, right: 14 }}
              >
                <Text style={{ marginLeft: 240 }}>•</Text>
                <Text style={{ marginLeft: 240, top: -10 }}>•</Text>
                <Text style={{ marginLeft: 240, top: -20 }}>•</Text>
              </TouchableOpacity>
              {open1 && (
                <DropDownPicker
                  open={open1}
                  value={value1}
                  items={items1}
                  setOpen={setOpen1}
                  setValue={setValue1}
                  setItems={setItems1}
                  style={styles.dropdown}
                  zIndex={3000}
                  zIndexInverse={1000}
                  dropDownContainerStyle={styles.dropdownContainer}
                  onChangeValue={(val) => {
                    console.log("선택된 항목:", val);
                    setValue1(val);
                    setOpen1(false);
                    if (val === "title") {
                      setModalVisible(true);
                    }
                  }}
                />
              )}
            </View>
            <View style={{ top: -15 }}>
              <Text style={styles.fontTw2}>삼성 회사 면접</Text>
              <Text style={styles.fontTw3}>&lt 앞으로 자신감...</Text>
            </View>
          </View>
        //3
          <View style={styles.contentBox}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.fontTw1}>2025.07.06</Text>
              <TouchableOpacity
                style={{ top: 20, right: 14 }}
                onPress={() => {
                  setOpen(false);
                  setModalVisible(true);
                }}
              >
                <Text style={{ marginLeft: 240 }}>•</Text>
                <Text style={{ marginLeft: 240, top: -10 }}>•</Text>
                <Text style={{ marginLeft: 240, top: -20 }}>•</Text>
              </TouchableOpacity>
              {open1 && (
                <DropDownPicker
                  open={open1}
                  value={value1}
                  items={items1}
                  setOpen={setOpen1}
                  setValue={setValue1}
                  setItems={setItems1}
                  style={styles.dropdown}
                  zIndex={3000}
                  zIndexInverse={1000}
                  dropDownContainerStyle={styles.dropdownContainer}
                  onChangeValue={(val) => {
                    console.log("선택된 항목:", val);
                    setValue1(val);
                    setOpen1(false);
                    if (val === "title") {
                      setModalVisible(true);
                    }
                  }}
                />
              )}
            </View>
            <View style={{ top: -15 }}>
              <Text style={styles.fontTw2}>삼성 회사 면접</Text>
              <Text style={styles.fontTw3}>&lt 앞으로 자신감...</Text>
            </View>
          </View>
        //4
          <View style={styles.contentBox}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.fontTw1}>2025.07.06</Text>
              <TouchableOpacity
                style={{ top: 20, right: 14 }}
                onPress={() => {
                  setOpen(false);
                  setModalVisible(true);
                }}
              >
                <Text style={{ marginLeft: 240 }}>•</Text>
                <Text style={{ marginLeft: 240, top: -10 }}>•</Text>
                <Text style={{ marginLeft: 240, top: -20 }}>•</Text>
              </TouchableOpacity>
              {open1 && (
                <DropDownPicker
                  open={open1}
                  value={value1}
                  items={items1}
                  setOpen={setOpen1}
                  setValue={setValue1}
                  setItems={setItems1}
                  style={styles.dropdown}
                  zIndex={3000}
                  zIndexInverse={1000}
                  dropDownContainerStyle={styles.dropdownContainer}
                  onChangeValue={(val) => {
                    console.log("선택된 항목:", val);
                    setValue1(val);
                    setOpen1(false);
                    if (val === "title") {
                      setModalVisible(true);
                    }
                  }}
                />
              )}
            </View>
            <View style={{ top: -15 }}>
              <Text style={styles.fontTw2}>삼성 회사 면접</Text>
              <Text style={styles.fontTw3}>&lt 앞으로 자신감...</Text>
            </View>
          </View>
        //5
          <View style={styles.contentBox}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.fontTw1}>2025.07.06</Text>
              <TouchableOpacity
                style={{ top: 20, right: 14 }}
                onPress={() => {
                  setOpen(false);
                  setModalVisible(true);
                }}
              >
                <Text style={{ marginLeft: 240 }}>•</Text>
                <Text style={{ marginLeft: 240, top: -10 }}>•</Text>
                <Text style={{ marginLeft: 240, top: -20 }}>•</Text>
              </TouchableOpacity>
              {open1 && (
                <DropDownPicker
                  open={open1}
                  value={value1}
                  items={items1}
                  setOpen={setOpen1}
                  setValue={setValue1}
                  setItems={setItems1}
                  style={styles.dropdown}
                  zIndex={3000}
                  zIndexInverse={1000}
                  dropDownContainerStyle={styles.dropdownContainer}
                  onChangeValue={(val) => {
                    console.log("선택된 항목:", val);
                    setValue1(val);
                    setOpen1(false);
                    if (val === "title") {
                      setModalVisible(true);
                    }
                  }}
                />
              )}
            </View>
            <View style={{ top: -15 }}>
              <Text style={styles.fontTw2}>삼성 회사 면접</Text>
              <Text style={styles.fontTw3}>&lt 앞으로 자신감...</Text>
            </View>
          </View>
          <View style={{ height: 150 }} />
        </View>
      </ScrollView>



    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    width: "100%",
    height: "100%",
    top: 130,
    paddingTop: 20,

  },
  subEntire: {
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: 'center',
  },
  searchInput: {
    top: 5,
    width: 280,
    fontSize: 15,
    marginRight: 25
    // backgroundColor:'black'
  },

  //--------------content-----------------
  empty: {
    height: 120
  },
  contentBox: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#cccccc",
    width: 350,
    height: 135,
    marginBottom: 20,
    zIndex: 3,
  },
  fontTw1: {
    marginTop: 20,
    marginLeft: 18,
    fontSize: 14,
    color: "#808080",
  },
  fontTw2: {
    fontSize: 18,
    marginTop: 15,
    marginLeft: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  fontTw3: {
    fontSize: 16,
    marginLeft: 18,
    marginBottom: 10,
    color: "#808080",
  },


  dropdown: {
    top: 30,
    right: 30,
    width: 120,
    maxHeight: 50,
    zIndex: 1000,
    backgroundColor: "white",
    borderWidth: 0,
  },
  dropdownContainer: {
    position: "absolute",
    fontSize: 14,
    width: 160,
    maxHeight: 195,
    right: 350,
    zIndex: 1000,
    borderWidth: 0,
  },


  //image

  bookmark: {
    width: 10,
    height: 10,
  }

});