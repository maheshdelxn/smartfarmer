// src/screens/CropDetails/CropDetailsScreen.jsx
import { useNavigation } from "@react-navigation/native";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Image,
  Modal
} from "react-native";
import { 
  Feather, 
  MaterialCommunityIcons, 
  Ionicons, 
  FontAwesome5 
} from "@expo/vector-icons";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CropDetailsScreen() {
  const navigation = useNavigation();
  
  // State for form data
  const [formData, setFormData] = useState({
    cropName: "",
    area: "",
    areaUnit: "acre",
    sowingDate: new Date(),
    expectedFirstHarvest: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    expectedLastHarvest: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
    expectedYield: "",
    yieldUnit: "kg",
    previousCrop: "",
    latitude: "18.445297",
    longitude: "73.823057",
    images: []
  });

  // State for UI
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState({
    sowing: false,
    firstHarvest: false,
    lastHarvest: false
  });
  const [selectedDateField, setSelectedDateField] = useState("");
  const [showAreaUnitDropdown, setShowAreaUnitDropdown] = useState(false);
  const [showYieldUnitDropdown, setShowYieldUnitDropdown] = useState(false);

  // Options
  const areaUnits = ["acre", "guntha", "hectare", "square meter"];
  const yieldUnits = ["kg", "quintal", "ton", "carat"];

  // Format date to DD/MM/YYYY
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB');
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

  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker({ sowing: false, firstHarvest: false, lastHarvest: false });
    
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        [selectedDateField]: selectedDate
      }));
    }
  };

  // Open date picker
  const openDatePicker = (field) => {
    setSelectedDateField(field);
    setShowDatePicker(prev => ({
      ...prev,
      [field]: true
    }));
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

  // Handle form submission
  const handleSendForVerification = () => {
    if (!formData.cropName.trim()) {
      Alert.alert('Validation Error', 'Please enter crop name');
      return;
    }
    if (!formData.area.trim()) {
      Alert.alert('Validation Error', 'Please enter area');
      return;
    }

    const submissionData = {
      ...formData,
      sowingDate: formatDate(formData.sowingDate),
      expectedFirstHarvest: formatDate(formData.expectedFirstHarvest),
      expectedLastHarvest: formatDate(formData.expectedLastHarvest),
    };

    console.log('Submitting data:', submissionData);
    Alert.alert(
      'Success', 
      'Crop details submitted for verification!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
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
        {/* New Crop Entry Banner */}
        <View className="mx-4 mt-6 bg-green-600 rounded-3xl p-6 shadow-sm">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-green-700 rounded-2xl items-center justify-center mr-4">
              <FontAwesome5 name="tractor" size={28} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold mb-1">
                New Crop Entry
              </Text>
              <Text className="text-white text-sm">
                Fill in the details to register your crop
              </Text>
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
            <Text className="text-gray-800 font-medium mb-2">Crop Name</Text>
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

          {/* Area with Dropdown */}
          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Area (Acres)</Text>
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
                onPress={() => openDatePicker('sowing')}
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
              <Text className="text-gray-800 font-medium mb-2">expected_first_harvest_date</Text>
              <TouchableOpacity 
                onPress={() => openDatePicker('firstHarvest')}
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
            <Text className="text-gray-800 font-medium mb-2">expected_last_harvest_date</Text>
            <TouchableOpacity 
              onPress={() => openDatePicker('lastHarvest')}
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
            <Text className="text-gray-800 font-medium mb-2">Expected Yield</Text>
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

          {/* Send for Verification Button */}
          <TouchableOpacity 
            onPress={handleSendForVerification}
            className="bg-green-600 rounded-3xl p-5 flex-row items-center justify-center shadow-lg mb-4"
          >
            <Ionicons name="arrow-forward" size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">
              Send for Verification
            </Text>
          </TouchableOpacity>

         {/*  Status Bar */}
          {/* <View className="bg-yellow-50 rounded-2xl p-4 flex-row items-center border border-yellow-300">
            <View className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
            <Text className="text-gray-800">
              <Text className="font-semibold">Status: </Text>
              <Text className="text-orange-600 font-semibold">Ready to Save</Text>
            </Text>
          </View> */}
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

      {/* Date Pickers */}
      {showDatePicker.sowing && (
        <DateTimePicker
          value={formData.sowingDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      
      {showDatePicker.firstHarvest && (
        <DateTimePicker
          value={formData.expectedFirstHarvest}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      
      {showDatePicker.lastHarvest && (
        <DateTimePicker
          value={formData.expectedLastHarvest}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}