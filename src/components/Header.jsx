// C:\Users\ADMIN\Desktop\SM-MOBILE\smartfarmer\src\components\Header.jsx
import { View, Text, Image } from "react-native";

export default function Header() {
  return (
    <View className="flex-row items-center justify-between bg-green-600 px-5 pt-12 pb-4 shadow-md">
      {/* App Logo */}
      <View className="flex-row items-center">
        <Image
          source={require("../../assets/Logo.png")}
          className="w-14 h-14 mr-2"
          resizeMode="contain"
        />
        <Text className="text-white text-xl font-extrabold tracking-wide">
          Smart Farmer
        </Text>
      </View>

      {/* Welcome Text */}
      <View className="items-end">
        <Text className="text-white text-sm opacity-90">Welcome back,</Text>
        <Text className="text-white text-lg font-semibold">Mahesh 👋</Text>
      </View>
    </View>
  );
}
