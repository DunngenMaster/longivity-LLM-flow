// screens/MedicalHistoryScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import styles from "./MedicalHistoryScreen.styles";

type Props = {
  navigation: any;
  route: any;
};

const MedicalHistoryScreen: React.FC<Props> = ({ navigation, route }) => {
  const [allergies, setAllergies] = useState("");
  const [diseaseHistory, setDiseaseHistory] = useState("");

  const isValid = () => {
    return allergies.trim().length > 0 && diseaseHistory.trim().length > 0;
  };

  const onNext = () => {
    if (!isValid()) {
      Alert.alert("Missing Info", "Please fill out all required fields.");
      return;
    }
    navigation.navigate("MentalHealth", {
      ...route.params,
      allergies,
      diseaseHistory,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
        🩺 Medical History
      </Text>

      <View style={{ height: 8, backgroundColor: "#e0e0e0", borderRadius: 4, overflow: "hidden", marginBottom: 5 }}>
        <View style={{ width: "40%", height: "100%", backgroundColor: "#007AFF" }} />
      </View>

      <Text style={{ textAlign: "center", marginBottom: 20, color: "#555" }}>
        Let's talk about your health background 🩺
      </Text>

      <Text style={styles.label}>Known Allergies *</Text>
      <TextInput
        style={styles.input}
        multiline
        value={allergies}
        onChangeText={setAllergies}
        placeholder="E.g. peanuts, penicillin"
      />

      <Text style={styles.label}>Disease History *</Text>
      <TextInput
        style={styles.input}
        multiline
        value={diseaseHistory}
        onChangeText={setDiseaseHistory}
        placeholder="E.g. asthma, diabetes"
      />

      <TouchableOpacity onPress={onNext} style={{ backgroundColor: "#007AFF", padding: 15, borderRadius: 8, marginTop: 30 }}>
        <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MedicalHistoryScreen;
