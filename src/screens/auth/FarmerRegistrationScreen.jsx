import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import ApiService from '../../services/ApiService';
import AuthService from '../../services/AuthService';

/**
 * ------------------------
 * Mocked strings & constants
 * ------------------------
 */
const AppStrings = {
  getString: (key, langCode = 'en') => {
    const strings = {
      'registration': { en: 'Registration', hi: 'पंजीकरण' },
      'personal_information': { en: 'Personal Information', hi: 'व्यक्तिगत जानकारी' },
      'address_information': { en: 'Address Information', hi: 'पता जानकारी' },
      'previous': { en: 'Previous', hi: 'पिछला' },
      'next': { en: 'Next', hi: 'अगला' },
      'register': { en: 'Register', hi: 'पंजीकरण करें' },
      'please_provide_basic_info': { en: 'Please provide your basic information', hi: 'कृपया अपनी बुनियादी जानकारी प्रदान करें' },
      'full_name': { en: 'Full Name', hi: 'पूरा नाम' },
      'enter_full_name': { en: 'Enter your full name', hi: 'अपना पूरा नाम दर्ज करें' },
      'contact_number': { en: 'Contact Number', hi: 'संपर्क नंबर' },
      'enter_mobile_number': { en: 'Enter mobile number', hi: 'मोबाइल नंबर दर्ज करें' },
      'aadhaar_number': { en: 'Aadhaar Number', hi: 'आधार नंबर' },
      'enter_aadhaar_number': { en: 'Enter Aadhaar number', hi: 'आधार नंबर दर्ज करें' },
      'please_provide_address': { en: 'Please provide your address details', hi: 'कृपया अपना पता विवरण प्रदान करें' },
      'state': { en: 'State', hi: 'राज्य' },
      'your_state': { en: 'Your state', hi: 'आपका राज्य' },
      'district': { en: 'District', hi: 'जिला' },
      'enter_district': { en: 'Enter district', hi: 'जिला दर्ज करें' },
      'taluka': { en: 'Taluka', hi: 'तालुका' },
      'select_your_taluka': { en: 'Select your taluka', hi: 'अपना तालुका चुनें' },
      'select_district_first': { en: 'Please select district first', hi: 'कृपया पहले जिला चुनें' },
      'village': { en: 'Village', hi: 'गांव' },
      'enter_village': { en: 'Enter village', hi: 'गांव दर्ज करें' },
      'landmark': { en: 'Landmark', hi: 'लैंडमार्क' },
      'enter_landmark': { en: 'Enter landmark', hi: 'लैंडमार्क दर्ज करें' },
      'pincode': { en: 'Pincode', hi: 'पिनकोड' },
      'enter_pincode': { en: 'Enter pincode', hi: 'पिनकोड दर्ज करें' },
      'Mumbai': { en: 'Mumbai', hi: 'मुंबई' },
      'Pune': { en: 'Pune', hi: 'पुणे' },
      'Nagpur': { en: 'Nagpur', hi: 'नागपुर' },
      'Thane': { en: 'Thane', hi: 'ठाणे' },
      'Nashik': { en: 'Nashik', hi: 'नाशिक' },
      'Mumbai City': { en: 'Mumbai City', hi: 'मुंबई सिटी' },
      'Mumbai Suburban': { en: 'Mumbai Suburban', hi: 'मुंबई उपनगर' },
      'Pune City': { en: 'Pune City', hi: 'पुणे सिटी' },
      'Pune Rural': { en: 'Pune Rural', hi: 'पुणे ग्रामीण' },
      'Baramati': { en: 'Baramati', hi: 'बारामती' },
      'Nagpur City': { en: 'Nagpur City', hi: 'नागपुर सिटी' },
      'Nagpur Rural': { en: 'Nagpur Rural', hi: 'नागपुर ग्रामीण' },
      'Thane City': { en: 'Thane City', hi: 'ठाणे सिटी' },
      'Thane Rural': { en: 'Thane Rural', hi: 'ठाणे ग्रामीण' },
      'Nashik City': { en: 'Nashik City', hi: 'नाशिक सिटी' },
      'Nashik Rural': { en: 'Nashik Rural', hi: 'नाशिक ग्रामीण' },
    };
    return strings[key]?.[langCode] || key;
  }
};

const AppConstants = {
  maharashtraDistricts: {
    'Mumbai': ['Mumbai City', 'Mumbai Suburban'],
    'Pune': ['Pune City', 'Pune Rural', 'Baramati'],
    'Nagpur': ['Nagpur City', 'Nagpur Rural'],
    'Thane': ['Thane City', 'Thane Rural'],
    'Nashik': ['Nashik City', 'Nashik Rural'],
  }
};

/**
 * ------------------------
 * UI subcomponents
 * ------------------------
 */

const ProgressStep = React.memo(({ step, title, icon, isSmallScreen, currentStep }) => {
  const isActive = currentStep >= step;
  const isCompleted = currentStep > step;

  return (
    <View className="flex-1 items-center">
      <View
        className={`${isSmallScreen ? 'w-8 h-8 rounded-full' : 'w-10 h-10 rounded-full'} justify-center items-center mb-1 ${
          isCompleted ? 'bg-green-600' : isActive ? 'bg-green-700' : 'bg-gray-300'
        }`}
      >
        <Feather 
          name={isCompleted ? 'check' : icon} 
          size={isSmallScreen ? 16 : 20} 
          color="#FFFFFF" 
        />
      </View>
      <Text 
        className={`${isSmallScreen ? 'text-xs' : 'text-sm'} text-center ${
          isActive ? 'text-green-700 font-semibold' : 'text-gray-500'
        }`}
      >
        {title}
      </Text>
    </View>
  );
});

const ProgressLine = React.memo(({ currentStep }) => (
  <View 
    className={`w-5 h-1 mx-2 rounded-full ${
      currentStep > 0 ? 'bg-green-700' : 'bg-gray-300'
    }`} 
  />
));

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    {children}
  </TouchableWithoutFeedback>
);

/**
 * ------------------------
 * Main screen
 * ------------------------
 */
const FarmerRegistrationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { initialContact } = route?.params || {};

  const { height } = Dimensions.get('window');
  const isSmallScreen = height < 700;

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [langCode] = useState('en');

  // Form fields
  const [name, setName] = useState('');
  const [contact, setContact] = useState(initialContact || '');
  const [aadhaar, setAadhaar] = useState('');
  const [village, setVillage] = useState('');
  const [landmark, setLandmark] = useState('');
  const [taluka, setTaluka] = useState('');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [stateValue] = useState('Maharashtra');

  // Autocomplete / helpers
  const [availableTalukas, setAvailableTalukas] = useState([]);
  const [isDistrictSelected, setIsDistrictSelected] = useState(false);
  const [districtSuggestions, setDistrictSuggestions] = useState([]);
  const [talukaSuggestions, setTalukaSuggestions] = useState([]);
  const [showDistrictSuggestions, setShowDistrictSuggestions] = useState(false);
  const [showTalukaSuggestions, setShowTalukaSuggestions] = useState(false);

  // refs
  const scrollViewRef = useRef(null);
  const nameInputRef = useRef(null);
  const contactInputRef = useRef(null);
  const aadhaarInputRef = useRef(null);
  const districtInputRef = useRef(null);
  const talukaInputRef = useRef(null);
  const villageInputRef = useRef(null);
  const landmarkInputRef = useRef(null);
  const pincodeInputRef = useRef(null);

  useEffect(() => {
    if (initialContact) setContact(initialContact);
  }, [initialContact]);

  const getLocalizedDistricts = useCallback(() => {
    return Object.keys(AppConstants.maharashtraDistricts).map(d => AppStrings.getString(d, langCode));
  }, [langCode]);

  const getEnglishDistrictFromLocalized = useCallback((localized) => {
    return Object.keys(AppConstants.maharashtraDistricts).find(
      (district) => AppStrings.getString(district, langCode) === localized
    ) || localized;
  }, [langCode]);

  const getLocalizedTalukas = useCallback((districtLocal) => {
    const englishDistrict = getEnglishDistrictFromLocalized(districtLocal);
    const talukas = AppConstants.maharashtraDistricts[englishDistrict] || [];
    return talukas.map(t => AppStrings.getString(t, langCode));
  }, [getEnglishDistrictFromLocalized, langCode]);

  const handleNameChange = useCallback((text) => setName(text), []);
  const handleContactChange = useCallback((text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 10) setContact(numericText);
  }, []);
  const handleAadhaarChange = useCallback((text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 12) setAadhaar(numericText);
  }, []);
  const handlePincodeChange = useCallback((text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 6) setPincode(numericText);
  }, []);

  const handleDistrictChange = useCallback((text) => {
    setDistrict(text);

    if (!text || text.length === 0) {
      setDistrictSuggestions([]);
      setShowDistrictSuggestions(false);
      setIsDistrictSelected(false);
      setAvailableTalukas([]);
      setTaluka('');
      return;
    }

    const suggestions = getLocalizedDistricts().filter(item =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    setDistrictSuggestions(suggestions);
    setShowDistrictSuggestions(true);
  }, [getLocalizedDistricts]);

  const selectDistrict = useCallback((selectedDistrict) => {
    setDistrict(selectedDistrict);
    setShowDistrictSuggestions(false);

    const englishDistrict = getEnglishDistrictFromLocalized(selectedDistrict);
    const talukas = AppConstants.maharashtraDistricts[englishDistrict] || [];
    setAvailableTalukas(talukas.map(t => AppStrings.getString(t, langCode)));
    setIsDistrictSelected(true);
    setTalukaSuggestions(getLocalizedTalukas(selectedDistrict));

    setTimeout(() => talukaInputRef.current?.focus(), 100);
  }, [getEnglishDistrictFromLocalized, getLocalizedTalukas, langCode]);

  const handleTalukaChange = useCallback((text) => {
    setTaluka(text);
    if (!isDistrictSelected) {
      setTalukaSuggestions([]);
      setShowTalukaSuggestions(false);
      return;
    }

    if (!text || text.length === 0) {
      setTalukaSuggestions(availableTalukas);
      setShowTalukaSuggestions(false);
      return;
    }

    const suggestions = availableTalukas.filter(item =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    setTalukaSuggestions(suggestions);
    setShowTalukaSuggestions(true);
  }, [availableTalukas, isDistrictSelected]);

  const selectTaluka = useCallback((selectedTaluka) => {
    setTaluka(selectedTaluka);
    setShowTalukaSuggestions(false);
    setTimeout(() => villageInputRef.current?.focus(), 100);
  }, []);

  const validateCurrentStep = useCallback(() => {
    if (currentStep === 0) {
      if (!name || name.length < 2) return false;
      if (!contact || contact.length !== 10) return false;
      if (!aadhaar || aadhaar.length !== 12) return false;
      return true;
    } else {
      if (!village) return false;
      if (!landmark) return false;
      if (!district) return false;
      if (!taluka) return false;
      if (!pincode || pincode.length !== 6) return false;
      return true;
    }
  }, [currentStep, name, contact, aadhaar, village, landmark, district, taluka, pincode]);

  const nextStep = useCallback(() => {
    if (validateCurrentStep() && currentStep < 1) {
      setCurrentStep(s => s + 1);
      setTimeout(() => districtInputRef.current?.focus(), 300);
    } else {
      Alert.alert('Validation Error', 'Please fill all required fields with valid information', [{ text: 'OK' }]);
    }
  }, [validateCurrentStep, currentStep]);

  const previousStep = useCallback(() => setCurrentStep(s => Math.max(0, s - 1)), []);

  /**
   * BACKEND INTEGRATION - Registration Function
   */
  const handleRegistration = useCallback(async () => {
  if (!validateCurrentStep()) {
    Alert.alert('Validation Error', 'Please fill all required fields with valid information', [{ text: 'OK' }]);
    return;
  }
  
  setIsLoading(true);
  try {
    console.log('📝 Starting farmer registration...');
    
    const registrationData = {
      name: name.trim(),
      contact: contact,
      aadhaarNumber: aadhaar,
      village: village.trim(),
      landMark: landmark.trim(),
      taluka: taluka,
      district: district,
      pincode: pincode,
      state: stateValue
    };

    console.log('📤 Sending registration data:', registrationData);

    const response = await ApiService.post('/farmer/register/contact', registrationData);
    
    console.log('✅ Registration response:', response);

    if (response && (response.success || response.message === 'New Farmer Created with Contact')) {
      // Store user data and token
      if (response.token && response.farmer) {
        await AuthService.storeAuthData(response.token, response.farmer);
        console.log('✅ User data stored successfully');
      }
      
      Alert.alert(
        'Success', 
        response.message || 'Registration successful!',
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Navigate to main app
              navigation.reset({ 
                index: 0, 
                routes: [{ name: 'MainApp' }] 
              });
            }
          }
        ]
      );
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
      errorMessage = 'This contact number or Aadhaar is already registered.';
    } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    Alert.alert('Registration Failed', errorMessage);
  } finally {
    setIsLoading(false);
  }
}, [
  validateCurrentStep, name, contact, aadhaar, village, landmark, 
  taluka, district, pincode, stateValue, navigation
]);

  const PersonalInfoStep = useMemo(() => (
    <View className="flex-1">
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
      >
        <Text className="text-xl font-bold text-black mb-2">
          {AppStrings.getString('personal_information', langCode)}
        </Text>
        <Text className="text-sm text-gray-500 mb-4 leading-5">
          {AppStrings.getString('please_provide_basic_info', langCode)}
        </Text>

        {/* Name Input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-black mb-2">
            {AppStrings.getString('full_name', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-white overflow-hidden">
            <View className="p-3">
              <Feather name="user" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={nameInputRef}
              className="flex-1 py-3 px-2 text-base text-black"
              value={name}
              onChangeText={handleNameChange}
              placeholder={AppStrings.getString('enter_full_name', langCode)}
              placeholderTextColor="#999"
              returnKeyType="next"
              onSubmitEditing={() => contactInputRef.current?.focus()}
            />
          </View>
        </View>

        {/* Contact Input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-black mb-2">
            {AppStrings.getString('contact_number', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-white overflow-hidden">
            <View className="p-3">
              <Feather name="phone" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={contactInputRef}
              className="flex-1 py-3 px-2 text-base text-black"
              value={contact}
              onChangeText={handleContactChange}
              placeholder={AppStrings.getString('enter_mobile_number', langCode)}
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={10}
              returnKeyType="next"
              onSubmitEditing={() => aadhaarInputRef.current?.focus()}
            />
          </View>
        </View>

        {/* Aadhaar Input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-black mb-2">
            {AppStrings.getString('aadhaar_number', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-white overflow-hidden">
            <View className="p-3">
              <Feather name="credit-card" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={aadhaarInputRef}
              className="flex-1 py-3 px-2 text-base text-black"
              value={aadhaar}
              onChangeText={handleAadhaarChange}
              placeholder={AppStrings.getString('enter_aadhaar_number', langCode)}
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={12}
              returnKeyType="done"
              onSubmitEditing={nextStep}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  ), [name, contact, aadhaar, handleNameChange, handleContactChange, handleAadhaarChange, langCode, nextStep]);

  const AddressStep = useMemo(() => (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
      >
        <Text className="text-xl font-bold text-black mb-2">
          {AppStrings.getString('address_information', langCode)}
        </Text>
        <Text className="text-sm text-gray-500 mb-4 leading-5">
          {AppStrings.getString('please_provide_address', langCode)}
        </Text>

        {/* State (disabled) */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-black mb-2">
            {AppStrings.getString('state', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-100 overflow-hidden">
            <View className="p-3">
              <Feather name="map-pin" size={20} color="#2E7D32" />
            </View>
            <TextInput
              className="flex-1 py-3 px-2 text-base text-gray-500"
              value={stateValue}
              editable={false}
              placeholder={AppStrings.getString('your_state', langCode)}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* District with autocomplete */}
        <View className="mb-4 relative z-50">
          <Text className="text-sm font-semibold text-black mb-2">
            {AppStrings.getString('district', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-white overflow-hidden">
            <View className="p-3">
              <Feather name="flag" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={districtInputRef}
              className="flex-1 py-3 px-2 text-base text-black"
              value={district}
              onChangeText={handleDistrictChange}
              placeholder={AppStrings.getString('enter_district', langCode)}
              placeholderTextColor="#999"
              returnKeyType="next"
            />
          </View>

          {showDistrictSuggestions && districtSuggestions.length > 0 && (
            <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-xl mt-2 max-h-48 shadow-lg z-50">
              <ScrollView keyboardShouldPersistTaps="always" nestedScrollEnabled>
                {districtSuggestions.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    className="py-3 px-4 border-b border-gray-100"
                    onPress={() => selectDistrict(item)}
                  >
                    <Text className="text-base text-gray-800">{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Taluka with autocomplete */}
        <View className="mb-4 relative z-40">
          <Text className="text-sm font-semibold text-black mb-2">
            {AppStrings.getString('taluka', langCode)}
          </Text>
          <View className={`flex-row items-center border border-gray-300 rounded-xl overflow-hidden ${
            !isDistrictSelected ? 'bg-gray-100' : 'bg-white'
          }`}>
            <View className="p-3">
              <Feather name="map" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={talukaInputRef}
              className={`flex-1 py-3 px-2 text-base ${
                !isDistrictSelected ? 'text-gray-500' : 'text-black'
              }`}
              value={taluka}
              onChangeText={handleTalukaChange}
              placeholder={isDistrictSelected ? AppStrings.getString('select_your_taluka', langCode) : AppStrings.getString('select_district_first', langCode)}
              placeholderTextColor="#999"
              editable={isDistrictSelected}
              returnKeyType="next"
            />
          </View>

          {showTalukaSuggestions && talukaSuggestions.length > 0 && (
            <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-xl mt-2 max-h-48 shadow-lg z-50">
              <ScrollView keyboardShouldPersistTaps="always" nestedScrollEnabled>
                {talukaSuggestions.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    className="py-3 px-4 border-b border-gray-100"
                    onPress={() => selectTaluka(item)}
                  >
                    <Text className="text-base text-gray-800">{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Village */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-black mb-2">
            {AppStrings.getString('village', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-white overflow-hidden">
            <View className="p-3">
              <Feather name="home" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={villageInputRef}
              className="flex-1 py-3 px-2 text-base text-black"
              value={village}
              onChangeText={setVillage}
              placeholder={AppStrings.getString('enter_village', langCode)}
              placeholderTextColor="#999"
              returnKeyType="next"
              onSubmitEditing={() => landmarkInputRef.current?.focus()}
            />
          </View>
        </View>

        {/* Landmark */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-black mb-2">
            {AppStrings.getString('landmark', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-white overflow-hidden">
            <View className="p-3">
              <Feather name="map-pin" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={landmarkInputRef}
              className="flex-1 py-3 px-2 text-base text-black"
              value={landmark}
              onChangeText={setLandmark}
              placeholder={AppStrings.getString('enter_landmark', langCode)}
              placeholderTextColor="#999"
              returnKeyType="next"
              onSubmitEditing={() => pincodeInputRef.current?.focus()}
            />
          </View>
        </View>

        {/* Pincode */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-black mb-2">
            {AppStrings.getString('pincode', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-white overflow-hidden">
            <View className="p-3">
              <Feather name="navigation" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={pincodeInputRef}
              className="flex-1 py-3 px-2 text-base text-black"
              value={pincode}
              onChangeText={handlePincodeChange}
              placeholder={AppStrings.getString('enter_pincode', langCode)}
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={6}
              returnKeyType="done"
              onSubmitEditing={handleRegistration}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  ), [
    district, districtSuggestions, showDistrictSuggestions,
    taluka, talukaSuggestions, showTalukaSuggestions,
    village, landmark, pincode, isDistrictSelected, stateValue,
    handleDistrictChange, selectDistrict, handleTalukaChange, selectTaluka,
    handlePincodeChange, handleRegistration, langCode
  ]);

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <DismissKeyboard>
          <View className="flex-1">
            {/* Header */}
            <View className="bg-green-700 flex-row items-center justify-between px-3 py-3 shadow-md">
              <TouchableOpacity 
                className="w-10 h-10 bg-white/20 rounded-xl justify-center items-center"
                onPress={() => navigation.goBack()}
              >
                <Feather name="arrow-left" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text className="text-white text-lg font-semibold">
                {AppStrings.getString('registration', langCode)}
              </Text>
              <View className="w-10 h-10" />
            </View>

            {/* Progress Bar */}
            <View className="flex-row items-center px-3 py-3 bg-gray-50 border-b border-gray-200">
              <ProgressStep 
                step={0} 
                title={AppStrings.getString('personal_information', langCode)} 
                icon="user" 
                isSmallScreen={isSmallScreen} 
                currentStep={currentStep} 
              />
              <ProgressLine currentStep={currentStep} />
              <ProgressStep 
                step={1} 
                title={AppStrings.getString('address_information', langCode)} 
                icon="map-pin" 
                isSmallScreen={isSmallScreen} 
                currentStep={currentStep} 
              />
            </View>

            {/* Content */}
            <View className="flex-1">
              {currentStep === 0 && PersonalInfoStep}
              {currentStep === 1 && AddressStep}
            </View>

            {/* Footer Buttons */}
            <View className="px-4 py-4 border-t border-gray-200 bg-white">
              <View className="flex-row">
                {currentStep > 0 && (
                  <TouchableOpacity
                    className={`flex-1 py-3 rounded-xl border border-green-700 mr-3 justify-center items-center ${
                      isLoading ? 'opacity-60' : ''
                    }`}
                    onPress={previousStep}
                    disabled={isLoading}
                  >
                    <Text className="text-green-700 text-base font-semibold">
                      {AppStrings.getString('previous', langCode)}
                    </Text>
                  </TouchableOpacity>
                )}

                {currentStep === 0 && (
                  <TouchableOpacity
                    className={`flex-1 py-3 rounded-xl bg-green-700 justify-center items-center ${
                      isLoading ? 'opacity-60' : ''
                    }`}
                    onPress={nextStep}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text className="text-white text-base font-semibold">
                        {AppStrings.getString('next', langCode)}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}

                {currentStep === 1 && (
                  <TouchableOpacity
                    className={`flex-1 py-3 rounded-xl bg-green-700 justify-center items-center ${
                      isLoading ? 'opacity-60' : ''
                    }`}
                    onPress={handleRegistration}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text className="text-white text-base font-semibold">
                        {AppStrings.getString('register', langCode)}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </DismissKeyboard>
      </KeyboardAvoidingView>
    </View>
  );
};

export default FarmerRegistrationScreen;