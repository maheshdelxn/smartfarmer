// src/screens/CropDetails/CropDetailsScreen.jsx
import { useNavigation, useRoute } from "@react-navigation/native";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Image,
  Modal,
  Platform,
  ActivityIndicator
} from "react-native";
import { 
  Feather, 
  MaterialCommunityIcons, 
  Ionicons, 
  FontAwesome5 
} from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import ApiService from '../../services/ApiService';
import AuthService from '../../services/AuthService';

// =============================================================================
// CLOUDINARY CONFIGURATION - UPDATE THESE WITH YOUR CREDENTIALS
// =============================================================================
import { CLOUDINARY_CONFIG, API_CONFIG } from '../../config/env';
// =============================================================================

export default function CropDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get user data and token from navigation params
  const { crop, editMode, user, token } = route.params || {};
  
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to parse date strings from DD-MM-YYYY to Date object
  const parseDate = (dateString) => {
    if (!dateString) return new Date();
    try {
      // Handle both DD-MM-YYYY and DD/MM/YYYY formats
      const separator = dateString.includes('-') ? '-' : '/';
      const [day, month, year] = dateString.split(separator).map(Number);
      return new Date(year, month - 1, day);
    } catch (error) {
      console.error('Error parsing date:', error);
      return new Date();
    }
  };

  // Helper function to extract numeric value from "250 kg" format
  const extractValue = (valueWithUnit) => {
    if (!valueWithUnit) return "";
    if (typeof valueWithUnit === 'object') {
      return valueWithUnit.value ? valueWithUnit.value.toString() : "";
    }
    return valueWithUnit.split(' ')[0] || "";
  };

  // Helper function to extract unit from "250 kg" format
  const extractUnit = (valueWithUnit, defaultUnit = "kg") => {
    if (!valueWithUnit) return defaultUnit;
    if (typeof valueWithUnit === 'object') {
      return valueWithUnit.unit || defaultUnit;
    }
    const parts = valueWithUnit.split(' ');
    return parts.length > 1 ? parts[1] : defaultUnit;
  };

  // State for form data - pre-fill if edit mode
  const [formData, setFormData] = useState({
    id: editMode ? crop.id || crop._id : null,
    cropName: editMode ? (crop.cropName || crop.name) : "",
    cropType: editMode ? crop.cropType : "",
    area: editMode ? extractValue(crop.areaPlanted || crop.area) : "",
    areaUnit: editMode ? extractUnit(crop.areaPlanted || crop.area, "acre") : "acre",
    sowingDate: editMode ? parseDate(crop.sowingDate || crop.plantingDate) : new Date(),
    expectedFirstHarvest: editMode ? parseDate(crop.expectedFirstHarvestDate || crop.expectedHarvestStart) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    expectedLastHarvest: editMode ? parseDate(crop.expectedLastHarvestDate || crop.expectedHarvestEnd) : new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
    expectedYield: editMode ? extractValue(crop.expectedYield) : "",
    yieldUnit: editMode ? extractUnit(crop.expectedYield, "kg") : "kg",
    previousCrop: editMode ? crop.previousCrop : "",
    latitude: editMode ? crop.latitude : "18.445297",
    longitude: editMode ? crop.longitude : "73.823057",
    images: editMode ? crop.images || [] : [],
    status: editMode ? crop.status : "pending"
  });

  // State for UI
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState("");
  const [showAreaUnitDropdown, setShowAreaUnitDropdown] = useState(false);
  const [showYieldUnitDropdown, setShowYieldUnitDropdown] = useState(false);

  // Options - match exactly with backend validation
  const areaUnits = ["acre", "guntha"]; // Only these two are allowed in backend
  const yieldUnits = ["kg", "carat", "quintal", "ton"]; // Only these are allowed in backend

  // Format date to DD/MM/YYYY for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB');
  };

  // Format date to DD-MM-YYYY for storage (matching backend format from your logs)
  const formatDateForStorage = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    // NEW - YYYY-MM-DD format (ISO 8601)
    return `${year}-${month}-${day}`; // DD-MM-YYYY format
  };

  // =============================================================================
  // CLOUDINARY IMAGE UPLOAD FUNCTION
  // =============================================================================
  const uploadImageToCloudinary = async (imageUri) => {
    try {
      console.log('🔼 Starting Cloudinary upload for:', imageUri);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Cloudinary upload failed:', errorText);
        throw new Error(`Image upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Cloudinary upload successful:', data.secure_url);
      return data.secure_url; // Return the Cloudinary URL
    } catch (error) {
      console.error('❌ Cloudinary upload error:', error);
      throw error;
    }
  };

  // Function to upload all images to Cloudinary
  const uploadImagesToCloudinary = async (imageUris) => {
  console.log('📤 Starting upload of', imageUris.length, 'images to Cloudinary');
  
  const uploadedImageUrls = [];
  const processedImages = new Set(); // Track processed images to avoid duplicates
  
  for (const imageUri of imageUris) {
    // Skip if we've already processed this exact image
    if (processedImages.has(imageUri)) {
      console.log('🔄 Skipping duplicate image:', imageUri);
      continue;
    }
    
    processedImages.add(imageUri);

    // Check if it's already a Cloudinary URL
    if (imageUri.startsWith('https://res.cloudinary.com/')) {
      console.log('✅ Image already uploaded to Cloudinary:', imageUri);
      uploadedImageUrls.push(imageUri);
    } else if (imageUri.startsWith('file://') || imageUri.startsWith('http')) {
      // It's a local URI or other URL, need to upload to Cloudinary
      console.log('🔼 Uploading image to Cloudinary:', imageUri);
      try {
        const cloudinaryUrl = await uploadImageToCloudinary(imageUri);
        uploadedImageUrls.push(cloudinaryUrl);
        console.log('✅ Image uploaded successfully');
      } catch (error) {
        console.error('❌ Failed to upload image:', imageUri, error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }
    } else {
      console.warn('⚠️ Unknown image format:', imageUri);
      uploadedImageUrls.push(imageUri);
    }
  }
  
  console.log('🎉 All images uploaded successfully. Total:', uploadedImageUrls.length);
  return uploadedImageUrls;
};
  // =============================================================================

  // Date picker handler
  const openDatePicker = (field) => {
    setCurrentDateField(field);
    setShowDatePicker(true);
  };

  // Date change handler
  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate && currentDateField) {
      setFormData(prev => ({
        ...prev,
        [currentDateField]: selectedDate
      }));
      
      if (Platform.OS === 'ios') {
        setTimeout(() => setShowDatePicker(false), 100);
      }
    } else {
      setShowDatePicker(false);
    }
  };

  // Handle unit selection
  const handleAreaUnitSelect = (unit) => {
    setFormData({ ...formData, areaUnit: unit });
    setShowAreaUnitDropdown(false);
  };

  const handleYieldUnitSelect = (unit) => {
    setFormData({ ...formData, yieldUnit: unit });
    setShowYieldUnitDropdown(false);
  };

  // Handle image selection
  const handleImageSelection = async (source) => {
    setShowImagePicker(false);
    
    try {
      let result;
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Camera permission is required to take photos.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Gallery permission is required to select photos.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        const newImages = [...formData.images, result.assets[0].uri];
        if (newImages.length <= 3) {
          setFormData({ ...formData, images: newImages });
        } else {
          Alert.alert('Limit reached', 'You can only add up to 3 images.');
        }
      }
    } catch (error) {
      console.error('Image selection error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  // Update location
  const handleUpdateLocation = () => {
    const newLat = (18.445297 + (Math.random() - 0.5) * 0.01).toFixed(6);
    const newLng = (73.823057 + (Math.random() - 0.5) * 0.01).toFixed(6);
    
    setFormData({
      ...formData,
      latitude: newLat,
      longitude: newLng
    });
    
    Alert.alert('Location Updated', `New coordinates: ${newLat}, ${newLng}`);
  };

  // Enhanced API Service with better error handling
  const enhancedApiService = {
    post: async (endpoint, data) => {
      try {
        const authToken = token || await AuthService.getAuthToken();
        const API_BASE_URL = API_CONFIG.baseUrl; // Use from env
        
        console.log('🌐 Making POST request to:', `${API_BASE_URL}${endpoint}`);
        console.log('📤 Request data:', JSON.stringify(data, null, 2));
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
          },
          body: JSON.stringify(data),
        });

        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
          let errorBody = 'No error body';
          try {
            errorBody = await response.text();
            console.log('❌ Error response body:', errorBody);
          } catch (e) {
            console.log('Could not read error response body:', e);
          }
          
          const error = new Error(`HTTP error! status: ${response.status}`);
          error.status = response.status;
          error.response = response;
          error.body = errorBody;
          throw error;
        }
        
        const responseData = await response.json();
        console.log('✅ Success response:', responseData);
        return responseData;
      } catch (error) {
        console.error('❌ API POST Error:', error);
        throw error;
      }
    },

    patch: async (endpoint, data) => {
      try {
        const authToken = token || await AuthService.getAuthToken();
        const API_BASE_URL = API_CONFIG.baseUrl; // Use from env
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          let errorBody = 'No error body';
          try {
            errorBody = await response.text();
          } catch (e) {
            console.log('Could not read error response body:', e);
          }
          
          const error = new Error(`HTTP error! status: ${response.status}`);
          error.status = response.status;
          error.response = response;
          error.body = errorBody;
          throw error;
        }
        
        return await response.json();
      } catch (error) {
        console.error('API PATCH Error:', error);
        throw error;
      }
    }
  };

  // Handle form submission for both create and edit
  const handleSubmit = async () => {
    if (!formData.cropName.trim()) {
      Alert.alert('Validation Error', 'Please enter crop name');
      return;
    }
    if (!formData.area.trim() || isNaN(parseFloat(formData.area))) {
      Alert.alert('Validation Error', 'Please enter a valid area number');
      return;
    }
    if (!formData.expectedYield.trim() || isNaN(parseFloat(formData.expectedYield))) {
      Alert.alert('Validation Error', 'Please enter a valid expected yield number');
      return;
    }
    
    // Check if images are required
    if (formData.images.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one image of your crop');
      return;
    }

    setIsLoading(true);

    try {
      // Get user data and token
      const currentUser = user || await AuthService.getUserData();
      const authToken = token || await AuthService.getAuthToken();
      
      if (!currentUser || !currentUser._id) {
        throw new Error('User data not found. Please login again.');
      }

      console.log('👤 User ID for crop operation:', currentUser._id);

      // =============================================================================
      // UPLOAD IMAGES TO CLOUDINARY BEFORE SAVING CROP DATA
      // =============================================================================
      console.log('📤 Starting Cloudinary image upload process...');
      const uploadedImageUrls = await uploadImagesToCloudinary(formData.images);
      console.log('✅ All images uploaded to Cloudinary:', uploadedImageUrls);
      // =============================================================================

      // Prepare the submission data according to backend validation schema
      const submissionData = {
        name: formData.cropName.trim(),
        area: {
          value: parseFloat(formData.area),
          unit: formData.areaUnit
        },
        expectedYield: {
          value: parseFloat(formData.expectedYield),
          unit: formData.yieldUnit
        },
        sowingDate: formatDateForStorage(formData.sowingDate),
        expectedFirstHarvestDate: formatDateForStorage(formData.expectedFirstHarvest),
        expectedLastHarvestDate: formatDateForStorage(formData.expectedLastHarvest),
        previousCrop: formData.previousCrop.trim() || undefined,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        images: uploadedImageUrls, // Use the Cloudinary URLs instead of local URIs
      };

      // Clean up the data - remove undefined fields
      const cleanedData = {};
      Object.keys(submissionData).forEach(key => {
        if (submissionData[key] !== undefined && submissionData[key] !== '') {
          cleanedData[key] = submissionData[key];
        }
      });

      console.log('📤 Final cleaned data being sent:', JSON.stringify(cleanedData, null, 2));

      let response;
      
      if (editMode && formData.id) {
        // Update existing crop
        console.log('🔄 Updating crop with ID:', formData.id);
        response = await enhancedApiService.patch(`/crop/update/${formData.id}`, cleanedData);
      } else {
        // Create new crop
        console.log('🆕 Creating new crop for farmer:', currentUser._id);
        response = await enhancedApiService.post(`/crop/add/${currentUser._id}`, cleanedData);
      }

      console.log('✅ Crop operation successful response:', response);

      if (response && (response.success || response.crop || response.data || response.message?.includes('success'))) {
        const resultCrop = response.crop || response.data || response;
        
        Alert.alert(
          'Success', 
          editMode ? 'Crop details updated successfully!' : 'Crop details submitted for verification!',
          [
            { 
              text: 'OK', 
              onPress: () => {
                if (editMode && route.params?.onCropUpdate) {
                  route.params.onCropUpdate(resultCrop);
                } else if (!editMode && route.params?.onCropAdd) {
                  route.params.onCropAdd(resultCrop);
                }
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        throw new Error(response?.message || `Failed to ${editMode ? 'update' : 'create'} crop`);
      }

    } catch (error) {
      console.error('❌ Crop operation error:', error);
      
      let errorMessage = `Failed to ${editMode ? 'update' : 'create'} crop. Please try again.`;
      
      // More specific error messages
      if (error.status === 400) {
        errorMessage = 'Validation error: Please check that:\n• All required fields are filled\n• Area and yield units are valid\n• Dates are in correct format\n• At least one image is provided';
        
        // Try to parse backend validation error
        if (error.body) {
          try {
            const errorData = JSON.parse(error.body);
            if (errorData.details) {
              errorMessage = `Validation errors:\n${errorData.details.map(d => `• ${d.message}`).join('\n')}`;
            } else if (errorData.message) {
              errorMessage = `Backend error: ${errorData.message}`;
            }
          } catch (e) {
            console.log('Could not parse error body:', e);
          }
        }
      } else if (error.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message.includes('Failed to upload image')) {
        errorMessage = 'Failed to upload images to cloud storage. Please check your internet connection and try again.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Render image previews
  const renderImagePreviews = () => {
    if (formData.images.length === 0) return null;

    return (
      <View className="flex-row flex-wrap mt-3 mb-3">
        {formData.images.map((imageUri, index) => (
          <View key={index} className="relative mr-3 mb-3">
            <Image 
              source={{ uri: imageUri }} 
              className="w-20 h-20 rounded-xl"
            />
            <TouchableOpacity 
              onPress={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
            >
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Edit/New Crop Entry Banner */}
        <View className="mx-4 mt-6 bg-green-600 rounded-3xl p-6 shadow-sm">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-green-700 rounded-2xl items-center justify-center mr-4">
              <FontAwesome5 
                name={editMode ? "edit" : "tractor"} 
                size={28} 
                color="white" 
              />
            </View>
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold mb-1">
                {editMode ? "Edit Crop Entry" : "New Crop Entry"}
              </Text>
              <Text className="text-white text-sm">
                {editMode ? "Update your crop details" : "Fill in the details to register your crop"}
              </Text>
              {user?.name && (
                <Text className="text-white/80 text-xs mt-1">
                  Farmer: {user.name}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Basic Information Section */}
        <View className="mx-4 mt-6">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-2">
              <Feather name="info" size={20} color="#16a34a" />
            </View>
            <Text className="text-green-800 text-xl font-semibold">
              Basic Information
            </Text>
          </View>

          {/* Crop Name */}
          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Crop Name *</Text>
            <View className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm">
              <MaterialCommunityIcons 
                name="leaf" 
                size={20} 
                color="#9ca3af" 
                style={{ marginRight: 12 }}
              />
              <TextInput
                className="flex-1 text-gray-700 text-base"
                placeholder="e.g. Rice, Cotton, Sugarcane"
                placeholderTextColor="#9ca3af"
                value={formData.cropName}
                onChangeText={(text) => 
                  setFormData({ ...formData, cropName: text })
                }
              />
            </View>
          </View>

          {/* Crop Type */}
          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Crop Type (Optional)</Text>
            <View className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm">
              <MaterialCommunityIcons 
                name="sprout" 
                size={20} 
                color="#9ca3af" 
                style={{ marginRight: 12 }}
              />
              <TextInput
                className="flex-1 text-gray-700 text-base"
                placeholder="e.g. Organic, Hybrid, Traditional"
                placeholderTextColor="#9ca3af"
                value={formData.cropType}
                onChangeText={(text) => 
                  setFormData({ ...formData, cropType: text })
                }
              />
            </View>
          </View>

          {/* Area with Dropdown */}
          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Area *</Text>
            <View className="flex-row" style={{ gap: 12 }}>
              <View className="flex-1">
                <View className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm">
                  <MaterialCommunityIcons 
                    name="texture-box" 
                    size={20} 
                    color="#9ca3af" 
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    className="flex-1 text-gray-700 text-base"
                    placeholder="Enter area"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={formData.area}
                    onChangeText={(text) => 
                      setFormData({ ...formData, area: text })
                    }
                  />
                </View>
              </View>
              <View style={{ position: 'relative', zIndex: 1000 }}>
                <TouchableOpacity 
                  style={{
                    backgroundColor: '#16a34a',
                    borderRadius: 16,
                    paddingHorizontal: 24,
                    paddingVertical: 16,
                    minWidth: 140,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2
                  }}
                  onPress={() => setShowAreaUnitDropdown(!showAreaUnitDropdown)}
                >
                  <Text style={{
                    color: 'white',
                    fontSize: 18,
                    fontWeight: '600',
                    textTransform: 'lowercase'
                  }}>
                    {formData.areaUnit}
                  </Text>
                  <Ionicons 
                    name={showAreaUnitDropdown ? "chevron-up" : "chevron-down"} 
                    size={18} 
                    color="white" 
                    style={{ marginTop: 2 }}
                  />
                </TouchableOpacity>
                
                {showAreaUnitDropdown && (
                  <View style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    right: 0, 
                    marginTop: 8,
                    zIndex: 9999,
                    elevation: 10,
                    backgroundColor: 'white',
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    minWidth: 200,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8
                  }}>
                    {areaUnits.map((unit, index) => (
                      <TouchableOpacity
                        key={unit}
                        style={{
                          paddingVertical: 16,
                          paddingHorizontal: 20,
                          borderBottomWidth: index !== areaUnits.length - 1 ? 1 : 0,
                          borderBottomColor: '#f3f4f6'
                        }}
                        onPress={() => handleAreaUnitSelect(unit)}
                      >
                        <Text style={{
                          color: '#1f2937',
                          fontSize: 17,
                          textTransform: 'lowercase'
                        }}>
                          {unit}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Dates & Yield Section */}
        <View className="mx-4 mt-6">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-2">
              <Ionicons name="time-outline" size={20} color="#16a34a" />
            </View>
            <Text className="text-green-800 text-xl font-semibold">
              Dates & Yield
            </Text>
          </View>

          {/* Sowing Date and First Harvest */}
          <View className="flex-row mb-4 space-x-3">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium mb-2">Sowing Date</Text>
              <TouchableOpacity 
                onPress={() => openDatePicker('sowingDate')}
                className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm"
              >
                <Feather 
                  name="calendar" 
                  size={20} 
                  color="#16a34a" 
                  style={{ marginRight: 12 }}
                />
                <Text className="flex-1 text-gray-700">
                  {formatDate(formData.sowingDate)}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <View className="flex-1">
              <Text className="text-gray-800 font-medium mb-2">Expected Harvest Start</Text>
              <TouchableOpacity 
                onPress={() => openDatePicker('expectedFirstHarvest')}
                className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm"
              >
                <Feather 
                  name="calendar" 
                  size={20} 
                  color="#16a34a" 
                  style={{ marginRight: 12 }}
                />
                <Text className="flex-1 text-gray-700">
                  {formatDate(formData.expectedFirstHarvest)}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Last Harvest Date */}
          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Expected Harvest End</Text>
            <TouchableOpacity 
              onPress={() => openDatePicker('expectedLastHarvest')}
              className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm"
            >
              <Feather 
                name="calendar" 
                size={20} 
                color="#16a34a" 
                style={{ marginRight: 12 }}
              />
              <Text className="flex-1 text-gray-700">
                {formatDate(formData.expectedLastHarvest)}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Expected Yield with Dropdown */}
          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Expected Yield *</Text>
            <View className="flex-row" style={{ gap: 12 }}>
              <View className="flex-1">
                <View className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm">
                  <MaterialCommunityIcons 
                    name="chart-bar" 
                    size={20} 
                    color="#9ca3af" 
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    className="flex-1 text-gray-700 text-base"
                    placeholder="Enter expected yield"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={formData.expectedYield}
                    onChangeText={(text) => 
                      setFormData({ ...formData, expectedYield: text })
                    }
                  />
                </View>
              </View>
              <View style={{ position: 'relative', zIndex: 1000 }}>
                <TouchableOpacity 
                  style={{
                    backgroundColor: '#16a34a',
                    borderRadius: 16,
                    paddingHorizontal: 24,
                    paddingVertical: 16,
                    minWidth: 140,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2
                  }}
                  onPress={() => setShowYieldUnitDropdown(!showYieldUnitDropdown)}
                >
                  <Text style={{
                    color: 'white',
                    fontSize: 18,
                    fontWeight: '600',
                    textTransform: 'lowercase'
                  }}>
                    {formData.yieldUnit}
                  </Text>
                  <Ionicons 
                    name={showYieldUnitDropdown ? "chevron-up" : "chevron-down"} 
                    size={18} 
                    color="white" 
                    style={{ marginTop: 2 }}
                  />
                </TouchableOpacity>
                
                {showYieldUnitDropdown && (
                  <View style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    right: 0, 
                    marginTop: 8,
                    zIndex: 9999,
                    elevation: 10,
                    backgroundColor: 'white',
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    minWidth: 200,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8
                  }}>
                    {yieldUnits.map((unit, index) => (
                      <TouchableOpacity
                        key={unit}
                        style={{
                          paddingVertical: 16,
                          paddingHorizontal: 20,
                          borderBottomWidth: index !== yieldUnits.length - 1 ? 1 : 0,
                          borderBottomColor: '#f3f4f6'
                        }}
                        onPress={() => handleYieldUnitSelect(unit)}
                      >
                        <Text style={{
                          color: '#1f2937',
                          fontSize: 17,
                          textTransform: 'lowercase'
                        }}>
                          {unit}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Previous Crop */}
          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">
              Previous Crop (Optional)
            </Text>
            <View className="bg-white rounded-2xl p-4 shadow-sm">
              <View className="flex-row items-start">
                <Ionicons name="leaf-outline" size={20} color="#9ca3af" style={{ marginRight: 12, marginTop: 2 }} />
                <TextInput
                  className="flex-1 text-gray-700 text-base min-h-[60px]"
                  placeholder="Enter previous crop details..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  value={formData.previousCrop}
                  onChangeText={(text) => 
                    setFormData({ ...formData, previousCrop: text })
                  }
                />
              </View>
            </View>
          </View>
        </View>

        {/* Location & Images Section */}
        <View className="mx-4 mt-6 mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-2">
              <Ionicons name="location" size={20} color="#16a34a" />
            </View>
            <Text className="text-green-800 text-xl font-semibold">
              Location & Images
            </Text>
          </View>

          {/* Live Location Card */}
          <View className="bg-white rounded-3xl p-5 mb-4 shadow-sm">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-green-100 rounded-2xl items-center justify-center mr-3">
                <Ionicons name="location" size={24} color="#16a34a" />
              </View>
              <Text className="text-gray-800 text-lg font-semibold">
                Live Location
              </Text>
            </View>

            <View className="bg-gray-50 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="navigate-circle-outline" size={18} color="#16a34a" />
                <Text className="text-gray-700 ml-2">
                  Latitude: {formData.latitude}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="navigate-circle-outline" size={18} color="#16a34a" />
                <Text className="text-gray-700 ml-2">
                  Longitude: {formData.longitude}
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleUpdateLocation}
              className="bg-green-600 rounded-2xl p-4 flex-row items-center justify-center"
            >
              <Ionicons name="navigate" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">
                Update Current Location
              </Text>
            </TouchableOpacity>
          </View>

          {/* Upload Images Card */}
          <View className="bg-white rounded-3xl p-5 mb-4 shadow-sm">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-green-100 rounded-2xl items-center justify-center mr-3">
                <Ionicons name="images" size={24} color="#16a34a" />
              </View>
              <Text className="text-gray-800 text-lg font-semibold">
                Upload Images
              </Text>
            </View>

            {renderImagePreviews()}

            <TouchableOpacity 
              onPress={() => setShowImagePicker(true)}
              className="bg-green-600 rounded-2xl p-4 flex-row items-center justify-center"
            >
              <Ionicons name="camera" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">
                Add Image ({formData.images.length}/3)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit/Save Button */}
          <TouchableOpacity 
            onPress={handleSubmit}
            disabled={isLoading}
            className={`rounded-3xl p-5 flex-row items-center justify-center shadow-lg mb-4 ${
              isLoading ? 'bg-gray-400' : 'bg-green-600'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name={editMode ? "checkmark" : "arrow-forward"} size={20} color="white" />
            )}
            <Text className="text-white font-bold text-lg ml-2">
              {isLoading ? "Processing..." : editMode ? "Save Changes" : "Send for Verification"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <TouchableOpacity 
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setShowImagePicker(false)}
        >
          <TouchableOpacity activeOpacity={1}>
            <View className="bg-white rounded-t-3xl p-6 shadow-2xl">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />
              
              <Text className="text-xl font-bold text-center mb-6 text-gray-800">
                Add Image
              </Text>
              
              <TouchableOpacity 
                onPress={() => handleImageSelection('camera')}
                className="flex-row items-center p-4 mb-2 bg-green-50 rounded-2xl"
              >
                <View className="w-12 h-12 bg-green-100 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="camera" size={24} color="#16a34a" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">Take Photo</Text>
                  <Text className="text-sm text-gray-600">Use camera to capture</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => handleImageSelection('gallery')}
                className="flex-row items-center p-4 mb-4 bg-blue-50 rounded-2xl"
              >
                <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="image" size={24} color="#2563eb" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">Choose from Gallery</Text>
                  <Text className="text-sm text-gray-600">Select from your photos</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setShowImagePicker(false)}
                className="p-4 mt-2 bg-gray-100 rounded-2xl"
              >
                <Text className="text-lg font-semibold text-center text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formData[currentDateField] || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}