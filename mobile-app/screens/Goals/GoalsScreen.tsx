// screens/GoalsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import styles from "./GoalsScreen.styles";

const GOAL_OPTIONS = [
  "Weight loss",
  "Muscle gain",
  "Better sleep",
  "Stress reduction",
  "Longevity / anti-aging",
  "Focus / productivity",
];

type Props = {
  navigation: any;
  route: any;
};

const GoalsScreen: React.FC<Props> = ({ navigation, route }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState("");

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const isValid = () => selectedGoals.length > 0 || customGoal.trim().length > 0;

  const onNext = () => {
    if (!isValid()) {
      Alert.alert("Missing Info", "Please select at least one goal or enter a custom goal.");
      return;
    }
    const allGoals = [...selectedGoals];
    if (customGoal.trim()) allGoals.push(customGoal.trim());
    navigation.navigate("ImageUpload", {
      ...route.params,
      goals: allGoals,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
        🎯 Wellness Goals
      </Text>

      <View style={{ height: 8, backgroundColor: "#e0e0e0", borderRadius: 4, overflow: "hidden", marginBottom: 5 }}>
        <View style={{ width: "80%", height: "100%", backgroundColor: "#007AFF" }} />
      </View>

      <Text style={{ textAlign: "center", marginBottom: 20, color: "#555" }}>
        Tell us what you're aiming for 🌟
      </Text>

      {GOAL_OPTIONS.map((goal) => (
        <Pressable
          key={goal}
          style={[styles.goalButton, selectedGoals.includes(goal) && styles.goalSelected]}
          onPress={() => toggleGoal(goal)}
        >
          <Text style={styles.goalText}>{goal}</Text>
        </Pressable>
      ))}

      <Text style={styles.label}>Custom Goal (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your own goal..."
        value={customGoal}
        onChangeText={setCustomGoal}
      />

      <TouchableOpacity onPress={onNext} style={{ backgroundColor: "#007AFF", padding: 15, borderRadius: 8, marginTop: 30 }}>
        <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default GoalsScreen;
