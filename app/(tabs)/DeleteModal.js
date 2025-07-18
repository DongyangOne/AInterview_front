import {
    View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, Modal,
} from 'react-native';
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import useWindowDimensions from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';

export default function App() {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("basic");
    const [items, setItems] = useState([
        { label: '정렬 기준', value: 'basic' },
        { label: '최근 날짜 순', value: 'latest' },
        { label: '가나다 순', value: 'name' },
    ]);

    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [value1, setValue1] = useState('basic');
    const [items1, setItems1] = useState([
        { label: '정렬 기준', value: 'basic' },
        { label: '최상단 고정', value: 'static' },
        { label: '제목 수정', value: 'title' },
        { label: '메모 수정', value: 'memo' },
        { label: '기록 삭제', value: 'delete' },
    ]);


    const [feedbacks, setFeedbacks] = useState([
        { id: 1, date: '2025.07.06', title: '삼성 회사 면접', memo: '> 앞으로 자신감...' },
        { id: 2, date: '2025.07.06', title: '카카오 코딩 테스트', memo: '> 정답률 높이기...' },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [inputText, setInputText] = useState('');
    const [selectedId, setSelectedId] = useState(null); // 어떤 항목을 수정 중인지 식별

    const handleDelete = () => {
        setFeedbacks(prevFeedbacks =>
            prevFeedbacks.filter(item => item.id !== selectedId)
        );
        setModalVisible(false);
    };

    return (
        <View style={{ flex: 1, }}>
            <View style={styles.head}>
                <Text style={{ fontSize: 20, top: 10, fontWeight: 'bold' }}>나의 피드백 목록</Text>
                <View style={styles.search}>
                    <TextInput style={styles.searchInput} placeholder='제목, 날짜, 메모 검색' />

                </View>
                <View style={{ top: 60, width: '85%', flexDirection: 'row', }}>
                    <Text style={{ fontSize: 15, marginRight: 140, top: 5, color: '#808080' }}>모든 피드백</Text>
                </View>
            </View>


            <ScrollView style={[styles.entire, { position: 'relative', }]}>


                {feedbacks.map((item) => (
                    <View key={item.id} style={styles.contentBox}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.fontTw1}>{item.date}</Text>

                            <TouchableOpacity
                                style={{ top: 20, right: 14 }}
                                onPress={() => {
                                    setModalVisible(true);
                                    setInputText(item.title);
                                    setSelectedId(item.id);
                                }}
                            >
                                <Text style={{ marginLeft: 240 }}>•</Text>
                                <Text style={{ marginLeft: 240, top: -10 }}>•</Text>
                                <Text style={{ marginLeft: 240, top: -20 }}>•</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ top: -15 }}>
                            <Text style={styles.fontTw2}>{item.title}</Text>
                            <Text style={styles.fontTw3}>{item.memo}</Text>
                        </View>
                    </View>

                ))}
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
                                style={{ width: 50, height: 50 }} />

                            <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 20 }}>정말 삭제 하시겠습니까?</Text>
                            <Text style={{ fontSize: 14, color: '#808080', marginTop: 5 }}>삭제하시면 복구가 불가합니다.</Text>

                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <View style={[styles.modalBtn, { marginRight: 15, marginTop: 15, backgroundColor: '#DDDDDD' }]}>
                                        <Text style={{ fontSize: 16 }}>취소</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleDelete}>
                                    <View style={[styles.modalBtn, { marginTop: 15, backgroundColor: '#FF3B30' }]}>
                                        <Text style={{ fontSize: 16, color: 'white' }}>삭제</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </Modal>

            </ScrollView>



        </View>
    );
}

const styles = StyleSheet.create({
    entire: {
        alignItems: 'center',
        width: '100%',
        height: "100%",
        top: 130,
        paddingTop: 20
    },
    head: {
        marginTop: 70,
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
        fontSize: 14,
        color: '#808080',
        marginLeft: 15
    },
    fontTw2: {
        fontSize: 18,
        marginTop: 30,
        marginBottom: 5,
        fontWeight: 'bold',
        left: 15
    },
    fontTw3: {
        fontSize: 16,
        marginTop: 5,
        marginBottom: 10,
        color: '#808080',
        left: 15
    },
    modalBtn: {
        width: 140,
        height: 45,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }



});
