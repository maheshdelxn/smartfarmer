// src/screens/Profile/ProfileScreen.jsx
import { View, Text } from 'react-native';
import Header from "../../components/Header";

export default function ProfileScreen() {
  return (
     <View className="flex-1 bg-gray-50">
    
      
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold text-green-700">
          This is the Profile Screen
        </Text>
      </View>
    </View>
  );
}