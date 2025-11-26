// src/screens/Home/HomeScreen.jsx
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.1.17:1000/api";

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

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [isListView, setIsListView] = useState(false);
  const [cropsData, setCropsData] = useState([]);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  // Get user data and token from navigation params
  const userFromParams = route.params?.user || {};
  const tokenFromParams = route.params?.token || '';

  // Debug: Log the received params
  useEffect(() => {
    console.log('🏠 HomeScreen - Received params:', {
      hasUser: !!userFromParams.name,
      userName: userFromParams.name,
      userContact: userFromParams.contact,
      tokenLength: tokenFromParams?.length || 0,
      fullUserData: userFromParams
    });
  }, [userFromParams, tokenFromParams]);

  // Initialize user data and store token
  useEffect(() => {
    const initializeUserData = async () => {
      try {
        // Store the token if provided
        if (tokenFromParams) {
          await AsyncStorage.setItem('authToken', tokenFromParams);
          console.log('✅ Token stored successfully');
        }

        // Set user data from navigation params
        if (userFromParams && Object.keys(userFromParams).length > 0) {
          console.log('✅ Using user data from login params:', userFromParams.name);
          setUserData({
            name: userFromParams.name || 'Farmer',
            contact: userFromParams.contact || '',
            village: userFromParams.village || '',
            taluka: userFromParams.taluka || '',
            district: userFromParams.district || '',
            state: userFromParams.state || '',
            location: userFromParams.village && userFromParams.district 
              ? `${userFromParams.village}, ${userFromParams.district}`
              : 'Your Farm',
            ...userFromParams
          });
          
          // Also store in AsyncStorage for persistence
          await AsyncStorage.setItem('userData', JSON.stringify(userFromParams));
        } else {
          // Try to get user data from AsyncStorage as fallback
          const storedUser = await AsyncStorage.getItem('userData');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            console.log('✅ Using user data from AsyncStorage:', parsedUser.name);
            setUserData(parsedUser);
          } else {
            console.log('❌ No user data found, using fallback');
            setUserData({
              name: 'Farmer',
              location: 'Your Farm',
              contact: ''
            });
          }
        }
      } catch (error) {
        console.error('❌ Error initializing user data:', error);
        setUserData({
          name: 'Farmer',
          location: 'Your Farm',
          contact: ''
        });
      }
    };

    initializeUserData();
  }, [userFromParams, tokenFromParams]);

  // Fetch recent crops for the logged-in user
  const fetchRecentCrops = async () => {
    try {
      console.log('🌱 Fetching crops...');
      const token = await AsyncStorage.getItem('authToken') || tokenFromParams;
      
      const response = await fetch(`${API_BASE_URL}/crop/recent`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Crops data received:', data);
        
        // Safely process crops data - FIXED: Handle area objects properly
        const safeCrops = (data.crops || data || []).map(crop => ({
          id: crop.id || crop._id || Math.random().toString(),
          cropName: crop.cropName || crop.name || 'Unknown Crop',
          areaPlanted: safeString(crop.areaPlanted || crop.area), // Use safeString for area objects
          plantingDate: crop.plantingDate || crop.planted || crop.sowingDate || 'N/A',
          status: crop.status || crop.applicationStatus || 'Healthy'
        }));
        
        setCropsData(safeCrops);
        setNetworkError(false);
      } else {
        console.log('❌ Failed to fetch crops, status:', response.status);
        // Use mock data based on user's location
        setCropsData(getMockCropsData());
      }
    } catch (error) {
      console.error('❌ Error fetching crops:', error.message);
      setNetworkError(true);
      // Use mock data based on user's location
      setCropsData(getMockCropsData());
    } finally {
      setLoading(false);
    }
  };

  // Get mock crops data based on user's location
  const getMockCropsData = () => {
    const userDistrict = userData.district?.toLowerCase() || '';
    const userState = userData.state?.toLowerCase() || '';
    
    // Provide location-specific mock data
    if (userDistrict.includes('nashik') || userState.includes('maharashtra')) {
      return [
        {
          id: 1,
          cropName: "Grapes",
          areaPlanted: "12.5 acres",
          plantingDate: "2025-09-15",
          status: "Flowering"
        },
        {
          id: 2,
          cropName: "Onion",
          areaPlanted: "8.0 acres",
          plantingDate: "2025-08-20",
          status: "Growing"
        }
      ];
    }
    
    // Default mock data
    return [
      {
        id: 1,
        cropName: "Jowar (Sorghum)",
        areaPlanted: "25.0 acres",
        plantingDate: "2025-10-28",
        status: "Healthy"
      },
      {
        id: 2,
        cropName: "Rice",
        areaPlanted: "18.5 acres",
        plantingDate: "2025-10-15", 
        status: "Healthy"
      }
    ];
  };

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await fetchRecentCrops();
    } catch (error) {
      console.error('Error in fetchAllData:', error);
    }
  };

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  }, []);

  // Initial data load
  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddCrop = () => {
    navigation.navigate("Crop Details", { 
      user: userData,
      token: tokenFromParams
    });
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning!";
    if (hour < 17) return "Good Afternoon!";
    return "Good Evening!";
  };

  const renderCropCard = (crop) => (
    <TouchableOpacity 
      key={crop.id}
      className={`bg-white rounded-3xl p-5 shadow-sm ${
        isListView ? 'mb-4' : 'w-80 mr-4'
      }`}
    >
      <View className="flex-row items-center mb-4">
        <View className="w-14 h-14 bg-green-600 rounded-2xl items-center justify-center mr-4">
          <MaterialCommunityIcons name="leaf" size={28} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-800 text-lg font-semibold">
            {crop.cropName}
          </Text>
          <Text className="text-gray-500 text-sm">
            Area: {crop.areaPlanted}
          </Text>
        </View>
        <Feather name="chevron-right" size={24} color="#9ca3af" />
      </View>

      <View className="bg-gray-50 rounded-2xl p-4 mb-3">
        <View className="flex-row items-center">
          <Feather name="calendar" size={16} color="#6b7280" />
          <Text className="text-gray-600 ml-2">
            Planted: {crop.plantingDate}
          </Text>
        </View>
      </View>

      <View className="bg-blue-50 rounded-2xl p-4">
        <Text className="text-blue-600 text-center font-medium">
          {crop.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Get user display name
  const getUserDisplayName = () => {
    return userData.name || 'Farmer';
  };

  // Get user location display
  const getUserLocation = () => {
    if (userData.village && userData.district) {
      return `${userData.village}, ${userData.district}`;
    }
    return userData.location || 'Your Farm';
  };

  return (
    <ScrollView 
      className="flex-1 bg-green-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
     
      {/* Debug Banner - Shows what data is available */}
      <View className="mx-4 mt-4 bg-blue-500 rounded-xl p-3">
        <Text className="text-white text-center font-medium">
          {userData.name ? `👋 Welcome, ${userData.name}!` : '🔍 Debug: Loading user...'}
        </Text>
        <Text className="text-white text-xs text-center mt-1">
          {userData.contact ? `📱 ${userData.contact}` : 'No contact info'} | {getUserLocation()}
        </Text>
      </View>

      {/* Network Status Banner */}
      {networkError && (
        <View className="mx-4 mt-4 bg-yellow-500 rounded-xl p-3">
          <Text className="text-white text-center font-medium">
            📡 Connection Issue - Using Local Data
          </Text>
        </View>
      )}

      {/* Greeting Card */}
      <View className="mx-4 mt-6 mb-4 bg-white rounded-3xl p-6 shadow-sm">
        <Text className="text-gray-500 text-base mb-2">{getGreeting()}</Text>
        <View className="flex-row items-center">
          <View className="w-14 h-14 bg-green-600 rounded-2xl items-center justify-center mr-4">
            <MaterialCommunityIcons name="hand-wave" size={28} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-green-700 text-2xl font-semibold">
              {getUserDisplayName()}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location" size={16} color="#22c55e" />
              <Text className="text-green-600 ml-1">
                {getUserLocation()}
              </Text>
            </View>
            {userData.contact && (
              <Text className="text-gray-500 text-sm mt-1">
                📱 {userData.contact}
              </Text>
            )}
            {userData.village && userData.district && (
              <Text className="text-gray-400 text-xs mt-1">
                {userData.village}, {userData.taluka}, {userData.district}, {userData.state}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Rest of your HomeScreen UI remains the same */}
      {/* Quick Actions */}
      <View className="mx-4 mb-4">
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-2">
            <Ionicons name="flash" size={20} color="#16a34a" />
          </View>
          <Text className="text-green-800 text-xl font-semibold">Quick Actions</Text>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {/* Add Crop */}
          <TouchableOpacity 
            className="w-[48%] bg-white rounded-2xl p-6 mb-4 items-center shadow-sm" 
            onPress={handleAddCrop}
          >
            <View className="w-16 h-16 bg-green-600 rounded-2xl items-center justify-center mb-3">
              <Feather name="plus-circle" size={32} color="white" />
            </View>
            <Text className="text-gray-700 text-base font-medium">Add Crop</Text>
          </TouchableOpacity>

          {/* Search Crops */}
          <TouchableOpacity className="w-[48%] bg-white rounded-2xl p-6 mb-4 items-center shadow-sm">
            <View className="w-16 h-16 bg-blue-500 rounded-2xl items-center justify-center mb-3">
              <Feather name="search" size={32} color="white" />
            </View>
            <Text className="text-gray-700 text-base font-medium">Search Crops</Text>
          </TouchableOpacity>

          {/* Filter by Location */}
          <TouchableOpacity className="w-[48%] bg-white rounded-2xl p-6 mb-4 items-center shadow-sm">
            <View className="w-16 h-16 bg-orange-500 rounded-2xl items-center justify-center mb-3">
              <Ionicons name="location" size={32} color="white" />
            </View>
            <Text className="text-gray-700 text-base font-medium">Filter by location</Text>
          </TouchableOpacity>

          {/* View Reports */}
          <TouchableOpacity className="w-[48%] bg-white rounded-2xl p-6 mb-4 items-center shadow-sm">
            <View className="w-16 h-16 bg-purple-600 rounded-2xl items-center justify-center mb-3">
              <MaterialCommunityIcons name="chart-bar" size={32} color="white" />
            </View>
            <Text className="text-gray-700 text-base font-medium">View Reports</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Today's Weather */}
      <View className="mx-4 mb-4 bg-blue-500 rounded-3xl p-6 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-lg mb-2">Today's Weather</Text>
            <Text className="text-white text-5xl font-bold mb-1">28°C</Text>
            <Text className="text-white/90 text-base">Perfect for farming</Text>
          </View>
          <View className="w-20 h-20 bg-white/20 rounded-3xl items-center justify-center">
            <Feather name="sun" size={40} color="white" />
          </View>
        </View>
      </View>

      {/* AI Insights */}
      <View className="mx-4 mb-4">
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-2">
            <MaterialCommunityIcons name="brain" size={20} color="#16a34a" />
          </View>
          <Text className="text-green-800 text-xl font-semibold">AI Insights</Text>
        </View>

        <View className="bg-purple-600 rounded-3xl p-6 shadow-sm">
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center mr-3">
              <MaterialCommunityIcons name="lightbulb-on" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-semibold">AI Recommendation</Text>
              <Text className="text-white/80 text-sm">Powered by Machine Learning</Text>
            </View>
          </View>
          <Text className="text-white text-base leading-6">
            Based on weather patterns and soil conditions, consider planting drought-resistant crops this season. Expected yield increase: 15%
          </Text>
        </View>
      </View>

      {/* Recent Crops */}
      <View className="mx-4 mb-6">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-2">
              <MaterialCommunityIcons name="sprout" size={20} color="#16a34a" />
            </View>
            <Text className="text-green-800 text-xl font-semibold">Recent Crops</Text>
          </View>
          
          {/* Toggle View Button */}
          <TouchableOpacity 
            onPress={() => setIsListView(!isListView)}
            className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center"
          >
            <Ionicons 
              name={isListView ? "grid" : "list"} 
              size={20} 
              color="#16a34a" 
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="py-8 items-center">
            <Text className="text-gray-500">Loading crops...</Text>
          </View>
        ) : cropsData.length === 0 ? (
          <View className="py-8 items-center">
            <Text className="text-gray-500">No crops found. Add your first crop!</Text>
          </View>
        ) : (
          isListView ? (
            <View>
              {cropsData.map(renderCropCard)}
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {cropsData.map(renderCropCard)}
            </ScrollView>
          )
        )}
      </View>
    </ScrollView>
  );
}