// // src/screens/CropDetails/CropDetailViewScreen.jsx

// import { useNavigation, useRoute } from "@react-navigation/native";
// import { 
//   View, 
//   Text, 
//   ScrollView, 
//   TouchableOpacity,
//   Image,
//   TextInput,
//   Alert
// } from "react-native";
// import { 
//   Feather, 
//   MaterialCommunityIcons, 
//   Ionicons 
// } from "@expo/vector-icons";
// import { useState } from "react";

// export default function CropDetailViewScreen() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { crop } = route.params; // Get crop data from navigation params

//   // State for edit mode
//   const [isEditMode, setIsEditMode] = useState(false);
  
//   // State for editable crop data
//   const [cropData, setCropData] = useState({
//     cropName: crop.cropName || "",
//     cropType: crop.cropType || "",
//     area: crop.area || "",
//     areaValue: crop.area ? crop.area.split(' ')[0] : "", // Extract numerical value
//     areaUnit: crop.area ? crop.area.split(' ')[1] : "acre", // Extract unit
//     expectedYield: crop.expectedYield || "250",
//     yieldUnit: crop.yieldUnit || "kg",
//     sowingDate: crop.sowingDate || crop.plantedDate || "28-10-2025",
//     expectedHarvestStart: crop.expectedHarvestStart || "26-01-2026",
//     expectedHarvestEnd: crop.expectedHarvestEnd || "25-02-2026",
//     previousCrop: crop.previousCrop || "wheat",
//     latitude: crop.latitude || "18.4453231",
//     longitude: crop.longitude || "73.8229824",
//     status: crop.status || "pending",
//     images: crop.images || []
//   });

//   // Handle back navigation
//   const handleBack = () => {
//     if (isEditMode) {
//       Alert.alert(
//         "Discard Changes?",
//         "You have unsaved changes. Do you want to discard them?",
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Discard", onPress: () => navigation.goBack(), style: "destructive" }
//         ]
//       );
//     } else {
//       navigation.goBack();
//     }
//   };

//   // Toggle edit mode
//   const handleEditToggle = () => {
//     if (isEditMode) {
//       // Save changes - combine area value and unit before saving
//       const updatedCropData = {
//         ...cropData,
//         area: `${cropData.areaValue} ${cropData.areaUnit}`
//       };
      
//       Alert.alert(
//         "Save Changes?",
//         "Do you want to save the changes?",
//         [
//           { text: "Cancel", style: "cancel" },
//           { 
//             text: "Save", 
//             onPress: () => {
//               console.log("Saving crop data:", updatedCropData);
//               setIsEditMode(false);
//               Alert.alert("Success", "Crop details updated successfully!");
//             }
//           }
//         ]
//       );
//     } else {
//       setIsEditMode(true);
//     }
//   };

//   // Update field value
//   const updateField = (field, value) => {
//     setCropData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Render editable or static field
//   const renderField = (label, field, icon, color = "#16a34a") => (
//     <View className="flex-row items-center bg-white rounded-2xl p-4 mb-3 shadow-sm">
//       <View 
//         className="w-12 h-12 rounded-xl items-center justify-center mr-3"
//         style={{ backgroundColor: `${color}15` }}
//       >
//         <Ionicons name={icon} size={22} color={color} />
//       </View>
//       <View className="flex-1">
//         <Text className="text-gray-500 text-xs mb-1">{label}</Text>
//         {isEditMode ? (
//           <TextInput
//             className="text-gray-800 text-base font-medium"
//             value={cropData[field]}
//             onChangeText={(text) => updateField(field, text)}
//             placeholder={`Enter ${label.toLowerCase()}`}
//           />
//         ) : (
//           <Text className="text-gray-800 text-base font-medium">
//             {cropData[field]}
//           </Text>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-green-600 px-4 py-4 pt-4 flex-row items-center justify-between">
//         <TouchableOpacity 
//           onPress={handleBack}
//           className="w-12 h-12 bg-green-700 rounded-2xl items-center justify-center"
//         >
//           <Ionicons name="chevron-back" size={24} color="white" />
//         </TouchableOpacity>
        
//         <Text className="text-white text-xl font-bold">Crop Information</Text>
        
//         <TouchableOpacity 
//           onPress={handleEditToggle}
//           className="w-12 h-12 bg-green-700 rounded-2xl items-center justify-center"
//         >
//           <Feather name={isEditMode ? "check" : "edit-2"} size={20} color="white" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView 
//         className="flex-1" 
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Crop Name Banner */}
//         <View className="mx-4 mt-6">
//           <View className="bg-green-600 rounded-3xl p-6 shadow-sm">
//             <View className="flex-row items-center">
//               <View className="w-20 h-20 bg-green-700 rounded-2xl items-center justify-center mr-4">
//                 <MaterialCommunityIcons name="leaf" size={36} color="white" />
//               </View>
//               <View className="flex-1">
//                 {isEditMode ? (
//                   <>
//                     <TextInput
//                       className="text-white text-2xl font-bold mb-1"
//                       value={cropData.cropName}
//                       onChangeText={(text) => updateField('cropName', text)}
//                       placeholder="Crop Name"
//                       placeholderTextColor="#ffffff80"
//                     />
//                     {cropData.cropType && (
//                       <TextInput
//                         className="text-white text-sm"
//                         value={cropData.cropType}
//                         onChangeText={(text) => updateField('cropType', text)}
//                         placeholder="Crop Type"
//                         placeholderTextColor="#ffffff80"
//                       />
//                     )}
//                   </>
//                 ) : (
//                   <>
//                     <Text className="text-white text-2xl font-bold mb-1">
//                       {cropData.cropName} {cropData.cropType && `(${cropData.cropType})`}
//                     </Text>
//                     <View className="bg-green-700 rounded-full px-3 py-1 self-start">
//                       <Text className="text-white text-xs">{cropData.status}</Text>
//                     </View>
//                   </>
//                 )}
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Stats Cards */}
//         <View className="mx-4 mt-6 flex-row gap-3">
//           {/* Area Card */}
//           <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
//             <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mb-3">
//               <MaterialCommunityIcons name="texture-box" size={24} color="#3b82f6" />
//             </View>
//             <Text className="text-gray-500 text-sm mb-1">Area</Text>
//             {isEditMode ? (
//               <View className="flex-row items-baseline">
//                 <TextInput
//                   className="text-gray-800 text-2xl font-bold flex-1"
//                   value={cropData.areaValue}
//                   onChangeText={(text) => updateField('areaValue', text)}
//                   keyboardType="numeric"
//                   placeholder="Area value"
//                 />
//                 <Text className="text-gray-500 text-lg ml-1">{cropData.areaUnit}</Text>
//               </View>
//             ) : (
//               <Text className="text-gray-800 text-2xl font-bold">
//                 {cropData.areaValue} <Text className="text-sm text-gray-500">{cropData.areaUnit}</Text>
//               </Text>
//             )}
//           </View>

//           {/* Expected Yield Card */}
//           <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
//             <View className="w-12 h-12 bg-orange-50 rounded-xl items-center justify-center mb-3">
//               <MaterialCommunityIcons name="chart-line" size={24} color="#f97316" />
//             </View>
//             <Text className="text-gray-500 text-sm mb-1">Expected Yield</Text>
//             {isEditMode ? (
//               <View className="flex-row items-baseline">
//                 <TextInput
//                   className="text-gray-800 text-2xl font-bold flex-1"
//                   value={cropData.expectedYield}
//                   onChangeText={(text) => updateField('expectedYield', text)}
//                   keyboardType="numeric"
//                   placeholder="Yield value"
//                 />
//                 <Text className="text-gray-500 text-lg ml-1">{cropData.yieldUnit}</Text>
//               </View>
//             ) : (
//               <Text className="text-gray-800 text-2xl font-bold">
//                 {cropData.expectedYield} <Text className="text-sm text-gray-500">{cropData.yieldUnit}</Text>
//               </Text>
//             )}
//           </View>
//         </View>

//         {/* Crop Information Section */}
//         <View className="mx-4 mt-6">
//           <Text className="text-gray-800 text-xl font-bold mb-4">
//             Crop Information
//           </Text>

//           {renderField("Sowing Date", "sowingDate", "calendar-outline", "#16a34a")}
//           {renderField("Expected Harvest Start", "expectedHarvestStart", "calendar", "#f97316")}
//           {renderField("Expected Harvest End", "expectedHarvestEnd", "calendar", "#ef4444")}
//           {renderField("Previous Crop", "previousCrop", "time-outline", "#8b5cf6")}
//         </View>

//         {/* Location Section */}
//         <View className="mx-4 mt-6">
//           <View className="flex-row items-center mb-4">
//             <View className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center mr-2">
//               <Ionicons name="location" size={22} color="#3b82f6" />
//             </View>
//             <Text className="text-gray-800 text-xl font-bold">Location</Text>
//           </View>

//           <View className="bg-white rounded-2xl p-4 shadow-sm">
//             <View className="flex-row gap-3">
//               {/* Latitude */}
//               <View className="flex-1">
//                 <Text className="text-gray-500 text-xs mb-2">Latitude</Text>
//                 {isEditMode ? (
//                   <TextInput
//                     className="text-gray-800 text-base font-medium bg-gray-50 rounded-lg p-3"
//                     value={cropData.latitude}
//                     onChangeText={(text) => updateField('latitude', text)}
//                     keyboardType="numeric"
//                   />
//                 ) : (
//                   <Text className="text-gray-800 text-base font-medium">
//                     {cropData.latitude}
//                   </Text>
//                 )}
//               </View>

//               {/* Longitude */}
//               <View className="flex-1">
//                 <Text className="text-gray-500 text-xs mb-2">Longitude</Text>
//                 {isEditMode ? (
//                   <TextInput
//                     className="text-gray-800 text-base font-medium bg-gray-50 rounded-lg p-3"
//                     value={cropData.longitude}
//                     onChangeText={(text) => updateField('longitude', text)}
//                     keyboardType="numeric"
//                   />
//                 ) : (
//                   <Text className="text-gray-800 text-base font-medium">
//                     {cropData.longitude}
//                   </Text>
//                 )}
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Crop Images Section */}
//         {cropData.images.length > 0 && (
//           <View className="mx-4 mt-6 mb-6">
//             <View className="flex-row items-center justify-between mb-4">
//               <View className="flex-row items-center">
//                 <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-2">
//                   <Ionicons name="images" size={22} color="#16a34a" />
//                 </View>
//                 <Text className="text-gray-800 text-xl font-bold">Crop Images</Text>
//               </View>
//               <Text className="text-gray-500 text-sm">
//                 {cropData.images.length} {cropData.images.length === 1 ? 'photo' : 'photos'}
//               </Text>
//             </View>

//             <ScrollView 
//               horizontal 
//               showsHorizontalScrollIndicator={false}
//               className="flex-row gap-3"
//             >
//               {cropData.images.map((image, index) => (
//                 <Image
//                   key={index}
//                   source={{ uri: image }}
//                   className="w-32 h-32 rounded-2xl"
//                   resizeMode="cover"
//                 />
//               ))}
//             </ScrollView>
//           </View>
//         )}

//         {/* Empty state for no images */}
//         {cropData.images.length === 0 && (
//           <View className="mx-4 mt-6 mb-6">
//             <View className="flex-row items-center mb-4">
//               <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-2">
//                 <Ionicons name="images" size={22} color="#16a34a" />
//               </View>
//               <Text className="text-gray-800 text-xl font-bold">Crop Images</Text>
//             </View>
//             <View className="bg-white rounded-2xl p-6 items-center justify-center shadow-sm">
//               <Ionicons name="image-outline" size={48} color="#9ca3af" />
//               <Text className="text-gray-500 text-sm mt-2">No images available</Text>
//             </View>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }














// src/screens/CropDetails/CropDetailViewScreen.jsx

import { useNavigation, useRoute } from "@react-navigation/native";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { 
  Feather, 
  MaterialCommunityIcons, 
  Ionicons 
} from "@expo/vector-icons";
import { useState,useEffect } from "react";

export default function CropDetailViewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
    const { crop, onCropUpdate } = route.params; // Get callback function

  // State for crop data
  const [cropData, setCropData] = useState({
    id: crop.id || "",
    cropName: crop.cropName || "",
    cropType: crop.cropType || "",
    area: crop.area || "",
    expectedYield: crop.expectedYield || "250 kg",
    sowingDate: crop.sowingDate || crop.plantedDate || "28-10-2025",
    expectedHarvestStart: crop.expectedHarvestStart || "26-01-2026",
    expectedHarvestEnd: crop.expectedHarvestEnd || "25-02-2026",
    previousCrop: crop.previousCrop || "wheat",
    latitude: crop.latitude || "18.4453231",
    longitude: crop.longitude || "73.8229824",
    status: crop.status || "pending",
    images: crop.images || []
  });

   // Update cropData when crop prop changes
  useEffect(() => {
    if (crop) {
      setCropData({
        id: crop.id || "",
        cropName: crop.cropName || "",
        cropType: crop.cropType || "",
        area: crop.area || "",
        expectedYield: crop.expectedYield || "250 kg",
        sowingDate: crop.sowingDate || crop.plantedDate || "28-10-2025",
        expectedHarvestStart: crop.expectedHarvestStart || "26-01-2026",
        expectedHarvestEnd: crop.expectedHarvestEnd || "25-02-2026",
        previousCrop: crop.previousCrop || "wheat",
        latitude: crop.latitude || "18.4453231",
        longitude: crop.longitude || "73.8229824",
        status: crop.status || "pending",
        images: crop.images || []
      });
    }
  }, [crop]);

  // Handle back navigation
  const handleBack = () => {
    navigation.goBack();
  };

  // Handle edit - navigate to CropDetailsScreen with edit mode and callback
  const handleEdit = () => {
    navigation.navigate('Crop Details', { 
      crop: cropData,
      editMode: true,
      onCropUpdate: (updatedCrop) => {
        // Update local state
        setCropData(updatedCrop);
        // Pass update back to MyCropsScreen
        if (onCropUpdate) {
          onCropUpdate(updatedCrop);
        }
      }
    });
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
          {value}
        </Text>
      </View>
    </View>
  );

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
                  {cropData.cropName} {cropData.cropType && `(${cropData.cropType})`}
                </Text>
                <View className="bg-green-700 rounded-full px-3 py-1 self-start">
                  <Text className="text-white text-xs">{cropData.status}</Text>
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
            <Text className="text-gray-800 text-2xl font-bold">
              {cropData.area}
            </Text>
          </View>

          {/* Expected Yield Card */}
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
            <View className="w-12 h-12 bg-orange-50 rounded-xl items-center justify-center mb-3">
              <MaterialCommunityIcons name="chart-line" size={24} color="#f97316" />
            </View>
            <Text className="text-gray-500 text-sm mb-1">Expected Yield</Text>
            <Text className="text-gray-800 text-2xl font-bold">
              {cropData.expectedYield}
            </Text>
          </View>
        </View>

        {/* Crop Information Section */}
        <View className="mx-4 mt-6">
          <Text className="text-gray-800 text-xl font-bold mb-4">
            Crop Information
          </Text>

          {renderField("Sowing Date", cropData.sowingDate, "calendar-outline", "#16a34a")}
          {renderField("Expected Harvest Start", cropData.expectedHarvestStart, "calendar", "#f97316")}
          {renderField("Expected Harvest End", cropData.expectedHarvestEnd, "calendar", "#ef4444")}
          {renderField("Previous Crop", cropData.previousCrop, "time-outline", "#8b5cf6")}
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

        {/* Crop Images Section */}
        {cropData.images.length > 0 && (
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
                <Image
                  key={index}
                  source={{ uri: image }}
                  className="w-32 h-32 rounded-2xl"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Empty state for no images */}
        {cropData.images.length === 0 && (
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