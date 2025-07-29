// screens/MentalHealthScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,

  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import Slider from "@react-native-community/slider";

import styles from "./MentalHealthScreen.styles";

const moods = ["😀", "😐", "😢"];

type Props = {
  navigation: any;
  route: any;
};

const MentalHealthScreen: React.FC<Props> = ({ navigation, route }) => {
  const [stressLevel, setStressLevel] = useState(5);
  const [mood, setMood] = useState("😐");
  const [energy, setEnergy] = useState(5);
  const [sleep, setSleep] = useState(5);
  const [cravings, setCravings] = useState(false);
  const [cravingDetails, setCravingDetails] = useState("");

  const isValid = () => true;

  const onNext = () => {
    if (!isValid()) {
      Alert.alert("Missing Info", "Please fill out all fields.");
      return;
    }
    navigation.navigate("Goals", {
      ...route.params,
      stressLevel,
      mood,
      energy,
      sleep,
      cravings,
      cravingDetails,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
        🧠 Mental Wellness
      </Text>

      <View style={{ height: 8, backgroundColor: "#e0e0e0", borderRadius: 4, overflow: "hidden", marginBottom: 5 }}>
        <View style={{ width: "60%", height: "100%", backgroundColor: "#007AFF" }} />
      </View>

      <Text style={{ textAlign: "center", marginBottom: 20, color: "#555" }}>
        You're doing great! Let's talk about how you feel today 🌟
      </Text>

      <Text style={styles.label}>Stress Level (1–10)</Text>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={stressLevel}
        onValueChange={setStressLevel}
      />
      <Text>Level: {stressLevel}</Text>

      <Text style={styles.label}>Mood</Text>
      <View style={styles.moodRow}>
        {moods.map((m) => (
          <Text
            key={m}
            style={[styles.moodOption, m === mood && styles.moodSelected]}
            onPress={() => setMood(m)}
          >
            {m}
          </Text>
        ))}
      </View>

      <Text style={styles.label}>Energy Level (1–10)</Text>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={energy}
        onValueChange={setEnergy}
      />
      <Text>Energy: {energy}</Text>

      <Text style={styles.label}>Sleep Quality (1–10)</Text>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={sleep}
        onValueChange={setSleep}
      />
      <Text>Sleep: {sleep}</Text>

      <Text style={styles.label}>Cravings / Appetite?</Text>
      <Switch value={cravings} onValueChange={setCravings} />
      {cravings && (
        <TextInput
          style={styles.input}
          placeholder="Tell us what you're craving..."
          value={cravingDetails}
          onChangeText={setCravingDetails}
        />
      )}

      <TouchableOpacity onPress={onNext} style={{ backgroundColor: "#007AFF", padding: 15, borderRadius: 8, marginTop: 30 }}>
        <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MentalHealthScreen;
