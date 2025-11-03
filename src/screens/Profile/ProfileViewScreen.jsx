import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const ProfileViewScreen = ({ route }) => {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);
  
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      // Create mock user data directly instead of using AuthService
      const mockUserData = {
        id: 'demo-user-123',
        name: 'Demo Farmer',
        mobileNumber: '9876543210',
        aadhaarNumber: '1234 5678 9012',
        contactNumber: '9876543210',
        village: 'Demo Village',
        taluka: 'Demo Taluka',
        district: 'Demo District',
        pincode: '123456',
        createdAt: new Date().toISOString(),
      };
      
      setProfileData(mockUserData);
    } catch (error) {
      console.log('Error loading profile data:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
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

  const navigateToEditProfile = () => {
    if (profileData) {
      navigation.navigate('EditFarmerDetails', { farmer: profileData });
    } else {
      Alert.alert('Error', 'Profile data not available for editing');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Get profile data with fallbacks
  const name = profileData?.name || 'Demo Farmer';
  const aadhaar = profileData?.aadhaarNumber || profileData?.aadhaar_number || '1234 5678 9012';
  const contact = profileData?.contactNumber || profileData?.contact_number || '9876543210';
  const village = profileData?.village || 'Demo Village';
  const taluka = profileData?.taluka || 'Demo Taluka';
  const district = profileData?.district || 'Demo District';
  const pincode = profileData?.pincode || '123456';
  const id = profileData?.id || profileData?._id || '';
  const createdAt = formatDate(profileData?.createdAt || profileData?.created_at || new Date().toISOString());

  const buildProfileHeader = () => (
    <View className="mt-2 rounded-2xl overflow-hidden shadow-lg shadow-green-500/30">
      <LinearGradient
        colors={['#66BB6A', '#4CAF50']}
        className="p-6"
      >
        <View className="flex-row items-center">
          <View className="w-17 h-17 rounded-full bg-white/25 justify-center items-center mr-5">
            <Text className="text-2xl font-bold text-white">
              {name ? name.substring(0, 2).toUpperCase() : 'DF'}
            </Text>
          </View>
          <Text className="flex-1 text-2xl font-bold text-white -tracking-tight" numberOfLines={2}>
            {name}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  const buildQuickStats = () => (
    <View className="flex-row justify-between">
      <StatCard
        title="Total Crops"
        value="12"
        unit=""
        icon="🌱"
        color="#2196F3"
      />
      <View className="w-3" />
      <StatCard
        title="Total Area"
        value="45"
        unit="acres"
        icon="🌾"
        color="#FF9800"
      />
      <View className="w-3" />
      <StatCard
        title="Verified Crops"
        value="8"
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

  const buildDetailsSection = ({ title, sectionIcon, details }) => (
    <View className="bg-white rounded-2xl shadow-lg">
      <View className="flex-row items-center p-6 pb-4">
        <View className="w-9 h-9 bg-blue-50 rounded-xl justify-center items-center mr-3">
          <Text className="text-base text-blue-700">{sectionIcon}</Text>
        </View>
        <Text className="text-lg font-bold text-gray-800 flex-1">{title}</Text>
      </View>
      {details}
    </View>
  );

  const buildDetailRow = (title, value, icon, color, isLast = false) => (
    <View className={`flex-row items-center px-6 py-3 ${!isLast && 'border-b border-gray-100'}`}>
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

  return (
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
            details: [
              buildDetailRow("Name", name, "👨‍🌾", "#4CAF50"),
              buildDetailRow("Contact Number", contact, "📞", "#2196F3"),
              buildDetailRow("Aadhaar Number", aadhaar, "🆔", "#FF9800", true),
            ]
          })}

          <View className="h-6" />

          {/* Address Information */}
          {buildDetailsSection({
            title: "Address Information",
            sectionIcon: "📍",
            details: [
              buildDetailRow("Village", village, "🏘️", "#4CAF50"),
              buildDetailRow("Taluka", taluka, "🗺️", "#2196F3"),
              buildDetailRow("District", district, "🏛️", "#FF9800"),
              buildDetailRow("Pincode", pincode, "📮", "#F44336", true),
            ]
          })}

          <View className="h-6" />

          {/* Account Information */}
          {buildDetailsSection({
            title: "Account Information",
            sectionIcon: "📋",
            details: [
              buildDetailRow("Registration Date", createdAt, "📅", "#2196F3", true),
            ]
          })}

          <View className="h-10" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileViewScreen;