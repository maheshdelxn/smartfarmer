// src/screens/Home/HomeScreen.jsx
import { useNavigation } from "@react-navigation/native";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function HomeScreen() {
  const [isListView, setIsListView] = useState(false);

  const cropsData = [
    {
      id: 1,
      name: "Jowar (Sorghum)",
      area: "25.0 acres",
      planted: "2025-10-28",
      status: "Healthy",
      statusColor: "blue"
    },
    {
      id: 2,
      name: "Rice",
      area: "18.5 acres",
      planted: "2025-10-15",
      status: "Healthy",
      statusColor: "blue"
    }
  ];

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
          <Text className="text-gray-800 text-lg font-semibold">{crop.name}</Text>
          <Text className="text-gray-500 text-sm">Area: {crop.area}</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#9ca3af" />
      </View>

      <View className="bg-gray-50 rounded-2xl p-4 mb-3">
        <View className="flex-row items-center">
          <Feather name="calendar" size={16} color="#6b7280" />
          <Text className="text-gray-600 ml-2">Planted: {crop.planted}</Text>
        </View>
      </View>

      <View className="bg-blue-50 rounded-2xl p-4">
        <Text className="text-blue-600 text-center font-medium">{crop.status}</Text>
      </View>
    </TouchableOpacity>
  );
  const navigation = useNavigation();
  const handleAddCrop = () => {
    return navigation.navigate("Crop Details")
  }
  return (
    <ScrollView className="flex-1 bg-green-50">
      {/* Greeting Card */}
      <View className="mx-4 mt-6 mb-4 bg-white rounded-3xl p-6 shadow-sm">
        <Text className="text-gray-500 text-base mb-2">Good Morning!</Text>
        <View className="flex-row items-center">
          <View className="w-14 h-14 bg-green-600 rounded-2xl items-center justify-center mr-4">
            <MaterialCommunityIcons name="hand-wave" size={28} color="white" />
          </View>
          <View>
            <Text className="text-green-700 text-2xl font-semibold">mahesj</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location" size={16} color="#22c55e" />
              <Text className="text-green-600 ml-1">pune, Pune</Text>
            </View>
          </View>
        </View>
      </View>

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
          <TouchableOpacity className="w-[48%] bg-white rounded-2xl p-6 mb-4 items-center shadow-sm" onPress={handleAddCrop} >
            <View className="w-16 h-16 bg-green-600 rounded-2xl items-center justify-center mb-3">
              <Feather name="plus-circle" size={32} color="white"  />
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

        {/* Horizontal Scroll View or Vertical List */}
        {isListView ? (
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
        )}
      </View>
    </ScrollView>
  );
}

