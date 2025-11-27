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
  ActivityIndicator,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../../services/ApiService';
import AuthService from '../../services/AuthService';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);
  const [totalCrops, setTotalCrops] = useState(0);
  const [totalArea, setTotalArea] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to English

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Load saved language on component mount
  useEffect(() => {
    loadSavedLanguage();
    setupAnimations();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      initializeData();
      return () => {};
    }, [])
  );

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        setSelectedLanguage(savedLanguage);
      }
    } catch (error) {
      console.log('❌ Error loading language:', error);
    }
  };

  const saveLanguage = async (languageCode) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', languageCode);
      setSelectedLanguage(languageCode);
      setLanguageModalVisible(false);
      
      // Show success message
      Alert.alert(
        getLanguageDisplayName(languageCode),
        'Language changed successfully!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.log('❌ Error saving language:', error);
      Alert.alert('Error', 'Failed to save language preference');
    }
  };

  const getLanguageDisplayName = (code) => {
    switch (code) {
      case 'en':
        return 'English';
      case 'hi':
        return 'हिन्दी';
      case 'mr':
        return 'मराठी';
      default:
        return code;
    }
  };

  const showLanguageDialog = () => {
    setLanguageModalVisible(true);
  };

  const setupAnimations = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const initializeData = async () => {
    try {
      setLoading(true);
      await loadProfileData();
      await fetchCropsData();
    } catch (error) {
      console.log('❌ Error initializing data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const loadProfileData = async () => {
    try {
      console.log('🔄 Loading profile data...');
      
      const localUserData = await AuthService.getUserData();
      console.log('📱 Local user data:', localUserData);
      
      if (localUserData) {
        setProfileData(localUserData);
      }

      let userId = await AuthService.getUserId();
      console.log('👤 User ID from AuthService:', userId);

      if (!userId && localUserData) {
        userId = localUserData._id || localUserData.id;
        console.log('👤 User ID from local data:', userId);
      }

      if (userId) {
        console.log('🌐 Fetching profile from backend...');
        const response = await ApiService.get(`/farmer/${userId}`);
        console.log('✅ Profile API response:', response);
        
        const farmerData = response?.farmer || response?.data || response;
        
        if (farmerData) {
          console.log('✅ Profile data loaded:', farmerData);
          setProfileData(farmerData);
          await AsyncStorage.setItem('userData', JSON.stringify(farmerData));
        } else {
          console.log('❌ No farmer data in response');
        }
      } else {
        console.log('❌ No user ID available for API call');
      }
    } catch (error) {
      console.log('❌ Error loading profile data:', error);
      if (!profileData) {
        const localData = await AuthService.getUserData();
        if (localData) {
          setProfileData(localData);
        }
      }
    }
  };

  const fetchCropsData = async () => {
    try {
      console.log('🌱 Fetching crops data...');
      
      let farmerId = await AuthService.getUserId();
      
      if (!farmerId) {
        const localUserData = await AuthService.getUserData();
        farmerId = localUserData?._id || localUserData?.id;
        console.log('👤 Farmer ID from fallback:', farmerId);
      }

      if (!farmerId) {
        console.log('❌ No farmer ID found, skipping crops fetch');
        setTotalCrops(0);
        setTotalArea(0);
        return;
      }

      console.log('👤 Fetching crops for farmer ID:', farmerId);
      const response = await ApiService.get(`/crop/by-farmer/${farmerId}`);
      console.log('✅ Crops API response structure:', Object.keys(response));
      
      const cropsData = response?.crops || response?.data || response || [];
      
      if (Array.isArray(cropsData)) {
        console.log(`✅ Found ${cropsData.length} crops`);
        setTotalCrops(cropsData.length);
        
        const area = cropsData.reduce((total, crop) => {
          let areaValue = 0;
          
          if (crop.area && typeof crop.area === 'object') {
            areaValue = crop.area.value || 0;
          } else if (crop.areaPlanted && typeof crop.areaPlanted === 'object') {
            areaValue = crop.areaPlanted.value || 0;
          } else if (typeof crop.area === 'string') {
            const match = crop.area.match(/(\d+\.?\d*)/);
            areaValue = match ? parseFloat(match[1]) : 0;
          }
          
          return total + (parseFloat(areaValue) || 0);
        }, 0);
        
        const roundedArea = parseFloat(area.toFixed(2));
        console.log(`📊 Total area calculated: ${roundedArea}`);
        setTotalArea(roundedArea);
      } else {
        console.log('❌ Crops data is not an array:', cropsData);
        setTotalCrops(0);
        setTotalArea(0);
      }
    } catch (error) {
      console.log('❌ Error fetching crops data:', error);
      setTotalCrops(0);
      setTotalArea(0);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchCropsData();
      await loadProfileData();
    } catch (error) {
      console.log('❌ Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const buildProfileHeader = () => {
    const displayName = profileData?.name || profileData?.firstName || 'User';
    const displayAadhaar = profileData?.aadhaarNumber || profileData?.aadhaar_number || '';
    const displayPhone = profileData?.phoneNumber || profileData?.phone_number || '';
    
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
          
          {displayAadhaar ? (
            <View className="bg-white/20 px-5 py-2 rounded-full mb-2">
              <Text className="text-sm text-white font-medium">
                Aadhaar: {displayAadhaar}
              </Text>
            </View>
          ) : null}
          
          {displayPhone ? (
            <View className="bg-white/20 px-5 py-2 rounded-full mb-6">
              <Text className="text-sm text-white font-medium">
                {displayPhone}
              </Text>
            </View>
          ) : null}
          
          <View className="flex-row w-full">
            <TouchableOpacity 
              className="flex-1 bg-white rounded-2xl py-4 items-center flex-row justify-center"
              onPress={() => navigation.navigate('ProfileView', { profileData })}
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
    <View className="bg-white rounded-2xl shadow-lg mb-8">
      {/* Language Selection Option - REPLACED Edit Profile */}
      <SettingTile
        icon="language"
        title="Language"
        subtitle={getLanguageDisplayName(selectedLanguage)}
        onPress={showLanguageDialog}
      />
      <View className="h-px bg-gray-100 mx-5" />
      
      <SettingTile
        icon="notifications-outline"
        title="Notifications"
        onPress={() => navigation.navigate('NotificationScreen')}
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
        icon="help-circle-outline"
        title="Help & Support"
        onPress={() => navigation.navigate('HelpSupport')}
      />
      <View className="h-px bg-gray-100 mx-5" />
      <SettingTile
        icon="information-circle-outline"
        title="About"
        onPress={() => navigation.navigate('About')}
      />
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

  const LanguageSelectionModal = () => (
    <Modal
      visible={languageModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setLanguageModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-3xl w-11/12 max-w-md">
          {/* Header */}
          <View className="px-6 py-5 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-800 text-center">
              Select Language
            </Text>
          </View>
          
          {/* Language Options */}
          <View className="p-4">
            <TouchableOpacity 
              className={`flex-row items-center p-4 rounded-2xl mb-3 ${
                selectedLanguage === 'en' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
              }`}
              onPress={() => saveLanguage('en')}
            >
              <View className="w-10 h-10 bg-green-100 rounded-xl justify-center items-center mr-4">
                <Text className="text-green-600 font-bold">EN</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">English</Text>
                <Text className="text-sm text-gray-500">English</Text>
              </View>
              {selectedLanguage === 'en' && (
                <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              className={`flex-row items-center p-4 rounded-2xl mb-3 ${
                selectedLanguage === 'hi' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
              }`}
              onPress={() => saveLanguage('hi')}
            >
              <View className="w-10 h-10 bg-green-100 rounded-xl justify-center items-center mr-4">
                <Text className="text-green-600 font-bold">HI</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">हिन्दी</Text>
                <Text className="text-sm text-gray-500">Hindi</Text>
              </View>
              {selectedLanguage === 'hi' && (
                <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              className={`flex-row items-center p-4 rounded-2xl ${
                selectedLanguage === 'mr' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
              }`}
              onPress={() => saveLanguage('mr')}
            >
              <View className="w-10 h-10 bg-green-100 rounded-xl justify-center items-center mr-4">
                <Text className="text-green-600 font-bold">MR</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">मराठी</Text>
                <Text className="text-sm text-gray-500">Marathi</Text>
              </View>
              {selectedLanguage === 'mr' && (
                <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
              )}
            </TouchableOpacity>
          </View>
          
          {/* Cancel Button */}
          <TouchableOpacity 
            className="p-4 border-t border-gray-100"
            onPress={() => setLanguageModalVisible(false)}
          >
            <Text className="text-center text-gray-600 text-lg font-semibold">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
            try {
              await AuthService.logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.log('❌ Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          }
        },
      ]
    );
  };

  if (loading && !profileData) {
    return (
      <View className="flex-1 bg-green-50 justify-center items-center">
        <View className="w-16 h-16 bg-green-600 rounded-2xl items-center justify-center mb-4">
          <MaterialCommunityIcons name="sprout" size={32} color="white" />
        </View>
        <Text className="text-green-600 text-lg font-semibold">Loading profile...</Text>
        <ActivityIndicator size="small" color="#16a34a" className="mt-4" />
      </View>
    );
  }

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
        showsVerticalScrollIndicator={false}
      >
        {buildProfileHeader()}
        {buildStatsCards()}
        {buildSettingsList()}
        
        {/* Logout Button */}
        <View className="mx-4 mb-6">
          <TouchableOpacity 
            className="bg-red-500 rounded-3xl py-5 items-center shadow-sm flex-row justify-center"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text className="text-white text-base font-semibold ml-2">Logout</Text>
          </TouchableOpacity>
        </View>
        
        {/* Debug Info - Remove in production */}
        {/* {__DEV__ && (
          <View className="mx-4 mb-6 bg-gray-100 rounded-2xl p-4">
            <Text className="text-gray-600 text-xs font-mono">
              Debug: Crops: {totalCrops}, Area: {totalArea}, Language: {selectedLanguage}
            </Text>
          </View>
        )} */}
      </ScrollView>

      {/* Language Selection Modal */}
      <LanguageSelectionModal />
    </Animated.View>
  );
};

export default ProfileScreen;