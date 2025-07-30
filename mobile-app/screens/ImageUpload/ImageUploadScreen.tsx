// screens/ImageUploadScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import styles from "./ImageUploadScreen.styles";

type Props = {
  navigation: any;
  route: any;
};

const ImageUploadScreen: React.FC<Props> = ({ navigation, route }) => {
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [headImage, setHeadImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
    })();
  }, []);

  const takePhoto = async (setImage: (uri: string) => void) => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmit = async () => {
    try {
      if (!faceImage || !headImage) {
        Alert.alert("Images Required", "Please capture both images.");
        return;
      }

      const payload = { ...route.params };

      const [faceBase64, headBase64] = await Promise.all([
        FileSystem.readAsStringAsync(faceImage, { encoding: FileSystem.EncodingType.Base64 }),
        FileSystem.readAsStringAsync(headImage, { encoding: FileSystem.EncodingType.Base64 }),
      ]);

      payload.faceImage = `data:image/jpeg;base64,${faceBase64}`;
      payload.headImage = `data:image/jpeg;base64,${headBase64}`;

      const response = await fetch("http://10.0.0.51:5000/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert("✅ Submitted!", "Your profile has been uploaded.");
        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      } else {
        throw new Error("Backend failed");
      }
    } catch (err: any) {
      Alert.alert("❌ Error", err.message);
    }
  };

  const renderImageBox = (image: string | null, label: string, emoji: string, onPress: () => void) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 140,
        height: 140,
        backgroundColor: "#f0f0f0",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
      }}
    >
      {image ? (
        <Image source={{ uri: image }} style={{ width: 140, height: 140, borderRadius: 12 }} />
      ) : (
        <Text style={{ fontSize: 32 }}>{emoji}\n{label}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
        📸 Say Cheese!
      </Text>

      <View style={{ height: 8, backgroundColor: "#e0e0e0", borderRadius: 4, overflow: "hidden", marginBottom: 5 }}>
        <View style={{ width: "100%", height: "100%", backgroundColor: "#007AFF" }} />
      </View>

      <Text style={{ textAlign: "center", marginBottom: 20, color: "#555" }}>
        It's selfie time! Show us your best look 😄
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 20 }}>
        {renderImageBox(faceImage, "Selfie", "🤳", () => takePhoto(setFaceImage))}
        {renderImageBox(headImage, "Head", "🧠", () => takePhoto(setHeadImage))}
      </View>

      <TouchableOpacity
        onPress={onSubmit}
        style={{ backgroundColor: "#007AFF", padding: 15, borderRadius: 8, marginTop: 30 }}
      >
        <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ImageUploadScreen;
