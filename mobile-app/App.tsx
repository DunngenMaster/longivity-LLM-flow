import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GoalsScreen from "./screens/Goals/GoalsScreen";
import UserProfileScreen from "./screens/userProfile/UserProfileScreen";
import ImageUploadScreen from "./screens/ImageUpload/ImageUploadScreen";
import MedicalHistoryScreen from "./screens/MedicalHistory/MedicalHistoryScreen";
import MentalHealthScreen from "./screens/MentalHealth/MentalHealthScreen";
import HomeScreen from "./screens/Home/HomeScreen";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
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
        <Stack.Screen 
          name="Goals" 
          component={GoalsScreen} 
        />
        <Stack.Screen 
          name="MentalHealth" 
          component={MentalHealthScreen} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />
   
      </Stack.Navigator>
    </NavigationContainer>
  );
}
