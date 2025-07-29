// screens/MedicalHistoryScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import styles from "./MedicalHistoryScreen.styles";

type Props = {
  navigation: any;
  route: any;
};

const MedicalHistoryScreen: React.FC<Props> = ({ navigation, route }) => {
  const [allergies, setAllergies] = useState("");
  const [diseaseHistory, setDiseaseHistory] = useState("");
  const [medications, setMedications] = useState("");
  const [familyHistory, setFamilyHistory] = useState("");

  const onNext = () => {
    navigation.navigate("Goals", {
      ...route.params,
      allergies,
      diseaseHistory,
      medications,
      familyHistory,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Known Allergies</Text>
      <TextInput
        style={styles.input}
        multiline
        value={allergies}
        onChangeText={setAllergies}
        placeholder="E.g. peanuts, penicillin"
      />

      <Text style={styles.label}>Disease History</Text>
      <TextInput
        style={styles.input}
        multiline
        value={diseaseHistory}
        onChangeText={setDiseaseHistory}
        placeholder="E.g. asthma, diabetes"
      />

      <Text style={styles.label}>Current Medications (optional)</Text>
      <TextInput
        style={styles.input}
        multiline
        value={medications}
        onChangeText={setMedications}
        placeholder="E.g. Metformin, Vitamin D"
      />

      <Text style={styles.label}>Family History (optional)</Text>
      <TextInput
        style={styles.input}
        multiline
        value={familyHistory}
        onChangeText={setFamilyHistory}
        placeholder="E.g. heart disease, cancer"
      />

      <View style={styles.buttonWrapper}>
        <Button title="Next" onPress={onNext} />
      </View>
    </ScrollView>
  );
};

export default MedicalHistoryScreen;
