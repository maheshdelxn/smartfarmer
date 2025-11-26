// src/screens/CropDetails/CropDetailViewScreen.jsx

import { useNavigation, useRoute } from "@react-navigation/native";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import { 
  Feather, 
  MaterialCommunityIcons, 
  Ionicons 
} from "@expo/vector-icons";
import { useState, useEffect } from "react";
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

export default function CropDetailViewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { crop, user, token } = route.params || {};

  const [cropData, setCropData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch crop details from backend
  const fetchCropDetails = async () => {
    try {
      setLoading(true);
      console.log('🌱 Fetching crop details...');
      
      const cropId = crop._id || crop.id;
      if (!cropId) {
        console.log('❌ No crop ID found');
        setCropData(processCropData(crop));
        return;
      }

      // Use ApiService for consistent API calls
      try {
        const response = await ApiService.get(`/crop/${cropId}`);
        console.log('✅ Crop details received:', response);
        setCropData(processCropData(response.crop || response.data || response));
      } catch (apiError) {
        console.error('❌ ApiService error, trying direct fetch:', apiError);
        // Fallback to direct fetch
        await fetchCropDetailsDirect(cropId);
      }
    } catch (error) {
      console.error('❌ Error fetching crop details:', error);
      setCropData(processCropData(crop));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Direct fetch fallback
  const fetchCropDetailsDirect = async (cropId) => {
    try {
      const authToken = token || await AuthService.getAuthToken();
      const API_BASE_URL = "http://192.168.1.17:1000/api";
      
      const response = await fetch(`${API_BASE_URL}/crop/${cropId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Direct fetch crop details received:', data);
        setCropData(processCropData(data.crop || data.data || data));
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Direct fetch failed:', error);
      throw error;
    }
  };

  // Process crop data for display
  const processCropData = (rawCrop) => {
    if (!rawCrop) return null;

    return {
      id: rawCrop._id || rawCrop.id,
      cropName: safeString(rawCrop.cropName || rawCrop.name),
      cropType: safeString(rawCrop.cropType),
      area: safeString(rawCrop.areaPlanted || rawCrop.area),
      expectedYield: safeString(rawCrop.expectedYield),
      sowingDate: safeString(rawCrop.sowingDate || rawCrop.plantingDate || rawCrop.plantedDate),
      expectedHarvestStart: safeString(rawCrop.expectedFirstHarvestDate || rawCrop.expectedHarvestStart),
      expectedHarvestEnd: safeString(rawCrop.expectedLastHarvestDate || rawCrop.expectedHarvestEnd),
      previousCrop: safeString(rawCrop.previousCrop),
      latitude: safeString(rawCrop.latitude),
      longitude: safeString(rawCrop.longitude),
      status: safeString(rawCrop.status || rawCrop.applicationStatus),
      images: Array.isArray(rawCrop.images) ? rawCrop.images : [],
      address: safeString(rawCrop.address),
      farmerId: rawCrop.farmerId,
      verifierId: rawCrop.verifierId,
      createdAt: rawCrop.createdAt,
      updatedAt: rawCrop.updatedAt,
      // Include raw crop data for editing
      rawCrop: rawCrop
    };
  };

  // Load crop data on mount
  useEffect(() => {
    fetchCropDetails();
  }, [crop]);

  // Handle back navigation
  const handleBack = () => {
    navigation.goBack();
  };

  // Handle edit - navigate to CropDetailsScreen with edit mode
  const handleEdit = () => {
    if (!cropData) return;
    
    // Use navigation events to handle updates instead of callbacks
    navigation.navigate('Crop Details', { 
      crop: cropData.rawCrop || cropData, // Pass the original crop data
      editMode: true,
      user: user,
      token: token
    });
  };

  // Listen for navigation state changes to refresh data
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Refresh data when screen comes into focus (e.g., after editing)
      fetchCropDetails();
    });

    return unsubscribe;
  }, [navigation]);

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCropDetails();
  };

  // Render field component
  const renderField = (label, value, icon, color = "#16a34a") => (
    <View className="flex-row items-center bg-white rounded-2xl p-4 mb-3 shadow-sm">
      <View 
        className="w-12 h-12 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: `${color}15` }}
      >
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-gray-500 text-xs mb-1">{label}</Text>
        <Text className="text-gray-800 text-base font-medium">
          {value || 'Not specified'}
        </Text>
      </View>
    </View>
  );

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Get status background color
  const getStatusBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified': return '#10b98120';
      case 'pending': return '#f59e0b20';
      case 'rejected': return '#ef444420';
      default: return '#6b728020';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-GB');
    } catch (error) {
      return dateString;
    }
  };

  // Render loading state
  if (loading) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="bg-green-600 px-4 py-4 pt-4 flex-row items-center">
          <TouchableOpacity 
            onPress={handleBack}
            className="w-12 h-12 bg-green-700 rounded-2xl items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold ml-4">Crop Information</Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-gray-600 mt-4">Loading crop details...</Text>
        </View>
      </View>
    );
  }

  // Render error state
  if (!cropData) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="bg-green-600 px-4 py-4 pt-4 flex-row items-center">
          <TouchableOpacity 
            onPress={handleBack}
            className="w-12 h-12 bg-green-700 rounded-2xl items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold ml-4">Crop Information</Text>
        </View>
        <View className="flex-1 justify-center items-center px-8">
          <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#9ca3af" />
          <Text className="text-xl font-semibold text-gray-800 mt-4 text-center">
            Crop Not Found
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Sorry, we couldn't load the crop details. Please try again.
          </Text>
          <TouchableOpacity 
            className="bg-green-600 rounded-2xl px-6 py-3 mt-6"
            onPress={fetchCropDetails}
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-green-600 px-4 py-4 pt-4 flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={handleBack}
          className="w-12 h-12 bg-green-700 rounded-2xl items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text className="text-white text-xl font-bold">Crop Information</Text>
        
        <TouchableOpacity 
          onPress={handleEdit}
          className="w-12 h-12 bg-green-700 rounded-2xl items-center justify-center"
        >
          <Feather name="edit-2" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#16a34a']}
          />
        }
      >
        {/* Crop Name Banner */}
        <View className="mx-4 mt-6">
          <View className="bg-green-600 rounded-3xl p-6 shadow-sm">
            <View className="flex-row items-center">
              <View className="w-20 h-20 bg-green-700 rounded-2xl items-center justify-center mr-4">
                <MaterialCommunityIcons name="leaf" size={36} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold mb-1">
                  {cropData.cropName} 
                  {cropData.cropType && cropData.cropType !== 'N/A' && (
                    <Text className="text-white/80"> ({cropData.cropType})</Text>
                  )}
                </Text>
                <View 
                  className="rounded-full px-3 py-1 self-start"
                  style={{ 
                    backgroundColor: getStatusBgColor(cropData.status),
                    borderColor: getStatusColor(cropData.status),
                    borderWidth: 1
                  }}
                >
                  <Text 
                    className="text-xs font-medium"
                    style={{ color: getStatusColor(cropData.status) }}
                  >
                    {cropData.status?.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="mx-4 mt-6 flex-row gap-3">
          {/* Area Card */}
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
            <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mb-3">
              <MaterialCommunityIcons name="texture-box" size={24} color="#3b82f6" />
            </View>
            <Text className="text-gray-500 text-sm mb-1">Area</Text>
            <Text className="text-gray-800 text-lg font-bold">
              {cropData.area}
            </Text>
          </View>

          {/* Expected Yield Card */}
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
            <View className="w-12 h-12 bg-orange-50 rounded-xl items-center justify-center mb-3">
              <MaterialCommunityIcons name="chart-line" size={24} color="#f97316" />
            </View>
            <Text className="text-gray-500 text-sm mb-1">Expected Yield</Text>
            <Text className="text-gray-800 text-lg font-bold">
              {cropData.expectedYield}
            </Text>
          </View>
        </View>

        {/* Crop Information Section */}
        <View className="mx-4 mt-6">
          <Text className="text-gray-800 text-xl font-bold mb-4">
            Crop Information
          </Text>

          {renderField("Sowing Date", formatDate(cropData.sowingDate), "calendar-outline", "#16a34a")}
          {renderField("Expected Harvest Start", formatDate(cropData.expectedHarvestStart), "calendar", "#f97316")}
          {renderField("Expected Harvest End", formatDate(cropData.expectedHarvestEnd), "calendar", "#ef4444")}
          {renderField("Previous Crop", cropData.previousCrop, "time-outline", "#8b5cf6")}
          
          {/* Additional fields if available */}
          {cropData.address && cropData.address !== 'N/A' && 
            renderField("Address", cropData.address, "location", "#3b82f6")
          }
        </View>

        {/* Location Section */}
        <View className="mx-4 mt-6">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center mr-2">
              <Ionicons name="location" size={22} color="#3b82f6" />
            </View>
            <Text className="text-gray-800 text-xl font-bold">Location</Text>
          </View>

          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row gap-3">
              {/* Latitude */}
              <View className="flex-1">
                <Text className="text-gray-500 text-xs mb-2">Latitude</Text>
                <Text className="text-gray-800 text-base font-medium">
                  {cropData.latitude}
                </Text>
              </View>

              {/* Longitude */}
              <View className="flex-1">
                <Text className="text-gray-500 text-xs mb-2">Longitude</Text>
                <Text className="text-gray-800 text-base font-medium">
                  {cropData.longitude}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Additional Info Section */}
        {(cropData.createdAt || cropData.updatedAt) && (
          <View className="mx-4 mt-6">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center mr-2">
                <Ionicons name="information-circle" size={22} color="#6b7280" />
              </View>
              <Text className="text-gray-800 text-xl font-bold">Additional Information</Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm">
              {cropData.createdAt && (
                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-gray-500 text-sm">Created</Text>
                  <Text className="text-gray-800 text-sm">
                    {formatDate(cropData.createdAt)}
                  </Text>
                </View>
              )}
              {cropData.updatedAt && (
                <View className="flex-row justify-between items-center py-2 border-t border-gray-100">
                  <Text className="text-gray-500 text-sm">Last Updated</Text>
                  <Text className="text-gray-800 text-sm">
                    {formatDate(cropData.updatedAt)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Crop Images Section */}
        {cropData.images.length > 0 ? (
          <View className="mx-4 mt-6 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-2">
                  <Ionicons name="images" size={22} color="#16a34a" />
                </View>
                <Text className="text-gray-800 text-xl font-bold">Crop Images</Text>
              </View>
              <Text className="text-gray-500 text-sm">
                {cropData.images.length} {cropData.images.length === 1 ? 'photo' : 'photos'}
              </Text>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="flex-row gap-3"
            >
              {cropData.images.map((image, index) => (
                <View key={index} className="relative">
                  <Image
                    source={{ uri: image }}
                    className="w-32 h-32 rounded-2xl"
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View className="mx-4 mt-6 mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-2">
                <Ionicons name="images" size={22} color="#16a34a" />
              </View>
              <Text className="text-gray-800 text-xl font-bold">Crop Images</Text>
            </View>
            <View className="bg-white rounded-2xl p-6 items-center justify-center shadow-sm">
              <Ionicons name="image-outline" size={48} color="#9ca3af" />
              <Text className="text-gray-500 text-sm mt-2">No images available</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}