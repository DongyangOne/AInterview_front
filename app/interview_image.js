import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function InterviewVideo() {
  const { feedbackId } = useLocalSearchParams();
  const router = useRouter();
  const [videoUri, setVideoUri] = useState(null);
  const [usersId, setUsersId] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const file1 = `${Date.now()}.mp4`;

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const usersId = await AsyncStorage.getItem("userId");
        if (usersId) setUsersId(Number(usersId));
      } catch (error) {
        console.log("AsyncStorage error:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "갤러리 권한 필요",
          "갤러리 접근 권한이 있어야만 동영상/이미지 선택이 가능합니다. 설정에서 권한을 허용해 주세요.",
          [{ text: "확인" }]
        );
      }
    })();
  }, []);

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!videoUri) {
      setUploadError("동영상을 선택해주세요.");
      return;
    }
    setUploadError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("userId", usersId);
      formData.append("feedbackId", feedbackId);

      formData.append("file1", {
        uri: videoUri,
        type: "video/mp4",
        name: file1,
      });

      await axios
        .post(`${process.env.EXPO_PUBLIC_API_URL}/file/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log("업로드 성공:", res.data);
          router.push("/interview_analysis");
        })
        .catch((error) => {
          console.log("업로드 실패:", error.response?.data || error.message);
        });
    } catch (error) {
      setUploadError(error.message || "예상치 못한 오류가 발생했습니다.");
      console.log("try-catch 에러:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.nextBtn]} onPress={pickVideo}>
        <Text style={{ color: "#fff", textAlign: "center", lineHeight: 50 }}>
          갤러리에서 동영상 선택하기
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.nextBtn]} onPress={handleSave}>
        <Text style={{ color: "#fff", textAlign: "center", lineHeight: 50 }}>
          다음
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  nextBtn: {
    backgroundColor: "#5900FF",
    width: "90%",
    height: 50,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
