import React, { useState } from 'react';
import { View, Button } from 'react-native';
import CustomModal from '../../components/Modal/Modal';

export default function Interview() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Button title="모달 열기" onPress={() => setModalVisible(true)} />
      <CustomModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={() => {
          // 종료 처리 로직
          setModalVisible(false);
        }}
      />
    </View>
  );
}
