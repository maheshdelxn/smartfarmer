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
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

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
      <View className="mx-4 mt-6 mb-4 bg-white rounded-3xl shadow-sm overflow-hidden">
        <LinearGradient
          colors={['#16a34a', '#15803d']}
          className="px-6 py-8 items-center"
        >
          <View className="mb-4">
            <View className="w-28 h-28 rounded-3xl bg-white/20 border-4 border-white/30 justify-center items-center">
              <Text className="text-4xl font-bold text-white">
                {displayName.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          </View>
          
          <Text className="text-2xl font-bold text-white mb-2">{displayName}</Text>
          
          {displayAadhaar && (
            <View className="bg-white/20 px-5 py-2 rounded-full mb-6">
              <Text className="text-sm text-white font-medium">
                {displayAadhaar}
              </Text>
            </View>
          )}
          
          <View className="flex-row w-full">
            <TouchableOpacity 
              className="flex-1 bg-white rounded-2xl py-4 items-center flex-row justify-center"
              onPress={() => navigation.navigate('ProfileView')}
            >
              <Feather name="user" size={20} color="#16a34a" />
              <Text className="text-green-700 text-base font-semibold ml-2">View Profile</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const buildStatsCards = () => (
    <View className="mx-4 mb-4">
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-2">
          <MaterialCommunityIcons name="chart-box" size={20} color="#16a34a" />
        </View>
        <Text className="text-green-800 text-xl font-semibold">Farm Statistics</Text>
      </View>

      <View className="flex-row">
        <View className="flex-1 bg-white p-6 rounded-3xl items-center mr-2 shadow-sm">
          <View className="w-14 h-14 bg-green-600 rounded-2xl justify-center items-center mb-3">
            <MaterialCommunityIcons name="sprout" size={28} color="white" />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-1">{totalCrops}</Text>
          <Text className="text-sm text-gray-500 font-medium">Total Crops</Text>
        </View>
        
        <View className="flex-1 bg-white p-6 rounded-3xl items-center ml-2 shadow-sm">
          <View className="w-14 h-14 bg-blue-500 rounded-2xl justify-center items-center mb-3">
            <MaterialCommunityIcons name="land-plots" size={28} color="white" />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-1">{totalArea}</Text>
          <Text className="text-sm text-gray-500 font-medium">Total Acres</Text>
        </View>
      </View>
    </View>
  );

  const buildSettingsList = () => (
    <View className="mx-4 mb-4">
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-2">
          <Ionicons name="settings" size={20} color="#16a34a" />
        </View>
        <Text className="text-green-800 text-xl font-semibold">Settings</Text>
      </View>

      <View className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <SettingTile
          icon="globe"
          title="Language"
          subtitle="English"
          onPress={() => showLanguageDialog()}
        />
        <View className="h-px bg-gray-100 mx-5" />
        <SettingTile
          icon="bell"
          title="Notifications"
          
          subtitle={notificationsEnabled ? "Enabled" : "Disabled"}
          trailing={
            <TouchableOpacity onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <View className={`w-14 h-8 rounded-full p-1 ${
                notificationsEnabled ? 'bg-green-600' : 'bg-gray-300'
              }`}>
                <View className={`w-6 h-6 rounded-full bg-white shadow-sm ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </View>
            </TouchableOpacity>
          }
        />
        <View className="h-px bg-gray-100 mx-5" />
        <SettingTile
          icon="help-circle"
          title="Help & Support"
          subtitle="Get assistance"
          onPress={() => navigation.navigate('HelpSupport')}
        />
        <View className="h-px bg-gray-100 mx-5" />
        <SettingTile
          icon="information-circle"
          title="About"
          subtitle="App information"
          onPress={() => navigation.navigate('About')}
        />
      </View>
    </View>
  );

  const SettingTile = ({ icon, title, subtitle, trailing, onPress }) => (
    <TouchableOpacity className="flex-row items-center p-5" onPress={onPress}>
      <View className="w-12 h-12 bg-green-100 rounded-2xl justify-center items-center">
        <Ionicons name={icon} size={24} color="#16a34a" />
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-base font-semibold text-gray-800">{title}</Text>
        {subtitle && <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>}
      </View>
      {trailing || <Feather name="chevron-right" size={24} color="#9ca3af" />}
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
            colors={['#16a34a']}
          />
        }
        className="flex-1"
      >
        {buildProfileHeader()}
        {buildStatsCards()}
        {buildSettingsList()}
        
        <View className="mx-4 mb-6">
          <TouchableOpacity 
            className="bg-red-500 rounded-3xl py-5 items-center shadow-sm flex-row justify-center"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text className="text-white text-base font-semibold ml-2">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default ProfileScreen;