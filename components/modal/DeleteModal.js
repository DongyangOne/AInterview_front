import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";

export default function DeleteCheckModal({ visible, onCancel }) {
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
