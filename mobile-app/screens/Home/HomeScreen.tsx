// screens/HomeScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const HomeScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* User Summary Card */}
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>👤 Your Health Summary</Text>
        <Text style={styles.cardText}>✅ Good Sleep</Text>
        <Text style={styles.cardText}>⚠️ Improve Stress</Text>
        <Text style={styles.editText}>Edit Profile →</Text>
      </TouchableOpacity>

      {/* Product Recommendations Card */}
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>🛍️ AI-Suggested Products</Text>
        <Text style={styles.cardText}>See what fits your current wellness goals</Text>
      </TouchableOpacity>

      {/* GPT Chat Assistant Card */}
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>💬 Ask GPT Health Assistant</Text>
        <Text style={styles.cardText}>Chat with your AI wellness guide</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
  },
  editText: {
    marginTop: 10,
    color: "#007AFF",
    fontWeight: "600",
    textAlign: "right",
  },
});

export default HomeScreen;
