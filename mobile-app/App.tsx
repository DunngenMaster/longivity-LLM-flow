import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfileScreen from "./screens/userProfile/UserProfileScreen";
import ImageUploadScreen from "./screens/ImageUpload/ImageUploadScreen";
import MedicalHistoryScreen from "./screens/medicalHistory/medicalHistoryScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ImageUpload">
        <Stack.Screen
          name="UserProfile"
          component={UserProfileScreen}
          options={{ title: "User Profile" }}
        />
        <Stack.Screen 
          name="ImageUpload" 
          component={ImageUploadScreen} 
        />
        <Stack.Screen 
          name="MedicalHistory" 
          component={MedicalHistoryScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
