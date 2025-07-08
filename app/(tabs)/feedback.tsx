import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, Modal,
} from 'react-native';
// import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import useWindowDimensions from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';

export default function App() {
  // const { width, height } = useWindowDimensions();
  // const [view, setView] = useState(false); 
  // const [sortOption, setSortOption] = useState('latest');

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('basic');
  const [items, setItems] = useState([
    { label: '정렬 기준', value: 'basic' },
    { label: '최근 날짜 순', value: 'latest' },
    { label: '가나다 순', value: 'name' },
  ]);

  const [open1, setOpen1] = useState(false);
  const [value1, setValue1] = useState('basic');
  const [items1, setItems1] = useState([
    { label: '정렬 기준', value: 'basic' },
    { label: '최상단 고정', value: 'static' },
    { label: '제목 수정', value: 'title' },
    { label: '메모 수정', value: 'memo' },
    { label: '기록 삭제', value: 'delete' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  //제목 수정 모달

  // <Modal
  //   animationType="fade"
  //   transparent={true}
  //   visible={modalVisible}
  //   onRequestClose={() => setModalVisible(false)}
  // >
  //   <View style={{
  //     flex: 1,
  //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
  //     justifyContent: 'center',
  //     alignItems: 'center'
  //   }}>
  //     <View style={{
  //       width: 350,
  //       height: 210,
  //       padding: 20,
  //       backgroundColor: 'white',
  //       borderRadius: 10,
  //       elevation: 5,
  //       alignItems: 'center',
  //     }}>
  //       <Text style={{ fontSize: 18, fontWeight: 600, marginBottom: 15 }}>제목 수정</Text>
  //       <Text style={{ fontSize: 12, marginBottom: 7, marginLeft: 240, color: '#808080' }}>10/20</Text>
  //       <TextInput style={{
  //         width: 300, height: 50, borderRadius: 10,
  //         borderWidth: 0.5, borderColor: '#CCCCCC', paddingLeft: 20
  //       }} placeholder='' />
  //       <View style={{ flexDirection: 'row', }}>
  //         <TouchableOpacity onPress={() => setModalVisible(false)}>
  //           <View style={[styles.modalBtn, { marginRight: 15, marginTop: 15, backgroundColor: '#DDDDDD' }]}>
  //             <Text style={{ fontSize: 16, }}>취소</Text>
  //           </View>
  //         </TouchableOpacity>

  //         <TouchableOpacity onPress={() => {
  //           Alert.alert('저장 버튼 클릭됨');
  //           setModalVisible(false);
  //         }}>
  //           <View style={[styles.modalBtn, { marginTop: 15, backgroundColor: '#5900FF' }]}>
  //             <Text style={{ fontSize: 16, color: 'white' }}>저장</Text>
  //           </View>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   </View>
  // </Modal>



  //메모 수정 모달
  // <Modal
  //             animationType="fade"
  //             transparent={true}
  //             visible={modalVisible}
  //             onRequestClose={() => setModalVisible(false)}
  //           >
  //             <View style={{
  //               flex: 1,
  //               backgroundColor: 'rgba(0, 0, 0, 0.5)',
  //               justifyContent: 'center',
  //               alignItems: 'center'
  //             }}>
  //               <View style={{
  //                 width: 350,
  //                 height: 380,
  //                 padding: 20,
  //                 backgroundColor: 'white',
  //                 borderRadius: 10,
  //                 elevation: 5,
  //                 alignItems: 'center',
  //               }}>
  //                 <Text style={{ fontSize: 18, fontWeight: 600, marginBottom: 15 }}>메모 수정</Text>
  //                 <Text style={{ fontSize: 12, marginBottom: 7, marginLeft: 240, color: '#808080' }}>10/50</Text>
  //                 <TextInput style={{
  //                   width: 295, height: 230, borderRadius: 10,
  //                   borderWidth: 0.5, borderColor: '#CCCCCC', paddingLeft: 20,
  //                   paddingBottom:170, fontSize:16, multiline:'true'
  //                 }} placeholder='메모를 작성해주세요' />
  //                 <View style={{ flexDirection: 'row', }}>
  //                   <TouchableOpacity onPress={() => setModalVisible(false)}>
  //                     <View style={[styles.modalBtn, { marginRight: 15, marginTop: 15, backgroundColor: '#DDDDDD' }]}>
  //                       <Text style={{ fontSize: 16, }}>취소</Text>
  //                     </View>
  //                   </TouchableOpacity>

  //                   <TouchableOpacity onPress={() => {
  //                     Alert.alert('저장 버튼 클릭됨');
  //                     setModalVisible(false);
  //                   }}>
  //                     <View style={[styles.modalBtn, { marginTop: 15, backgroundColor: '#5900FF' }]}>
  //                       <Text style={{ fontSize: 16, color: 'white' }}>저장</Text>
  //                     </View>
  //                   </TouchableOpacity>
  //                 </View>
  //               </View>
  //             </View>
  //           </Modal>



  return (
    <View style={{ flex: 1, }}>
      <View style={styles.head}>
        <Text style={{ fontSize: 20, top: 10, fontWeight: 'bold' }}>나의 피드백 목록</Text>
        <View style={styles.search}>
          <TextInput style={styles.searchInput} placeholder='제목, 날짜, 메모 검색' />
          <Image
            source={require('./assets/search.png')}
            style={{ width: 25, height: 25, marginLeft: 300, top: -5 }}
          />
        </View>
        <View style={{ top: 60, width: '85%', flexDirection: 'row', }}>
          <Text style={{ fontSize: 15, marginRight: 140, top: 5, color: '#808080' }}>모든 피드백</Text>
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
              // backgroundColor: 'lightgray',
              borderWidth: 'none'
            }}
            dropDownContainerStyle={{
              fontSize: 14,
              width: 115,
              maxHeight: 80,
            }}
            textStyle={{ fontSize: 15, }}
          />
        </View>
      </View>


      <ScrollView style={styles.entire}>

        //1
        <View style={styles.contentBox}>
          <View style={{ flexDirection: 'row', }}>
            <Text style={styles.fontTw1}>2025.07.06</Text>
            <TouchableOpacity style={{ top: 20, right: 14 }} onPress={() => { setOpen(false); setModalVisible(true) }}>
              <Text style={{ marginLeft: 240 }}>•</Text>
              <Text style={{ marginLeft: 240, top: -10 }}>•</Text>
              <Text style={{ marginLeft: 240, top: -20 }}>•</Text>
            </TouchableOpacity>
          </View>
          <View style={{ top: -15 }}>
            <Text style={styles.fontTw2}>삼성 회사 면접</Text>
            <Text style={styles.fontTw3}>&gt; 앞으로 자신감...</Text>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <View style={{
                width: 350,
                height: 215,
                padding: 20,
                backgroundColor: 'white',
                borderRadius: 10,
                elevation: 5,
                alignItems: 'center',
              }}>

                <Image
                  source={require('./assets/tri.png')}
                  style={{ width: 50, height: 50 }}
                />

                <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 20 }}>정말 삭제 하시겠습니까?</Text>
                <Text style={{ fontSize: 14, color: '#808080', marginTop: 5 }}>삭제하시면 복구가 불가합니다.</Text>

                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <View style={[styles.modalBtn, { marginRight: 15, marginTop: 15, backgroundColor: '#DDDDDD' }]}>
                      <Text style={{ fontSize: 16 }}>취소</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    Alert.alert('삭제 버튼 클릭됨');
                    setModalVisible(false);
                  }}>
                    <View style={[styles.modalBtn, { marginTop: 15, backgroundColor: '#FF3B30' }]}>
                      <Text style={{ fontSize: 16, color: 'white' }}>삭제</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>

//2
        <View style={styles.contentBox}>
          <View style={{ flexDirection: 'row', }}>
            <Text style={styles.fontTw1}>2025.07.06</Text>
            <TouchableOpacity onPress={() => { setOpen(false); setOpen1(!open1) }} style={{ top: 20, right: 14 }}>
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
                  if (val === 'title') {
                    setModalVisible(true);
                  }
                }}
              />
            )}


          </View>
          <View style={{ top: -15 }}>
            <Text style={styles.fontTw2}>삼성 회사 면접</Text>
            <Text style={styles.fontTw3}>&gt; 앞으로 자신감...</Text>
          </View>
        </View>


//3
        <View style={styles.contentBox}>
          <View style={{ flexDirection: 'row', }}>
            <Text style={styles.fontTw1}>2025.07.06</Text>
            <TouchableOpacity style={{ top: 20, right: 14 }} onPress={() => { setOpen(false); setModalVisible1(true) }}>
              <Text style={{ marginLeft: 240 }}>•</Text>
              <Text style={{ marginLeft: 240, top: -10 }}>•</Text>
              <Text style={{ marginLeft: 240, top: -20 }}>•</Text>
            </TouchableOpacity>
          </View>
          <View style={{ top: -15 }}>
            <Text style={styles.fontTw2}>삼성 회사 면접</Text>
            <Text style={styles.fontTw3}>&gt; 앞으로 자신감...</Text>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible1}
            onRequestClose={() => setModalVisible1(false)}
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
                <Text style={{ fontSize: 12, marginBottom: 7, marginLeft: 240, color: '#808080' }}>10/50</Text>
                <TextInput style={{
                  width: 295, height: 230, borderRadius: 10,
                  borderWidth: 0.5, borderColor: '#CCCCCC', paddingLeft: 20,
                  paddingBottom: 170, fontSize: 16, multiline: 'true'
                }} placeholder='메모를 작성해주세요' />
                <View style={{ flexDirection: 'row', }}>
                  <TouchableOpacity onPress={() => setModalVisible1(false)}>
                    <View style={[styles.modalBtn, { marginRight: 15, marginTop: 15, backgroundColor: '#DDDDDD' }]}>
                      <Text style={{ fontSize: 16, }}>취소</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    Alert.alert('저장 버튼 클릭됨');
                    setModalVisible1(false);
                  }}>
                    <View style={[styles.modalBtn, { marginTop: 15, backgroundColor: '#5900FF' }]}>
                      <Text style={{ fontSize: 16, color: 'white' }}>저장</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>


//4
        <View style={styles.contentBox}>
          <View style={{ flexDirection: 'row', }}>
            <Text style={styles.fontTw1}>2025.07.06</Text>
            <TouchableOpacity style={{ top: 20, right: 14 }} onPress={() => { setOpen(false); setModalVisible2(true) }}>
              <Text style={{ marginLeft: 240 }}>•</Text>
              <Text style={{ marginLeft: 240, top: -10 }}>•</Text>
              <Text style={{ marginLeft: 240, top: -20 }}>•</Text>
            </TouchableOpacity>
          </View>
          <View style={{ top: -15 }}>
            <Text style={styles.fontTw2}>삼성 회사 면접</Text>
            <Text style={styles.fontTw3}>&gt; 앞으로 자신감...</Text>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible2}
            onRequestClose={() => setModalVisible2(false)}
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
                <Text style={{ fontSize: 18, fontWeight: 600, marginBottom: 15 }}>제목 수정</Text>
                <Text style={{ fontSize: 12, marginBottom: 7, marginLeft: 240, color: '#808080' }}>10/20</Text>
                <TextInput style={{
                  width: 300, height: 50, borderRadius: 10,
                  borderWidth: 0.5, borderColor: '#CCCCCC', paddingLeft: 20
                }} placeholder='' />
                <View style={{ flexDirection: 'row', }}>
                  <TouchableOpacity onPress={() => setModalVisible2(false)}>
                    <View style={[styles.modalBtn, { marginRight: 15, marginTop: 15, backgroundColor: '#DDDDDD' }]}>
                      <Text style={{ fontSize: 16, }}>취소</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    Alert.alert('저장 버튼 클릭됨');
                    setModalVisible2(false);
                  }}>
                    <View style={[styles.modalBtn, { marginTop: 15, backgroundColor: '#5900FF' }]}>
                      <Text style={{ fontSize: 16, color: 'white' }}>저장</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>


//5
        <View style={styles.contentBox}>
          <View style={{ flexDirection: 'row', }}>
            <Text style={styles.fontTw1}>2025.07.06</Text>
            <TouchableOpacity style={{ top: 20, right: 14 }} onPress={() => {
              MDF()
            }}>
              <Text style={{ marginLeft: 240 }}>•</Text>
              <Text style={{ marginLeft: 240, top: -10 }}>•</Text>
              <Text style={{ marginLeft: 240, top: -20 }}>•</Text>
            </TouchableOpacity>
          </View>
          <View style={{ top: -15 }}>
            <Text style={styles.fontTw2}>삼성 회사 면접</Text>
            <Text style={styles.fontTw3}>&gt; 앞으로 자신감...</Text>
          </View>
        </View>


        <View style={{ height: 150 }} />
      </ScrollView>





      <View style={styles.foot}>
        <TouchableOpacity style={styles.footBtn1L}>
          <Text style={{ fontWeight: 600, fontSize: 15, marginLeft: 10 }}>⌂</Text>
          <Text style={{ fontWeight: 600, fontSize: 10, marginLeft: 10 }}>홈</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footBtn1}>
          <Text style={{ fontWeight: 600, fontSize: 15, color: 'gray' }}>⌂</Text>
          <Text style={{ fontWeight: 600, fontSize: 10, color: 'gray' }}>혜택</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footBtn1}>
          <View style={{
            width: 64, height: 64, borderColor: '#5900FF',
            borderWidth: 3, borderRadius: 50,
            top: -30, backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{ fontWeight: 600, fontSize: 50, color: '#5900FF', top: -5 }}>+</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footBtn1}>
          <Text style={{ fontWeight: 600, fontSize: 15, color: 'gray' }}>⌂</Text>
          <Text style={{ fontWeight: 600, fontSize: 10, color: 'gray' }}>증권</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footBtn1R}>
          <Text style={{ fontWeight: 600, fontSize: 15, marginRight: 10, color: 'gray' }}>⌂</Text>
          <Text style={{ fontWeight: 600, fontSize: 10, marginRight: 10, color: 'gray' }}>전체</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    alignItems: 'center',
    width: '100%',
    height: "100%",
    top: 130,
  },
  head: {
    marginTop: 70,
    // paddingHorizontal: 20,
    // backgroundColor:'lightgray',
    // borderTopWidth:2,
    height: 60,
    alignItems: 'center',
  },
  search: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#cccccc',
    top: 40,
    width: 350,
    height: 50,
  },
  searchInput: {
    // textAlign:'center',
    marginLeft: 20,
    top: 15,
    width: 280,
    fontSize: 15
    // backgroundColor:'gray'
  },





  //--------------content-----------------

  contentBox: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cccccc',
    width: 350,
    height: 135,
    // padding:15,
    marginBottom: 20,
    zIndex: 3
  },
  fontTw1: {
    marginTop: 26,
    marginLeft: 18,
    fontSize: 14,
    color: '#808080'
  },
  fontTw2: {
    fontSize: 18,
    marginTop: 23,
    marginLeft: 18,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  fontTw3: {
    fontSize: 16,
    marginTop: 10,
    marginLeft: 18,
    marginBottom: 10,
    color: '#808080'
  },






  //----------------footer------------------
  foot: {
    textAlign: 'center',
    width: '100%',
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 0,
  },
  footBtn1: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    height: 70,
    // justifyContent:'center',
    backgroundColor: 'white',
    // borderTopWidth:1,
    borderColor: 'black',
  },
  footBtn1L: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    height: 70,
    // justifyContent:'center',
    borderTopLeftRadius: 20,
    backgroundColor: 'white',
    // borderTopWidth:1,
    borderColor: 'black',
  },
  footBtn1R: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    height: 70,
    // justifyContent:'center',
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    // borderTopWidth:1,
    borderColor: 'black',
  },




  dropdown: {
    // position: 'absolute',
    top: 30,
    right: 30,
    width: 120,
    maxHeight: 50,
    zIndex: 1000,
    backgroundColor: 'white'
  },
  dropdownContainer: {
    position: 'absolute',
    fontSize: 14,
    width: 160,
    maxHeight: 195,
    right: 350,
    zIndex: 1000,
    backgroundColor: 'white'
  },

  modalBtn: {
    width: 140,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }

});
