// screens/ImageUploadScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
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

  const pickImage = async (setImage: (uri: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
const pickFromGallery = async (setImage: (uri: string) => void) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    quality: 0.8,
  });
  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
};

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
    navigation.navigate("MedicalHistory", {
      ...route.params,
      faceImage,
      headImage,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Upload Face Image</Text>
      {faceImage && <Image source={{ uri: faceImage }} style={styles.preview} />}
      <Button title="Select Face Image" onPress={() => pickImage(setFaceImage)} />
      <Button title="Take a Photo" onPress={() => takePhoto(setFaceImage)} />


      <Text style={styles.label}>Upload Head Image</Text>
      {headImage && <Image source={{ uri: headImage }} style={styles.preview} />}
      <Button title="Select Head Image" onPress={() => pickImage(setHeadImage)} />
      <Button title="Take a Photo" onPress={() => takePhoto(setFaceImage)} />


      <View style={styles.nextButton}>
        <Button
          title="Next"
          onPress={onNext}
          disabled={!faceImage || !headImage}
        />
      </View>
    </ScrollView>
  );
};

export default ImageUploadScreen;
