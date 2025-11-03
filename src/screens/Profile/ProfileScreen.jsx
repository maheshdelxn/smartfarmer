// C:\Users\ADMIN\Desktop\SM-MOBILE\smartfarmer\src\screens\Profile\ProfileScreen.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';


const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);
  const [totalCrops, setTotalCrops] = useState(0);
  const [totalArea, setTotalArea] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setupAnimations();
    initializeData();
  }, []);

  const setupAnimations = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const initializeData = async () => {
    try {
      await loadProfileData();
      await fetchCropsData();
    } catch (error) {
      console.log('Error initializing data:', error);
    }
  };

  const loadProfileData = async () => {
    try {
      const userData = await AuthService.getUserData();
      if (userData) {
        setProfileData(userData);
      }
    } catch (error) {
      console.log('Error loading profile data:', error);
    }
  };

  const fetchCropsData = async () => {
    try {
      const farmerId = await AuthService.getUserId();
      const response = await ApiService.get(`/crop/by-farmer/${farmerId}`);
      
      if (response.crops) {
        setTotalCrops(response.crops.length);
        
        // Calculate total area
        const area = response.crops.reduce((total, crop) => {
          return total + (parseFloat(crop.area?.value) || 0);
        }, 0);
        setTotalArea(area);
      }
    } catch (error) {
      console.log('Error fetching crops data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCropsData();
    await loadProfileData();
    setRefreshing(false);
  };

  const buildProfileHeader = () => {
    const displayName = profileData?.name || 'User';
    const displayAadhaar = profileData?.aadhaarNumber || profileData?.aadhaar_number || '';
    
    return (
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        className="px-6 py-6 items-center"
      >
        <View className="mb-4">
          <View className="w-25 h-25 rounded-3xl bg-white/20 border-2 border-white/30 justify-center items-center">
            <Text className="text-3xl font-bold text-white">
              {displayName.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text className="text-2xl font-bold text-white mb-2">{displayName}</Text>
        
        <View className="bg-white/20 px-4 py-2 rounded-full mb-5">
          <Text className="text-sm text-white font-medium">
            {displayAadhaar || 'No Aadhaar'}
          </Text>
        </View>
        
        <View className="flex-row w-full">
          <TouchableOpacity 
            className="flex-1 bg-white rounded-2xl py-4 items-center"
            onPress={() => navigation.navigate('ProfileView')}
          >
            <Text className="text-green-700 text-base font-semibold">View Profile</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  };

  const buildStatsCards = () => (
    <View className="flex-row mb-8">
      <View className="flex-1 bg-white p-5 rounded-2xl items-center mx-2 shadow-lg">
        <View className="w-12 h-12 bg-green-50 rounded-2xl justify-center items-center mb-3">
          <Text className="text-2xl text-green-500">🌱</Text>
        </View>
        <Text className="text-xl font-bold text-gray-800 mb-1">{totalCrops}</Text>
        <Text className="text-xs text-gray-500 font-medium">Total Crops</Text>
      </View>
      
      <View className="flex-1 bg-white p-5 rounded-2xl items-center mx-2 shadow-lg">
        <View className="w-12 h-12 bg-blue-50 rounded-2xl justify-center items-center mb-3">
          <Text className="text-2xl text-blue-500">🌾</Text>
        </View>
        <Text className="text-xl font-bold text-gray-800 mb-1">{totalArea} acres</Text>
        <Text className="text-xs text-gray-500 font-medium">Total Area</Text>
      </View>
    </View>
  );

  const buildSettingsList = () => (
    <View className="bg-white rounded-2xl shadow-lg mb-8">
      <SettingTile
        icon="🌐"
        title="Language"
        subtitle="English"
        onPress={() => showLanguageDialog()}
      />
      <View className="h-px bg-gray-100 mx-5" />
      <SettingTile
        icon="🔔"
        title="Notifications"
        trailing={
          <TouchableOpacity onPress={() => setNotificationsEnabled(!notificationsEnabled)}>
            <View className={`w-12 h-7 rounded-2xl p-1 ${
              notificationsEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <View className={`w-6 h-6 rounded-full bg-white ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </View>
          </TouchableOpacity>
        }
      />
      <View className="h-px bg-gray-100 mx-5" />
      <SettingTile
        icon="❓"
        title="Help & Support"
        onPress={() => navigation.navigate('HelpSupport')}
      />
      <View className="h-px bg-gray-100 mx-5" />
      <SettingTile
        icon="ℹ️"
        title="About"
        onPress={() => navigation.navigate('About')}
      />
    </View>
  );

  const SettingTile = ({ icon, title, subtitle, trailing, onPress }) => (
    <TouchableOpacity className="flex-row items-center p-5" onPress={onPress}>
      <View className="w-10 h-10 bg-green-50 rounded-2xl justify-center items-center">
        <Text className="text-xl">{icon}</Text>
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-base font-semibold text-green-800">{title}</Text>
        {subtitle && <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>}
      </View>
      {trailing || <Text className="text-base text-gray-400">›</Text>}
    </TouchableOpacity>
  );

  const showLanguageDialog = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      [
        { text: 'English', onPress: () => console.log('English selected') },
        { text: 'हिंदी', onPress: () => console.log('Hindi selected') },
        { text: 'मराठी', onPress: () => console.log('Marathi selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await AuthService.logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        },
      ]
    );
  };

  return (
    <Animated.View className="flex-1 bg-green-50" style={{ opacity: fadeAnim }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
          />
        }
        className="flex-1"
      >
        {buildProfileHeader()}
        <View className="p-5">
          {buildStatsCards()}
          
          <View className="flex-row items-center mb-4">
            <View className="bg-green-50 p-2 rounded-2xl">
              <Text className="text-base">⚙️</Text>
            </View>
            <Text className="text-xl font-bold text-green-900 ml-3">Settings</Text>
          </View>
          
          {buildSettingsList()}
          
          <TouchableOpacity 
            className="bg-red-500 rounded-2xl py-4 items-center shadow-lg shadow-red-500/30"
            onPress={handleLogout}
          >
            <Text className="text-white text-base font-semibold">🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default ProfileScreen;