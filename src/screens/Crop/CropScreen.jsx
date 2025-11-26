// C:\Users\ADMIN\Desktop\SM-MOBILE\smartfarmer\src\screens\Crop\CropScreen.jsx

import { View, Text, ScrollView, TouchableOpacity, Image, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from 'react';
import ApiService from '../../services/ApiService';
import AuthService from '../../services/AuthService';

// Helper function to safely extract values from objects
const safeString = (value, defaultValue = 'N/A') => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (value && typeof value === 'object') {
    // Handle area objects like {value: "10", unit: "acres"}
    if (value.value !== undefined && value.unit !== undefined) {
      return `${value.value} ${value.unit}`;
    }
    return value.value ? value.value.toString() : defaultValue;
  }
  return defaultValue;
};

// Crop Card Component
const CropCard = ({ crop, onPress }) => {
  // Safely extract crop data
  const cropName = safeString(crop.cropName || crop.name);
  const cropType = safeString(crop.cropType);
  const area = safeString(crop.areaPlanted || crop.area);
  const plantedDate = safeString(crop.plantingDate || crop.plantedDate || crop.sowingDate);
  const status = safeString(crop.status || crop.applicationStatus);

  return (
    <TouchableOpacity 
      className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        {/* Crop Image */}
        <View className="w-16 h-16 bg-gray-200 rounded-xl mr-4 overflow-hidden">
          {crop.images && crop.images.length > 0 ? (
            <Image 
              source={{ uri: crop.images[0] }} 
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-green-100 items-center justify-center">
              <MaterialCommunityIcons name="sprout" size={32} color="#16a34a" />
            </View>
          )}
        </View>

        {/* Crop Details */}
        <View className="flex-1">
          {/* Crop Name and Area */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-semibold text-gray-800" numberOfLines={1}>
              {cropName}
            </Text>
            <Text className="text-sm text-gray-500 ml-2">Area: {area}</Text>
          </View>

          {/* Crop Type */}
          {cropType && cropType !== 'N/A' && (
            <Text className="text-sm text-gray-600 mb-1">Type: {cropType}</Text>
          )}

          {/* Planted Date */}
          <View className="flex-row items-center mb-3">
            <Ionicons 
              name="calendar-outline" 
              size={16} 
              color="#6b7280" 
              style={{ marginRight: 6 }}
            />
            <Text className="text-sm text-gray-600">Planted: {plantedDate}</Text>
          </View>

          {/* Status and Arrow */}
          <View className="flex-row items-center">
            <View className={`rounded-lg py-2 px-4 flex-1 ${
              status === 'verified' ? 'bg-green-50 border border-green-200' : 
              status === 'pending' ? 'bg-yellow-50 border border-yellow-200' : 
              status === 'rejected' ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
            }`}>
              <Text className={`text-center font-medium ${
                status === 'verified' ? 'text-green-600' : 
                status === 'pending' ? 'text-yellow-600' : 
                status === 'rejected' ? 'text-red-600' : 'text-blue-600'
              }`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </View>
            <View className="ml-2">
              <Ionicons name="chevron-forward" size={20} color="#16a34a" />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Main Screen Component
export default function MyCropsScreen() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [userData, setUserData] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();

  // Load user data from AuthService
  const loadUserData = async () => {
    try {
      console.log('👤 Loading user data for crops...');
      const user = await AuthService.getUserData();
      console.log('✅ User data loaded:', user);
      setUserData(user);
      return user;
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      return null;
    }
  };

  // Fetch crops from backend using by-farmer endpoint
  const fetchCrops = async () => {
    try {
      console.log('🌱 Fetching crops from backend...');
      
      // First, try to get user data
      let user = userData;
      if (!user) {
        user = await loadUserData();
      }

      // Get token from AuthService
      const token = await AuthService.getAuthToken();
      
      if (!token) {
        console.log('❌ No authentication token found');
        setNetworkError(true);
        setLoading(false);
        return;
      }

      if (!user || !user._id) {
        console.log('❌ No user ID found, user data:', user);
        setNetworkError(true);
        setLoading(false);
        return;
      }

      console.log('👤 Fetching crops for farmer ID:', user._id);

      try {
        // Use ApiService for consistent API calls
        const response = await ApiService.get(`/crop/by-farmer/${user._id}`);
        console.log('✅ Crops API response:', response);
        
        // Handle the response format - it could be data.crops or just data array
        const cropsData = response.crops || response.data || response || [];
        setCrops(Array.isArray(cropsData) ? cropsData : [cropsData]);
        setNetworkError(false);
      } catch (apiError) {
        console.error('❌ ApiService error, trying direct fetch...', apiError);
        // Fallback to direct fetch
        await fetchCropsDirect(user._id, token);
      }
    } catch (error) {
      console.error('❌ Error fetching crops:', error.message);
      setNetworkError(true);
      // Fallback to mock data
      setCrops(getMockCropsData());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Direct fetch fallback
  const fetchCropsDirect = async (userId, token) => {
    try {
      const API_BASE_URL = "http://192.168.1.17:1000/api";
      const response = await fetch(`${API_BASE_URL}/crop/by-farmer/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 Direct fetch response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Direct fetch crops data received:', data);
        
        const cropsData = data.crops || data.data || data || [];
        setCrops(Array.isArray(cropsData) ? cropsData : [cropsData]);
        setNetworkError(false);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Direct fetch failed:', error);
      throw error;
    }
  };

  // Mock data fallback
  const getMockCropsData = () => {
    return [
      {
        _id: '1',
        name: 'Jowar',
        cropName: 'Jowar',
        cropType: 'Sorghum',
        area: { value: 25, unit: 'acre' },
        areaPlanted: '25 acre',
        plantingDate: '28-10-2025',
        sowingDate: '28-10-2025',
        status: 'pending',
        applicationStatus: 'pending',
        images: []
      },
      {
        _id: '2',
        name: 'Rice',
        cropName: 'Rice',
        cropType: null,
        area: { value: 47, unit: 'guntha' },
        areaPlanted: '47 guntha',
        plantingDate: '28-10-2025',
        sowingDate: '28-10-2025',
        status: 'verified',
        applicationStatus: 'verified',
        images: []
      },
    ];
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('MyCropsScreen focused - refreshing data');
      fetchCrops();
    }, [userData]) // Add userData as dependency
  );

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCrops();
  }, [userData]);

  const handleCropPress = (crop) => {
    console.log('Crop pressed:', crop.cropName || crop.name);
    navigation.navigate("Crop Information", { 
      crop: crop,
      user: userData,
      onCropUpdate: (updatedCrop) => {
        updateCrop(updatedCrop);
      }
    });
  };

  const handleAddCrop = () => {
    console.log('Add Crop pressed');
    navigation.navigate("Crop Details", {
      user: userData,
      editMode: false,
      onCropAdd: (newCrop) => {
        addNewCrop(newCrop);
      }
    });
  };

  // Function to update existing crop
  const updateCrop = (updatedCrop) => {
    setCrops(prevCrops => 
      prevCrops.map(crop => 
        crop._id === updatedCrop._id ? updatedCrop : crop
      )
    );
    console.log('Crop updated:', updatedCrop);
    Alert.alert('Success', 'Crop updated successfully!');
  };

  // Function to add new crop
  const addNewCrop = (newCrop) => {
    const cropWithId = {
      ...newCrop,
      _id: newCrop._id || `temp_${Date.now()}`,
      status: newCrop.status || 'pending'
    };
    setCrops(prevCrops => [...prevCrops, cropWithId]);
    console.log('New crop added:', cropWithId);
    Alert.alert('Success', 'New crop added successfully!');
    
    // Refresh the list to get the actual data from backend
    setTimeout(() => {
      fetchCrops();
    }, 1000);
  };

  // Get user display name
  const getUserDisplayName = () => {
    return userData?.name || 'Farmer';
  };

  // Render loading state
  if (loading) {
    return (
      <View className="flex-1 bg-green-50 justify-center items-center">
        <View className="bg-white rounded-2xl p-8 items-center shadow-sm">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-lg font-semibold text-gray-800 mt-4">Loading your crops...</Text>
          <Text className="text-gray-500 text-center mt-2">Please wait while we fetch your crop data</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-green-50">
      {/* Header with User Info */}
      <View className="bg-green-600 px-4 pt-12 pb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-2xl font-bold">My Crops</Text>
            <Text className="text-white/80 text-sm mt-1">
              {getUserDisplayName()}
            </Text>
            <Text className="text-white/60 text-xs mt-1">
              {crops.length} {crops.length === 1 ? 'crop' : 'crops'} registered
            </Text>
          </View>
          <View className="w-10 h-10 bg-green-700 rounded-xl items-center justify-center">
            <MaterialCommunityIcons name="sprout" size={24} color="white" />
          </View>
        </View>
      </View>

      {/* Network Status Banner */}
      {networkError && (
        <View className="mx-4 mt-4 bg-yellow-500 rounded-xl p-3">
          <Text className="text-white text-center font-medium">
            📡 Connection Issue - Using Local Data
          </Text>
        </View>
      )}

      {/* Debug Info - Remove in production */}
      {__DEV__ && (
        <View className="mx-4 mt-2 bg-blue-500 rounded-xl p-2">
          <Text className="text-white text-center text-xs">
            User ID: {userData?._id || 'Not found'} | Crops: {crops.length}
          </Text>
        </View>
      )}

      {/* Crops List */}
      <ScrollView 
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#16a34a']}
          />
        }
      >
        {/* Empty State */}
        {crops.length === 0 && !loading && (
          <View className="bg-white rounded-2xl p-8 items-center mt-8 shadow-sm">
            <MaterialCommunityIcons name="sprout-outline" size={64} color="#9ca3af" />
            <Text className="text-xl font-semibold text-gray-800 mt-4">No Crops Found</Text>
            <Text className="text-gray-500 text-center mt-2">
              {networkError 
                ? "Couldn't load crops. Check your connection or add your first crop."
                : "You haven't added any crops yet. Start by adding your first crop to track its progress."
              }
            </Text>
            <TouchableOpacity 
              className="bg-green-600 rounded-2xl px-6 py-3 mt-6 flex-row items-center"
              onPress={handleAddCrop}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Add Your First Crop</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Crops List */}
        {crops.map((crop) => (
          <CropCard
            key={crop._id || crop.id}
            crop={crop}
            onPress={() => handleCropPress(crop)}
          />
        ))}

        {/* Info Card for New Users */}
        {crops.length > 0 && (
          <View className="bg-blue-50 rounded-2xl p-4 mt-4 border border-blue-200">
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle" size={20} color="#2563eb" />
              <Text className="text-blue-800 font-semibold ml-2">Crop Management</Text>
            </View>
            <Text className="text-blue-700 text-sm">
              • Tap on any crop to view detailed information{"\n"}
              • Add new crops using the button below{"\n"}
              • Pull down to refresh the list
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      {crops.length > 0 && (
        <View className="absolute bottom-6 right-6">
          <TouchableOpacity
            className="bg-green-600 rounded-full px-6 py-4 flex-row items-center shadow-lg"
            onPress={handleAddCrop}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text className="text-white text-base font-semibold ml-2">
              Add Crop
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}