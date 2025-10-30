// src/screens/Home/HomeScreen.jsx
import { View, Text } from "react-native";
import Header from "../../components/Header";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-gray-50">
    
      
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold text-green-700">
          This is the Home Screen
        </Text>
      </View>
    </View>
  );
}
