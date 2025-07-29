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

  const onNext = () => {
    if (!faceImage || !headImage) {
      Alert.alert("Images Required", "Please take both selfie and headshot to proceed.");
      return;
    }
    navigation.navigate("Review", {
      ...route.params,
      faceImage,
      headImage,
    });
  };

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

      {faceImage && <Image source={{ uri: faceImage }} style={styles.preview} />}
      <TouchableOpacity
        onPress={() => takePhoto(setFaceImage)}
        style={{ backgroundColor: "#007AFF", padding: 15, borderRadius: 8, marginBottom: 15 }}
      >
        <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Take a Selfie</Text>
      </TouchableOpacity>

      {headImage && <Image source={{ uri: headImage }} style={styles.preview} />}
      <TouchableOpacity
        onPress={() => takePhoto(setHeadImage)}
        style={{ backgroundColor: "#007AFF", padding: 15, borderRadius: 8 }}
      >
        <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Take a Head Picture</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onNext}
        style={{ backgroundColor: "#007AFF", padding: 15, borderRadius: 8, marginTop: 30 }}
      >
        <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ImageUploadScreen;
