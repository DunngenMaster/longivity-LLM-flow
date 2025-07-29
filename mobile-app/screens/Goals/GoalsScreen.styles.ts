import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  goalButton: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 8,
  },
  goalSelected: {
    backgroundColor: "#007AFF",
  },
  goalText: {
    color: "#000",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    minHeight: 50,
    textAlignVertical: "top",
  },
  buttonWrapper: {
    marginTop: 30,
  },
});

export default styles;
