// components/CustomModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import {router } from 'expo-router';


const { width } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function Close({ visible, onCancel }) {
  const handleConfirm = () => {
    router.back();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.alertBox}>
          <Image
            source={require("../../assets/icons/warning.png")}
            style={{
              Top: 27,
              width: 24,
              height: 24,
              alignItems: 'center'
            }}
            resizeMode="contain"
          />
          <Text style={styles.alertTitle}>정말 종료 하시겠습니까?</Text>
          <Text style={styles.alertMessage}>진행 중인 내용은 저장되지 않습니다.</Text>
          <View style={styles.alertButtonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.endButton}
              onPress={handleConfirm}
            >
              <Text style={styles.endButtonText}>종료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    marginBottom: 160,
    marginHorizontal: 32,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: 348,
    height: 212,
    alignItems: 'center',
    elevation: 5,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 1,
    color: '#191919'
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#808080',
    marginBottom: 24,
    textAlign: 'center'
  },
  alertButtonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  cancelButton: {
    width: 141,
    height: 44,
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  endButton: {
    width: 141,
    height: 44,
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#191919',
    fontWeight: '500',
  },
  endButtonText: {
    color: 'white',
    fontWeight: '600' },
});
