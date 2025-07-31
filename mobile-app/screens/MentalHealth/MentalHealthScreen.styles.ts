// screens/MentalHealthScreen.styles.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  moodOption: {
    fontSize: 28,
    padding: 10,
  },
  moodSelected: {
    backgroundColor: "#D0E8FF",
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    minHeight: 50,
    textAlignVertical: "top",
  },
  valueText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  buttonWrapper: {
    marginTop: 30,
  },
});

export default styles;
