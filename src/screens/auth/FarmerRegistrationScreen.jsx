import React, { useState, useRef, useEffect } from 'react';
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

// Mock implementations
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

// ProgressStep Component
const ProgressStep = ({ step, title, icon, isSmallScreen, currentStep }) => {
  const isActive = currentStep >= step;
  const isCompleted = currentStep > step;

  return (
    <View className="flex-1 items-center">
      <View
        className={`rounded-full justify-center items-center mb-1 ${
          isSmallScreen ? 'w-8 h-8' : 'w-10 h-10'
        } ${
          isCompleted
            ? 'bg-green-500'
            : isActive
              ? 'bg-green-700'
              : 'bg-gray-300'
        }`}
      >
        <Feather
          name={isCompleted ? "check" : icon}
          size={isSmallScreen ? 16 : 20}
          color="#FFFFFF"
        />
      </View>
      <Text
        className={`text-center ${
          isSmallScreen ? 'text-xs' : 'text-sm'
        } ${
          isActive ? 'text-green-700 font-semibold' : 'text-gray-500'
        }`}
      >
        {title}
      </Text>
    </View>
  );
};

// ProgressLine Component
const ProgressLine = ({ currentStep }) => (
  <View
    className={`w-5 h-0.5 ${
      currentStep > 0 ? 'bg-green-700' : 'bg-gray-300'
    }`}
  />
);

const FarmerRegistrationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { initialContact } = route.params || {};

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [langCode, setLangCode] = useState('en');

  // Form fields
  const [name, setName] = useState('');
  const [contact, setContact] = useState(initialContact || '');
  const [aadhaar, setAadhaar] = useState('');
  const [village, setVillage] = useState('');
  const [landmark, setLandmark] = useState('');
  const [taluka, setTaluka] = useState('');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('Maharashtra');

  // Autocomplete states
  const [availableTalukas, setAvailableTalukas] = useState([]);
  const [isDistrictSelected, setIsDistrictSelected] = useState(false);
  const [districtSuggestions, setDistrictSuggestions] = useState([]);
  const [talukaSuggestions, setTalukaSuggestions] = useState([]);
  const [showDistrictSuggestions, setShowDistrictSuggestions] = useState(false);
  const [showTalukaSuggestions, setShowTalukaSuggestions] = useState(false);

  const scrollViewRef = useRef();
  const { height } = Dimensions.get('window');
  const isSmallScreen = height < 700;

  // Refs for text inputs
  const nameInputRef = useRef(null);
  const contactInputRef = useRef(null);
  const aadhaarInputRef = useRef(null);
  const districtInputRef = useRef(null);
  const talukaInputRef = useRef(null);
  const villageInputRef = useRef(null);
  const landmarkInputRef = useRef(null);
  const pincodeInputRef = useRef(null);

  useEffect(() => {
    if (initialContact) {
      setContact(initialContact);
    }
  }, [initialContact]);

  const getLocalizedDistricts = () => {
    return Object.keys(AppConstants.maharashtraDistricts).map(district =>
      AppStrings.getString(district, langCode)
    );
  };

  const getEnglishDistrictFromLocalized = (localized) => {
    return Object.keys(AppConstants.maharashtraDistricts).find(
      district => AppStrings.getString(district, langCode) === localized
    ) || localized;
  };

  const getLocalizedTalukas = (district) => {
    const englishDistrict = getEnglishDistrictFromLocalized(district);
    const talukas = AppConstants.maharashtraDistricts[englishDistrict] || [];
    return talukas.map(taluka => AppStrings.getString(taluka, langCode));
  };

  const handleDistrictChange = (text) => {
    setDistrict(text);
    const suggestions = getLocalizedDistricts().filter(item =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    setDistrictSuggestions(suggestions);
    setShowDistrictSuggestions(text.length > 0);
    
    if (text.length === 0) {
      setIsDistrictSelected(false);
      setAvailableTalukas([]);
      setTaluka('');
    }
  };

  const selectDistrict = (selectedDistrict) => {
    setDistrict(selectedDistrict);
    setShowDistrictSuggestions(false);
    
    const englishDistrict = getEnglishDistrictFromLocalized(selectedDistrict);
    const talukas = AppConstants.maharashtraDistricts[englishDistrict] || [];
    setAvailableTalukas(talukas.map(taluka => AppStrings.getString(taluka, langCode)));
    setIsDistrictSelected(true);
    setTalukaSuggestions(getLocalizedTalukas(selectedDistrict));
    
    // Focus on taluka input after district selection
    setTimeout(() => {
      talukaInputRef.current?.focus();
    }, 100);
  };

  const handleTalukaChange = (text) => {
    setTaluka(text);
    if (isDistrictSelected) {
      const suggestions = availableTalukas.filter(item =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setTalukaSuggestions(suggestions);
      setShowTalukaSuggestions(text.length > 0);
    }
  };

  const selectTaluka = (selectedTaluka) => {
    setTaluka(selectedTaluka);
    setShowTalukaSuggestions(false);
    
    // Focus on village input after taluka selection
    setTimeout(() => {
      villageInputRef.current?.focus();
    }, 100);
  };

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleContactChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 10) {
      setContact(numericText);
    }
  };

  const handleAadhaarChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 12) {
      setAadhaar(numericText);
    }
  };

  const handlePincodeChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 6) {
      setPincode(numericText);
    }
  };

  const validateCurrentStep = () => {
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
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < 1) {
      setCurrentStep(currentStep + 1);
      // Auto-focus on first field of next step
      setTimeout(() => {
        districtInputRef.current?.focus();
      }, 300);
    } else {
      Alert.alert(
        'Validation Error',
        'Please fill all required fields with valid information',
        [{ text: 'OK' }]
      );
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegistration = async () => {
    if (!validateCurrentStep()) {
      Alert.alert(
        'Validation Error',
        'Please fill all required fields with valid information',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);

    try {
      // Mock registration
      const registrationResult = {
        success: true,
        message: 'Registration successful',
        farmer: {
          _id: '12345',
          name: name,
          contact: contact,
          aadhaarNumber: aadhaar,
          village: village,
          landMark: landmark,
          taluka: taluka,
          district: district,
          pincode: pincode,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      };

      if (registrationResult.success) {
        Alert.alert('Success', registrationResult.message);
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        });
      } else {
        Alert.alert('Error', registrationResult.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed: an internal error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Personal Information Step Component
  const PersonalInfoStep = () => (
    <View className="flex-1">
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-xl font-semibold text-black mb-2">
          {AppStrings.getString('personal_information', langCode)}
        </Text>
        <Text className="text-sm text-gray-500 mb-6 leading-5">
          {AppStrings.getString('please_provide_basic_info', langCode)}
        </Text>

        {/* Name Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-black mb-2">
            {AppStrings.getString('full_name', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-white">
            <View className="p-3">
              <Feather name="user" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={nameInputRef}
              className="flex-1 p-3 text-base text-black"
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
          <Text className="text-sm font-medium text-black mb-2">
            {AppStrings.getString('contact_number', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-white">
            <View className="p-3">
              <Feather name="phone" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={contactInputRef}
              className="flex-1 p-3 text-base text-black"
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
          <Text className="text-sm font-medium text-black mb-2">
            {AppStrings.getString('aadhaar_number', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-white">
            <View className="p-3">
              <Feather name="credit-card" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={aadhaarInputRef}
              className="flex-1 p-3 text-base text-black"
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
  );

  // Address Information Step Component
  const AddressStep = () => (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-xl font-semibold text-black mb-2">
          {AppStrings.getString('address_information', langCode)}
        </Text>
        <Text className="text-sm text-gray-500 mb-6 leading-5">
          {AppStrings.getString('please_provide_address', langCode)}
        </Text>

        {/* State Input (Disabled) */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-black mb-2">
            {AppStrings.getString('state', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-100">
            <View className="p-3">
              <Feather name="map-pin" size={20} color="#2E7D32" />
            </View>
            <TextInput
              className="flex-1 p-3 text-base text-gray-600"
              value={state}
              placeholder={AppStrings.getString('your_state', langCode)}
              placeholderTextColor="#999"
              editable={false}
            />
          </View>
        </View>

        {/* District Input with Autocomplete */}
        <View className="mb-4 relative z-50">
          <Text className="text-sm font-medium text-black mb-2">
            {AppStrings.getString('district', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-white">
            <View className="p-3">
              <Feather name="flag" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={districtInputRef}
              className="flex-1 p-3 text-base text-black"
              value={district}
              onChangeText={handleDistrictChange}
              placeholder={AppStrings.getString('enter_district', langCode)}
              placeholderTextColor="#999"
              returnKeyType="next"
            />
          </View>
          {showDistrictSuggestions && districtSuggestions.length > 0 && (
            <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg elevation-8" style={{ maxHeight: 200, zIndex: 1000 }}>
              <ScrollView
                keyboardShouldPersistTaps="always"
                nestedScrollEnabled={true}
              >
                {districtSuggestions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    className="p-4 border-b border-gray-100"
                    onPress={() => {
                      selectDistrict(item);
                    }}
                  >
                    <Text className="text-base text-black">{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Taluka Input with Autocomplete */}
        <View className="mb-4 relative z-40">
          <Text className="text-sm font-medium text-black mb-2">
            {AppStrings.getString('taluka', langCode)}
          </Text>
          <View className={`flex-row items-center border border-gray-300 rounded-xl ${!isDistrictSelected ? 'bg-gray-100' : 'bg-white'}`}>
            <View className="p-3">
              <Feather name="map" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={talukaInputRef}
              className={`flex-1 p-3 text-base ${!isDistrictSelected ? 'text-gray-600' : 'text-black'}`}
              value={taluka}
              onChangeText={handleTalukaChange}
              placeholder={isDistrictSelected
                ? AppStrings.getString('select_your_taluka', langCode)
                : AppStrings.getString('select_district_first', langCode)
              }
              placeholderTextColor="#999"
              editable={isDistrictSelected}
              returnKeyType="next"
            />
          </View>
          {showTalukaSuggestions && talukaSuggestions.length > 0 && (
            <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg elevation-8" style={{ maxHeight: 200, zIndex: 1000 }}>
              <ScrollView
                keyboardShouldPersistTaps="always"
                nestedScrollEnabled={true}
              >
                {talukaSuggestions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    className="p-4 border-b border-gray-100"
                    onPress={() => {
                      selectTaluka(item);
                    }}
                  >
                    <Text className="text-base text-black">{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Village Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-black mb-2">
            {AppStrings.getString('village', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-white">
            <View className="p-3">
              <Feather name="home" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={villageInputRef}
              className="flex-1 p-3 text-base text-black"
              value={village}
              onChangeText={setVillage}
              placeholder={AppStrings.getString('enter_village', langCode)}
              placeholderTextColor="#999"
              returnKeyType="next"
              onSubmitEditing={() => landmarkInputRef.current?.focus()}
            />
          </View>
        </View>

        {/* Landmark Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-black mb-2">
            {AppStrings.getString('landmark', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-white">
            <View className="p-3">
              <Feather name="map-pin" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={landmarkInputRef}
              className="flex-1 p-3 text-base text-black"
              value={landmark}
              onChangeText={setLandmark}
              placeholder={AppStrings.getString('enter_landmark', langCode)}
              placeholderTextColor="#999"
              returnKeyType="next"
              onSubmitEditing={() => pincodeInputRef.current?.focus()}
            />
          </View>
        </View>

        {/* Pincode Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-black mb-2">
            {AppStrings.getString('pincode', langCode)}
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl bg-white">
            <View className="p-3">
              <Feather name="navigation" size={20} color="#2E7D32" />
            </View>
            <TextInput
              ref={pincodeInputRef}
              className="flex-1 p-3 text-base text-black"
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
  );

  // Dismiss keyboard when tapping outside
  const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {children}
    </TouchableWithoutFeedback>
  );

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <DismissKeyboard>
          <View className="flex-1">
            {/* Header */}
            <View className="bg-green-700 flex-row items-center justify-between px-4 py-3 elevation-4 shadow-lg">
              <TouchableOpacity
                className="p-1"
                onPress={() => navigation.goBack()}
              >
                <Feather name="arrow-left" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-white">
                {AppStrings.getString('registration', langCode)}
              </Text>
              <View className="w-8" />
            </View>

            {/* Progress Bar */}
            <View className="flex-row items-center px-4 py-3 bg-gray-50 border-b border-gray-300">
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
              {currentStep === 0 && <PersonalInfoStep />}
              {currentStep === 1 && <AddressStep />}
            </View>

            {/* Footer Buttons */}
            <View className="p-4 border-t border-gray-300 bg-white">
              <View className="flex-row">
                {currentStep > 0 && (
                  <TouchableOpacity
                    className={`flex-1 py-4 rounded-xl border border-green-700 mr-4 ${isLoading ? 'opacity-50' : ''}`}
                    onPress={previousStep}
                    disabled={isLoading}
                  >
                    <Text className="text-green-700 text-base font-semibold text-center">
                      {AppStrings.getString('previous', langCode)}
                    </Text>
                  </TouchableOpacity>
                )}
                
                {currentStep === 0 && (
                  <TouchableOpacity
                    className={`flex-1 py-4 rounded-xl bg-green-700 ${isLoading ? 'opacity-50' : ''}`}
                    onPress={nextStep}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text className="text-white text-base font-semibold text-center">
                        {AppStrings.getString('next', langCode)}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
                
                {currentStep === 1 && (
                  <TouchableOpacity
                    className={`flex-1 py-4 rounded-xl bg-green-700 ${isLoading ? 'opacity-50' : ''}`}
                    onPress={handleRegistration}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text className="text-white text-base font-semibold text-center">
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