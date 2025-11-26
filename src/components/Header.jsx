// C:\Users\ADMIN\Desktop\SM-MOBILE\smartfarmer\src\components\Header.jsx
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

export default function Header({ userName: propUserName }) {
  // Safe navigation hook - will be null if outside navigation context
  const navigation = useNavigation();
  const [userName, setUserName] = useState(propUserName || "User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [propUserName]);

  const loadUserData = async () => {
    try {
      // If userName is passed as prop, use it
      if (propUserName) {
        setUserName(propUserName);
        setLoading(false);
        return;
      }

      // Otherwise, try to get from AuthService
      const userData = await AuthService.getUserData();
      console.log('👤 AuthService user data:', userData);
      
      if (userData?.name) {
        setUserName(userData.name);
      } else if (userData?.firstName) {
        setUserName(userData.firstName);
      }
    } catch (error) {
      console.log('❌ Error loading user data in Header:', error);
    } finally {
      setLoading(false);
    }
  };

  // Safe navigation handlers
  const handleProfilePress = () => {
    if (navigation) {
      navigation.navigate('Profile');
    } else {
      console.log('Navigation not available');
    }
  };

  const handleLogoPress = () => {
    if (navigation) {
      navigation.navigate('Home');
    } else {
      console.log('Navigation not available');
    }
  };

  // Get first name for greeting
  const getFirstName = (fullName) => {
    if (!fullName) return "User";
    return fullName.split(' ')[0];
  };

  const displayName = loading ? "..." : getFirstName(userName);

  return (
    <View className="flex-row items-center justify-between bg-green-600 px-5 pt-12 pb-4 shadow-md">
      {/* App Logo - Clickable */}
      <TouchableOpacity onPress={handleLogoPress}>
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
      </TouchableOpacity>

      {/* Welcome Text - Clickable for Profile */}
      <TouchableOpacity onPress={handleProfilePress}>
        <View className="items-end">
          <Text className="text-white text-sm opacity-90">Welcome back,</Text>
          <View className="flex-row items-center">
            <Text className="text-white text-lg font-semibold mr-1">
              {displayName}
            </Text>
            <Text className="text-white text-lg">👋</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}