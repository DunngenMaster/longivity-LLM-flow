import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView
} from "react-native";
import styles from "./UserProfileScreen.styles";

type Props = {
  navigation: any;
};

const UserProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const onNext = () => {
    navigation.navigate("ImageUpload", {
      profile: { name, age, weight, height }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={age}
        onChangeText={setAge}
      />

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.label}>Height (cm)</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={height}
        onChangeText={setHeight}
      />

      <Button title="Next" onPress={onNext} />
    </ScrollView>
  );
};

export default UserProfileScreen;
