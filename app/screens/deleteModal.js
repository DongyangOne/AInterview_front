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
import { BlurView } from 'expo-blur';

export default function deleteModal() {
    const [open, setOpen] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [inputText, setInputText] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    const [feedbacks, setFeedbacks] = useState([
        { id: 1, date: '2025.07.06', title: '삼성 회사 면접', memo: '> 앞으로 자신감...' },
        { id: 2, date: '2025.07.06', title: '카카오 코딩 테스트', memo: '> 정답률 높이기...' },
    ]);


    const handleDelete = () => {
        setFeedbacks(prevFeedbacks =>
            prevFeedbacks.filter(item => item.id !== selectedId)
        );
        setModalVisible(false);
    };
    return (


        <ScrollView style={[styles.entire, { position: 'relative', }]}>
            <View style={styles.subEntire}>

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
                            width: 348,
                            height: 212,
                            backgroundColor: 'white',
                            borderRadius: 10,
                            elevation: 5,
                            alignItems: 'center',
                        }}>

                            <Image
                                source={require('../../assets/icons/warning.png')}
                                style={{ position: 'absolute', width: 28, height: 25, top: 30 }} />

                            <Text style={{ position: 'absolute', fontSize: 20, fontWeight: '600', top: 78 }}>정말 삭제 하시겠습니까?</Text>
                            <Text style={{ position: 'absolute', fontSize: 14, color: '#808080', top: 103 }}>삭제하시면 복구가 불가합니다.</Text>

                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <View style={[styles.modalBtn, { right: 9, backgroundColor: '#DDDDDD' }]}>
                                        <Text style={{ fontSize: 16 }}>취소</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleDelete}>
                                    <View style={[styles.modalBtn, { left: 9, backgroundColor: '#FF3B30' }]}>
                                        <Text style={{ fontSize: 16, color: 'white' }}>삭제</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>



    );
}

const styles = StyleSheet.create({
    entire: {
        width: "100%",
        height: "100%",
        top: 130,
        paddingTop: 150
    },
    subEntire: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: -150
    },



    //--------------content-----------------

    contentBox: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#cccccc',
        width: 350,
        height: 135,
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
        position: 'absolute',
        width: 141,
        height: 44,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        top: 137
    }



});
