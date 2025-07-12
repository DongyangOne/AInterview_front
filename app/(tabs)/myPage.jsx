import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function MyPage() {
  return (
  <SafeAreaView style={styles.container}>


        {/*프로필 섹션 */}
    <View style={styles.profileSection}>
        <Ionicons name="person-circle-outline" size={100} color="#bbb" />
        <TouchableOpacity style={styles.editIcon}>
            <MaterialIcons name="edit" size={16} color="fff" />
        </TouchableOpacity>
    </View>

    {/*내 정보 관리 */}
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>내 정보 관리</Text>
        <View style={styles.divider} />

        <View style={styles.row}>
            <Text style={styles.label}>아이디</Text>
            <Text style={styles.value}>dana1234</Text>
        </View>

        <TouchableOpacity style={styles.row}>
            <Text style={styles.label}>닉네임</Text>
            <View style={styles.right}>
                <Text style={styles.value}>김다나</Text>
                <Ionicons name="chevron-forward" size={18} color="#aaa" />
            </View>
        </TouchableOpacity>
        </View>

        {/*계정 관리 */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>계정 관리</Text>
            <View style={styles.divider} />

            <TouchableOpacity style={styles.row}>
                <Text style={styles.label}>로그아웃</Text>
                <Ionicons name="chevron-forward" size={18} color="#aaa" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
                <Text style={styles.label}>회원탈퇴</Text>
                <Ionicons name="chevron-forward" size={18} color="#aaa" />
            </TouchableOpacity>
        </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 110,
    backgroundColor: 'purple',
    borderRadius: 12,
    padding: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#888',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});