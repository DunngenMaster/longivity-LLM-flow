// screens/UserProfileScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "./UserProfileScreen.styles";

const feetOptions = Array.from({ length: 10 }, (_, i) => i + 1);
const inchOptions = Array.from({ length: 12 }, (_, i) => i);
const genderOptions = ["Male", "Female", "Other"];

type Props = {
  navigation: any;
};

const UserProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(6);
  const [gender, setGender] = useState("Other");

  const isValidName = (text: string) => /^[A-Za-z\s]+$/.test(text);

  const isValid = () => {
    const parsedAge = parseInt(age);
    const parsedWeight = parseFloat(weight);
    return (
      isValidName(name) &&
      name.trim().length > 0 &&
      parsedAge >= 5 && parsedAge <= 120 &&
      parsedWeight >= 20 && parsedWeight <= 300
    );
  };

  const onNext = () => {
    if (!isValid()) {
      Alert.alert("Invalid Info", "Please enter valid values for all fields. Name must only contain letters.");
      return;
    }
    navigation.navigate("MedicalHistory", {
      name,
      age,
      weight,
      height: `${feet}'${inches}\"`,
      gender,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
        👤 Personal Info
      </Text>

      <View style={{ height: 8, backgroundColor: "#e0e0e0", borderRadius: 4, overflow: "hidden", marginBottom: 5 }}>
        <View style={{ width: "20%", height: "100%", backgroundColor: "#007AFF" }} />
      </View>

      <Text style={{ textAlign: "center", marginBottom: 20, color: "#555" }}>
        You're just getting started! 😊
      </Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. John Doe"
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={age}
        onChangeText={setAge}
        placeholder="e.g. 28"
      />

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={weight}
        onChangeText={setWeight}
        placeholder="e.g. 72.5"
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.label}>Gender</Text>
          <Picker
            selectedValue={gender}
            onValueChange={(val) => setGender(val)}
            style={styles.picker}
          >
            {genderOptions.map((g) => (
              <Picker.Item key={g} label={g} value={g} />
            ))}
          </Picker>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Height</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.subLabel}>Ft</Text>
              <Picker
                selectedValue={feet}
                onValueChange={(val) => setFeet(val)}
                style={styles.picker}
              >
                {feetOptions.map((f) => (
                  <Picker.Item key={f} label={`${f}`} value={f} />
                ))}
              </Picker>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.subLabel}>In</Text>
              <Picker
                selectedValue={inches}
                onValueChange={(val) => setInches(val)}
                style={styles.picker}
              >
                {inchOptions.map((i) => (
                  <Picker.Item key={i} label={`${i}`} value={i} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={onNext} style={{ backgroundColor: "#007AFF", padding: 15, borderRadius: 8, marginTop: 30 }}>
        <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UserProfileScreen;
