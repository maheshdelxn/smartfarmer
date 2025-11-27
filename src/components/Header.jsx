// C:\Users\ADMIN\Desktop\SM-MOBILE\smartfarmer\src\components\Header.jsx
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useEffect, useState, useCallback } from "react";
import React from "react";
import AuthService from "../services/AuthService";
import ApiService from "../services/ApiService";

export default function Header({ userName: propUserName }) {
  const navigation = useNavigation();
  const [userName, setUserName] = useState(propUserName || "User");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Header - Loading user data...');
      
      // If userName is passed as prop, use it
      if (propUserName) {
        setUserName(propUserName);
        setLoading(false);
        return;
      }

      // Get user ID first
      const userId = await AuthService.getUserId();
      console.log('👤 Header - User ID:', userId);
      
      if (!userId) {
        console.log('❌ Header - No user ID found');
        await loadLocalUserData();
        return;
      }

      // Fetch fresh data from backend API
      console.log('🌐 Header - Fetching user data from backend...');
      const response = await ApiService.get(`/farmer/${userId}`);
      console.log('✅ Header - Backend response received');
      
      // Handle different response structures
      const farmerData = response?.farmer || response?.data || response;
      
      if (farmerData && (farmerData.name || farmerData.firstName)) {
        console.log('✅ Header - User data loaded:', farmerData.name || farmerData.firstName);
        
        // Set the user name
        const name = farmerData.name || farmerData.firstName;
        setUserName(name);
        setUserData(farmerData);
        
        // Update local storage with fresh data
        await AuthService.setUserData(farmerData);
      } else {
        console.log('❌ Header - No valid farmer data in response');
        await loadLocalUserData();
      }
    } catch (error) {
      console.log('❌ Header - Error loading user data from API:', error);
      // Fallback to local data if API fails
      await loadLocalUserData();
    } finally {
      setLoading(false);
    }
  }, [propUserName]);

  const loadLocalUserData = async () => {
    try {
      const localUserData = await AuthService.getUserData();
      console.log('📱 Header - Loading from local storage:', localUserData);
      
      if (localUserData && (localUserData.name || localUserData.firstName)) {
        const name = localUserData.name || localUserData.firstName;
        setUserName(name);
        setUserData(localUserData);
        console.log('✅ Header - Local data loaded:', name);
      } else {
        console.log('❌ Header - No valid local user data');
        setUserName("User");
        setUserData({ name: "User" }); // Set a default userData object
      }
    } catch (error) {
      console.log('❌ Header - Error loading local data:', error);
      setUserName("User");
      setUserData({ name: "User" }); // Set a default userData object
    }
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🎯 Header - Screen focused, refreshing data...');
      loadUserData();
    }, [loadUserData])
  );

  // Initial load
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Safe navigation handlers
  const handleProfilePress = () => {
    if (navigation && userData) {
      navigation.navigate('Profile', { userData });
    } else {
      console.log('Navigation not available or userData is null');
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

  // Safe display name - use userName state which is always updated
  const displayName = loading ? "..." : getFirstName(userName);

  return (
    <View className="flex-row items-center justify-between bg-green-600 px-5 pt-12 pb-4 pt-3 shadow-md">
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
              {displayName} {/* FIXED: Use displayName instead of userData.name */}
            </Text>
            <Text className="text-white text-lg">👋</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}