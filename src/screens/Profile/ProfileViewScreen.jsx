import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ApiService from '../../services/ApiService';
import AuthService from '../../services/AuthService';

const { width: screenWidth } = Dimensions.get('window');

const ProfileViewScreen = ({ route }) => {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cropStats, setCropStats] = useState({
    totalCrops: 0,
    totalArea: 0,
    verifiedCrops: 0
  });
  
  useFocusEffect(
    React.useCallback(() => {
      loadProfileData();
      return () => {};
    }, [])
  );

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // First try to get user data from route params (from login)
      if (route.params?.fullUserData) {
        console.log('📱 Using user data from route params');
        setProfileData(route.params.fullUserData);
        await fetchCropStats(route.params.fullUserData._id);
        return;
      }

      // Fallback to AuthService
      const userData = await AuthService.getUserData();
      const userId = await AuthService.getUserId();
      
      console.log('👤 AuthService user ID:', userId);
      console.log('👤 AuthService user data:', userData);

      if (userData) {
        setProfileData(userData);
        await fetchCropStats(userData._id || userId);
      } else if (userId) {
        // Fetch fresh data from backend
        await fetchFarmerProfile(userId);
      } else {
        Alert.alert('Error', 'User not authenticated. Please login again.');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log('❌ Error loading profile data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmerProfile = async (userId) => {
    try {
      console.log('📡 Fetching farmer profile for ID:', userId);
      const response = await ApiService.get(`/farmer/${userId}`);
      console.log('✅ Farmer profile response:', response);
      
      if (response && response.farmer) {
        setProfileData(response.farmer);
        await fetchCropStats(userId);
      }
    } catch (error) {
      console.log('❌ Error fetching farmer profile:', error);
      throw error;
    }
  };

  const fetchCropStats = async (farmerId) => {
    try {
      if (!farmerId) {
        console.log('❌ No farmer ID provided for crop stats');
        return;
      }

      console.log('🌱 Fetching crop stats for farmer:', farmerId);
      const response = await ApiService.get(`/crop/by-farmer/${farmerId}`);
      console.log('✅ Crop stats response:', response);
      
      if (response && response.crops) {
        const crops = response.crops;
        const totalCrops = crops.length;
        
        // Calculate total area - handle different area field structures
        const totalArea = crops.reduce((total, crop) => {
          const areaValue = crop.area?.value || crop.area || 0;
          return total + (parseFloat(areaValue) || 0);
        }, 0);
        
        // Count verified crops based on applicationStatus
        const verifiedCrops = crops.filter(crop => 
          crop.applicationStatus === 'verified' || crop.applicationStatus === 'approved'
        ).length;

        setCropStats({
          totalCrops,
          totalArea: parseFloat(totalArea.toFixed(2)),
          verifiedCrops
        });
      }
    } catch (error) {
      console.log('❌ Error fetching crop stats:', error);
      // Set default values if API fails
      setCropStats({
        totalCrops: 0,
        totalArea: 0,
        verifiedCrops: 0
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadProfileData();
    } catch (error) {
      console.log('❌ Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString.split('T')[0];
    }
  };

  const formatAadhaar = (aadhaar) => {
    if (!aadhaar) return 'Not available';
    const cleaned = aadhaar.replace(/\s/g, '');
    if (cleaned.length === 12) {
      return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 8)} ${cleaned.substring(8, 12)}`;
    }
    return aadhaar;
  };

  const navigateToEditProfile = () => {
    if (profileData) {
      navigation.navigate('EditFarmerDetails', { 
        farmer: profileData,
        onProfileUpdate: loadProfileData
      });
    } else {
      Alert.alert('Error', 'Profile data not available for editing');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Get profile data with proper fallbacks for backend field names
  const name = profileData?.name || 'User';
  const aadhaar = formatAadhaar(profileData?.aadhaarNumber);
  const contact = profileData?.contact || profileData?.phoneNumber || 'Not available';
  const village = profileData?.village || 'Not available';
  const taluka = profileData?.taluka || 'Not available';
  const district = profileData?.district || 'Not available';
  const pincode = profileData?.pincode || 'Not available';
  const state = profileData?.state || 'Not available';
  const landMark = profileData?.landMark || 'Not available';
  const id = profileData?._id || '';
  const createdAt = formatDate(profileData?.createdAt);

  const buildProfileHeader = () => (
    <View className="mt-2 rounded-2xl overflow-hidden shadow-lg shadow-green-500/30">
      <LinearGradient
        colors={['#66BB6A', '#4CAF50']}
        className="p-6"
      >
        <View className="flex-row items-center">
          <View className="w-17 h-17 rounded-full bg-white/25 justify-center items-center mr-5">
            <Text className="text-2xl font-bold text-white">
              {name ? name.substring(0, 2).toUpperCase() : 'US'}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-white -tracking-tight" numberOfLines={2}>
              {name}
            </Text>
            {id && (
              <Text className="text-white/80 text-sm mt-1">
                ID: {id.substring(0, 8)}...
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const buildQuickStats = () => (
    <View className="flex-row justify-between">
      <StatCard
        key="total-crops"
        title="Total Crops"
        value={cropStats.totalCrops.toString()}
        unit=""
        icon="🌱"
        color="#2196F3"
      />
      <View className="w-3" />
      <StatCard
        key="total-area"
        title="Total Area"
        value={cropStats.totalArea.toString()}
        unit="acres"
        icon="🌾"
        color="#FF9800"
      />
      <View className="w-3" />
      <StatCard
        key="verified-crops"
        title="Verified Crops"
        value={cropStats.verifiedCrops.toString()}
        unit=""
        icon="✅"
        color="#4CAF50"
      />
    </View>
  );

  const StatCard = ({ title, value, unit, icon, color }) => (
    <View className="flex-1 bg-white p-5 rounded-2xl shadow-lg">
      <View 
        className="w-9 h-9 rounded-xl justify-center items-center mb-3"
        style={{ backgroundColor: `${color}10` }}
      >
        <Text style={{ color }} className="text-base">{icon}</Text>
      </View>
      <Text className="text-xs text-gray-500 font-medium mb-1">{title}</Text>
      <View className="flex-row items-baseline">
        <Text className="text-lg font-bold text-gray-800">{value}</Text>
        {unit ? <Text className="text-xs font-medium text-gray-500 ml-1">{unit}</Text> : null}
      </View>
    </View>
  );

  const buildDetailsSection = ({ title, sectionIcon, children }) => (
    <View className="bg-white rounded-2xl shadow-lg mb-6">
      <View className="flex-row items-center p-6 pb-4">
        <View className="w-9 h-9 bg-blue-50 rounded-xl justify-center items-center mr-3">
          <Text className="text-base text-blue-700">{sectionIcon}</Text>
        </View>
        <Text className="text-lg font-bold text-gray-800 flex-1">{title}</Text>
      </View>
      {children}
    </View>
  );

  const buildDetailRow = (key, title, value, icon, color, isLast = false) => (
    <View 
      key={key}
      className={`flex-row items-center px-6 py-3 ${!isLast && 'border-b border-gray-100'}`}
    >
      <View 
        className="w-8 h-8 rounded-lg justify-center items-center mr-4"
        style={{ backgroundColor: `${color}10` }}
      >
        <Text style={{ color }} className="text-sm">{icon}</Text>
      </View>
      <View className="flex-1 flex-row justify-between items-center">
        <Text className="font-semibold text-sm text-gray-700 flex-2">{title}</Text>
        <Text className="font-medium text-sm text-gray-800 flex-3 text-right" numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );

  if (loading && !profileData) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-green-50">
          <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
          <LinearGradient
            colors={['#2E7D32', '#4CAF50']}
            className="pt-12 pb-4 shadow-lg"
          >
            <View className="flex-row items-center justify-between px-4">
              <TouchableOpacity 
                className="w-10 h-10 bg-white/20 rounded-xl justify-center items-center"
                onPress={handleBack}
              >
                <Text className="text-white text-lg font-bold">←</Text>
              </TouchableOpacity>
              
              <Text className="text-white text-xl font-semibold">Profile Details</Text>
              
              <View className="w-10 h-10" />
            </View>
          </LinearGradient>
          
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#16a34a" />
            <Text className="text-green-600 text-lg mt-4">Loading profile...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-green-50">
        <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
        
        {/* Custom Header - Profile Details */}
        <LinearGradient
          colors={['#2E7D32', '#4CAF50']}
          className="pt-12 pb-4 shadow-lg"
        >
          <View className="flex-row items-center justify-between px-4">
            <TouchableOpacity 
              className="w-10 h-10 bg-white/20 rounded-xl justify-center items-center"
              onPress={handleBack}
            >
              <Text className="text-white text-lg font-bold">←</Text>
            </TouchableOpacity>
            
            <Text className="text-white text-xl font-semibold">Profile Details</Text>
            
            <TouchableOpacity 
              className="w-10 h-10 bg-white/20 rounded-xl justify-center items-center"
              onPress={navigateToEditProfile}
            >
              <Text className="text-white text-base">✏️</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#16a34a']}
            />
          }
        >
          <View className="p-5 pb-10">
            {buildProfileHeader()}
            <View className="h-6" />
            {buildQuickStats()}
            <View className="h-6" />

            {/* Personal Information */}
            {buildDetailsSection({
              title: "Personal Information",
              sectionIcon: "👤",
              children: [
                buildDetailRow("name", "Name", name, "👨‍🌾", "#4CAF50"),
                buildDetailRow("contact", "Contact Number", contact, "📞", "#2196F3"),
                buildDetailRow("aadhaar", "Aadhaar Number", aadhaar, "🆔", "#FF9800", true),
              ]
            })}

            <View className="h-6" />

            {/* Address Information */}
            {buildDetailsSection({
              title: "Address Information",
              sectionIcon: "📍",
              children: [
                buildDetailRow("village", "Village", village, "🏘️", "#4CAF50"),
                buildDetailRow("taluka", "Taluka", taluka, "🗺️", "#2196F3"),
                buildDetailRow("district", "District", district, "🏛️", "#FF9800"),
                buildDetailRow("state", "State", state, "🗾", "#9C27B0"),
                buildDetailRow("pincode", "Pincode", pincode, "📮", "#F44336"),
                buildDetailRow("landmark", "Landmark", landMark, "📍", "#607D8B", true),
              ]
            })}

            <View className="h-6" />

            {/* Account Information */}
            {buildDetailsSection({
              title: "Account Information",
              sectionIcon: "📋",
              children: [
                buildDetailRow("reg-date", "Registration Date", createdAt, "📅", "#2196F3", true),
              ]
            })}

            <View className="h-10" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ProfileViewScreen;