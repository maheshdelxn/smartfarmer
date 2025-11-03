// // src/screens/MyCrops/MyCropsScreen.jsx

// import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
// import { useNavigation } from "@react-navigation/native";
// import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

// // Crop Card Component
// const CropCard = ({ cropName, cropType, area, plantedDate, status, imageSource, onPress }) => (
//   <TouchableOpacity 
//     className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
//     onPress={onPress}
//     activeOpacity={0.7}
//   >
//     <View className="flex-row items-center">
//       {/* Crop Image */}
//       <View className="w-16 h-16 bg-gray-200 rounded-xl mr-4 overflow-hidden">
//         {imageSource ? (
//           <Image 
//             source={imageSource} 
//             className="w-full h-full"
//             resizeMode="cover"
//           />
//         ) : (
//           <View className="w-full h-full bg-gray-300 items-center justify-center">
//             <MaterialCommunityIcons name="sprout" size={32} color="#9ca3af" />
//           </View>
//         )}
//       </View>

//       {/* Crop Details */}
//       <View className="flex-1">
//         {/* Crop Name and Area */}
//         <View className="flex-row items-center justify-between mb-2">
//           <Text className="text-lg font-semibold text-gray-800">
//             {cropName} {cropType && <Text className="text-gray-500">({cropType})</Text>}
//           </Text>
//           <Text className="text-sm text-gray-500 ml-2">Area: {area}</Text>
//         </View>

//         {/* Planted Date */}
//         <View className="flex-row items-center mb-3">
//           <Ionicons 
//             name="calendar-outline" 
//             size={16} 
//             color="#6b7280" 
//             style={{ marginRight: 6 }}
//           />
//           <Text className="text-sm text-gray-600">Planted: {plantedDate}</Text>
//         </View>

//         {/* Status and Arrow */}
//         <View className="flex-row items-center">
//           <View className="flex-1 bg-blue-50 rounded-lg py-2 px-4">
//             <Text className="text-blue-600 font-medium text-center">{status}</Text>
//           </View>
//           <View className="ml-2">
//             <Ionicons name="chevron-forward" size={20} color="#16a34a" />
//           </View>
//         </View>
//       </View>
//     </View>
//   </TouchableOpacity>
// );

// // Main Screen Component
// export default function MyCropsScreen() {
//   const crops = [
//     {
//       id: 1,
//       cropName: 'Jowar',
//       cropType: 'Sorghum',
//       area: '25 acre',
//       plantedDate: '28-10-2025',
//       status: 'Healthy',
//       imageSource: null,
//     },
//     {
//       id: 2,
//       cropName: 'Rice',
//       cropType: null,
//       area: '47 guntha',
//       plantedDate: '28-10-2025',
//       status: 'Healthy',
//       imageSource: null,
//     },
//   ];
//   const navigation = useNavigation();

//   const handleCropPress = (crop) => {
//     console.log('Crop pressed:', crop.cropName);
//     navigation.navigate("Crop Information",{crop :crop})
//   };

//   const handleAddCrop = () => {
//     console.log('Add Crop pressed');
//     navigation.navigate("Crop Details")
//   };

//   const handleRefresh = () => {
//     console.log('Refresh pressed');
//   };

//   return (
//     <View className="flex-1 bg-green-50">
      
//       <ScrollView 
//         className="flex-1 px-4 pt-4"
//         showsVerticalScrollIndicator={false}
//       >
//         {crops.map((crop) => (
//           <CropCard
//             key={crop.id}
//             cropName={crop.cropName}
//             cropType={crop.cropType}
//             area={crop.area}
//             plantedDate={crop.plantedDate}
//             status={crop.status}
//             imageSource={crop.imageSource}
//             onPress={() => handleCropPress(crop)}
//           />
//         ))}
//       </ScrollView>

//       {/* Floating Add Button */}
//       <View className="absolute bottom-6 right-6">
//         <TouchableOpacity
//           className="bg-green-600 rounded-full px-6 py-4 flex-row items-center shadow-lg"
//           onPress={handleAddCrop}
//           activeOpacity={0.8}
//         >
//           <Ionicons name="add" size={24} color="white" />
//           <Text className="text-white text-base font-semibold ml-2">
//             Add Crop
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// src/screens/MyCrops/MyCropsScreen.jsx
// src/screens/MyCrops/MyCropsScreen.jsx

import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from 'react';

// Crop Card Component
const CropCard = ({ cropName, cropType, area, plantedDate, status, imageSource, onPress }) => (
  <TouchableOpacity 
    className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View className="flex-row items-center">
      {/* Crop Image */}
      <View className="w-16 h-16 bg-gray-200 rounded-xl mr-4 overflow-hidden">
        {imageSource ? (
          <Image 
            source={imageSource} 
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-gray-300 items-center justify-center">
            <MaterialCommunityIcons name="sprout" size={32} color="#9ca3af" />
          </View>
        )}
      </View>

      {/* Crop Details */}
      <View className="flex-1">
        {/* Crop Name and Area */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-semibold text-gray-800">
            {cropName} {cropType && <Text className="text-gray-500">({cropType})</Text>}
          </Text>
          <Text className="text-sm text-gray-500 ml-2">Area: {area}</Text>
        </View>

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
          <View className="flex-1 bg-blue-50 rounded-lg py-2 px-4">
            <Text className="text-blue-600 font-medium text-center">{status}</Text>
          </View>
          <View className="ml-2">
            <Ionicons name="chevron-forward" size={20} color="#16a34a" />
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

// Main Screen Component
export default function MyCropsScreen() {
  const [crops, setCrops] = useState([
    {
      id: 1,
      cropName: 'Jowar',
      cropType: 'Sorghum',
      area: '25 acre',
      plantedDate: '28-10-2025',
      status: 'Healthy',
      imageSource: null,
    },
    {
      id: 2,
      cropName: 'Rice',
      cropType: null,
      area: '47 guntha',
      plantedDate: '28-10-2025',
      status: 'Healthy',
      imageSource: null,
    },
  ]);

  const navigation = useNavigation();

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // This will run every time the screen comes into focus
      console.log('MyCropsScreen focused - refreshing data');
      // You can add API call here to fetch updated data
    }, [])
  );

  const handleCropPress = (crop) => {
    console.log('Crop pressed:', crop.cropName);
    navigation.navigate("Crop Information", { 
      crop: crop,
      // Pass callback function to update crops when returning from edit
      onCropUpdate: (updatedCrop) => {
        updateCrop(updatedCrop);
      }
    });
  };

  const handleAddCrop = () => {
    console.log('Add Crop pressed');
    navigation.navigate("Crop Details", {
      // Pass callback function to add new crop when returning from creation
      onCropAdd: (newCrop) => {
        addNewCrop(newCrop);
      }
    });
  };

  // Function to update existing crop
  const updateCrop = (updatedCrop) => {
    setCrops(prevCrops => 
      prevCrops.map(crop => 
        crop.id === updatedCrop.id ? updatedCrop : crop
      )
    );
    console.log('Crop updated:', updatedCrop);
  };

  // Function to add new crop
  const addNewCrop = (newCrop) => {
    const cropWithId = {
      ...newCrop,
      id: Date.now(), // Generate unique ID
      status: 'Healthy' // Default status
    };
    setCrops(prevCrops => [...prevCrops, cropWithId]);
    console.log('New crop added:', cropWithId);
  };

  return (
    <View className="flex-1 bg-green-50">
      
      <ScrollView 
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {crops.map((crop) => (
          <CropCard
            key={crop.id}
            cropName={crop.cropName}
            cropType={crop.cropType}
            area={crop.area}
            plantedDate={crop.plantedDate}
            status={crop.status}
            imageSource={crop.imageSource}
            onPress={() => handleCropPress(crop)}
          />
        ))}
      </ScrollView>

      {/* Floating Add Button */}
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
    </View>
  );
}








