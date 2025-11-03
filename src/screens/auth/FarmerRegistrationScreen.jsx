import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Mock implementations for now - replace with your actual implementations
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
      'name_required': { en: 'Name is required', hi: 'नाम आवश्यक है' },
      'name_min_length': { en: 'Name must be at least 2 characters', hi: 'नाम कम से कम 2 अक्षरों का होना चाहिए' },
      'phone_required': { en: 'Phone number is required', hi: 'फोन नंबर आवश्यक है' },
      'invalid_phone': { en: 'Please enter a valid 10-digit phone number', hi: 'कृपया वैध 10-अंकीय फोन नंबर दर्ज करें' },
      'aadhaar_required': { en: 'Aadhaar number is required', hi: 'आधार नंबर आवश्यक है' },
      'invalid_aadhaar': { en: 'Please enter a valid 12-digit Aadhaar number', hi: 'कृपया वैध 12-अंकीय आधार नंबर दर्ज करें' },
      'district_required': { en: 'District is required', hi: 'जिला आवश्यक है' },
      'taluka_required': { en: 'Taluka is required', hi: 'तालुका आवश्यक है' },
      'village_required': { en: 'Village is required', hi: 'गांव आवश्यक है' },
      'landmark_required': { en: 'Landmark is required', hi: 'लैंडमार्क आवश्यक है' },
      'pincode_required': { en: 'Pincode is required', hi: 'पिनकोड आवश्यक है' },
      'invalid_pincode': { en: 'Please enter a valid 6-digit pincode', hi: 'कृपया वैध 6-अंकीय पिनकोड दर्ज करें' },
      'select_from_suggestions': { en: 'Please select from suggestions', hi: 'कृपया सुझावों में से चुनें' },
    };
    return strings[key]?.[langCode] || key;
  }
};

const AppTheme = {
  primaryColor: '#2E7D32',
  backgroundColor: '#F5F5F5',
  successColor: '#4CAF50',
  errorColor: '#F44336',
  textSecondaryColor: '#666666',
  dividerColor: '#E0E0E0',
};

const AppConstants = {
  stateMaharashtra: 'maharashtra',
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
    <View style={styles.progressStepContainer}>
      <View style={[
        styles.progressIcon,
        {
          width: isSmallScreen ? 32 : 40,
          height: isSmallScreen ? 32 : 40,
          backgroundColor: isCompleted 
            ? AppTheme.successColor 
            : isActive 
              ? AppTheme.primaryColor 
              : AppTheme.textSecondaryColor + '30',
        }
      ]}>
        <Icon 
          name={isCompleted ? "check" : icon} 
          size={isSmallScreen ? 16 : 20} 
          color="#FFFFFF" 
        />
      </View>
      <Text style={[
        styles.progressText,
        {
          fontSize: isSmallScreen ? 10 : 12,
          color: isActive ? AppTheme.primaryColor : AppTheme.textSecondaryColor,
          fontWeight: isActive ? '600' : 'normal',
        }
      ]}>
        {title}
      </Text>
    </View>
  );
};

// ProgressLine Component
const ProgressLine = ({ currentStep }) => (
  <View style={[
    styles.progressLine,
    { backgroundColor: currentStep > 0 ? AppTheme.primaryColor : AppTheme.dividerColor }
  ]} />
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
  const { width, height } = Dimensions.get('window');
  const isSmallScreen = height < 700;

  // Refs for text inputs
  const contactInputRef = useRef(null);
  const aadhaarInputRef = useRef(null);
  const pincodeInputRef = useRef(null);
  const villageInputRef = useRef(null);
  const landmarkInputRef = useRef(null);

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
      // Mock registration - replace with your actual AuthService
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
        // Navigate to dashboard
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

  // NEW: Simple TextInputField without complex keyboard props
  const TextInputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    keyboardType = 'default',
    maxLength,
    editable = true,
    secureTextEntry = false,
    inputRef,
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Icon name={icon} size={20} color={AppTheme.primaryColor} style={styles.inputIcon} />
        <TextInput
          ref={inputRef}
          style={[
            styles.textInput,
            !editable && styles.disabledInput
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={editable}
          secureTextEntry={secureTextEntry}
          // Minimal props - let the system handle keyboard
        />
      </View>
    </View>
  );

  // NEW: Simple AutocompleteInput
  const AutocompleteInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    suggestions,
    showSuggestions,
    onSelectSuggestion,
    editable = true,
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Icon name={icon} size={20} color={AppTheme.primaryColor} style={styles.inputIcon} />
        <TextInput
          style={[
            styles.textInput,
            !editable && styles.disabledInput
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          editable={editable}
        />
      </View>
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView 
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="always"
          >
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => {
                  Keyboard.dismiss();
                  onSelectSuggestion(item);
                }}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  // Personal Information Step Component
  const PersonalInfoStep = () => (
    <View style={styles.stepContainer}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.stepContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.stepTitle}>
          {AppStrings.getString('personal_information', langCode)}
        </Text>
        <Text style={styles.stepSubtitle}>
          {AppStrings.getString('please_provide_basic_info', langCode)}
        </Text>

        <TextInputField
          label={AppStrings.getString('full_name', langCode)}
          value={name}
          onChangeText={setName}
          placeholder={AppStrings.getString('enter_full_name', langCode)}
          icon="person"
          inputRef={contactInputRef}
        />

        <TextInputField
          label={AppStrings.getString('contact_number', langCode)}
          value={contact}
          onChangeText={setContact}
          placeholder={AppStrings.getString('enter_mobile_number', langCode)}
          icon="phone"
          keyboardType="number-pad"
          maxLength={10}
          inputRef={contactInputRef}
        />

        <TextInputField
          label={AppStrings.getString('aadhaar_number', langCode)}
          value={aadhaar}
          onChangeText={setAadhaar}
          placeholder={AppStrings.getString('enter_aadhaar_number', langCode)}
          icon="credit-card"
          keyboardType="number-pad"
          maxLength={12}
          inputRef={aadhaarInputRef}
        />
      </ScrollView>
    </View>
  );

  // Address Information Step Component
  const AddressStep = () => (
    <View style={styles.stepContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.stepContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.stepTitle}>
          {AppStrings.getString('address_information', langCode)}
        </Text>
        <Text style={styles.stepSubtitle}>
          {AppStrings.getString('please_provide_address', langCode)}
        </Text>

        <TextInputField
          label={AppStrings.getString('state', langCode)}
          value={state}
          onChangeText={setState}
          placeholder={AppStrings.getString('your_state', langCode)}
          icon="account-balance"
          editable={false}
        />

        <AutocompleteInput
          label={AppStrings.getString('district', langCode)}
          value={district}
          onChangeText={handleDistrictChange}
          placeholder={AppStrings.getString('enter_district', langCode)}
          icon="flag"
          suggestions={districtSuggestions}
          showSuggestions={showDistrictSuggestions}
          onSelectSuggestion={selectDistrict}
        />

        <AutocompleteInput
          label={AppStrings.getString('taluka', langCode)}
          value={taluka}
          onChangeText={handleTalukaChange}
          placeholder={isDistrictSelected 
            ? AppStrings.getString('select_your_taluka', langCode)
            : AppStrings.getString('select_district_first', langCode)
          }
          icon="map"
          suggestions={talukaSuggestions}
          showSuggestions={showTalukaSuggestions}
          onSelectSuggestion={selectTaluka}
          editable={isDistrictSelected}
        />

        <TextInputField
          label={AppStrings.getString('village', langCode)}
          value={village}
          onChangeText={setVillage}
          placeholder={AppStrings.getString('enter_village', langCode)}
          icon="map"
          inputRef={villageInputRef}
        />

        <TextInputField
          label={AppStrings.getString('landmark', langCode)}
          value={landmark}
          onChangeText={setLandmark}
          placeholder={AppStrings.getString('enter_landmark', langCode)}
          icon="place"
          inputRef={landmarkInputRef}
        />

        <TextInputField
          label={AppStrings.getString('pincode', langCode)}
          value={pincode}
          onChangeText={setPincode}
          placeholder={AppStrings.getString('enter_pincode', langCode)}
          icon="pin-drop"
          keyboardType="number-pad"
          maxLength={6}
          inputRef={pincodeInputRef}
        />
      </ScrollView>
    </View>
  );

  // NEW: Dismiss keyboard when tapping outside
  const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {children}
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <DismissKeyboard>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {AppStrings.getString('registration', langCode)}
              </Text>
              <View style={styles.headerPlaceholder} />
            </View>

            <View style={styles.progressContainer}>
              <ProgressStep
                step={0}
                title={AppStrings.getString('personal_information', langCode)}
                icon="person"
                isSmallScreen={isSmallScreen}
                currentStep={currentStep}
              />
              <ProgressLine currentStep={currentStep} />
              <ProgressStep
                step={1}
                title={AppStrings.getString('address_information', langCode)}
                icon="location-on"
                isSmallScreen={isSmallScreen}
                currentStep={currentStep}
              />
            </View>

            <View style={styles.content}>
              {currentStep === 0 && <PersonalInfoStep />}
              {currentStep === 1 && <AddressStep />}
            </View>

            <View style={styles.footer}>
              <View style={styles.buttonContainer}>
                {currentStep > 0 && (
                  <TouchableOpacity
                    style={[styles.button, styles.outlineButton]}
                    onPress={previousStep}
                    disabled={isLoading}
                  >
                    <Text style={styles.outlineButtonText}>
                      {AppStrings.getString('previous', langCode)}
                    </Text>
                  </TouchableOpacity>
                )}
                
                {currentStep === 0 && (
                  <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={nextStep}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.primaryButtonText}>
                        {AppStrings.getString('next', langCode)}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
                
                {currentStep === 1 && (
                  <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={handleRegistration}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.primaryButtonText}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: AppTheme.primaryColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerPlaceholder: {
    width: 32,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.dividerColor,
  },
  progressStepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressIcon: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressText: {
    textAlign: 'center',
  },
  progressLine: {
    width: 20,
    height: 2,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  stepContent: {
    padding: 16,
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: AppTheme.textSecondaryColor,
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    padding: 12,
  },
  textInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 14,
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: '#666666',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginTop: 4,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#000000',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: AppTheme.primaryColor,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: AppTheme.primaryColor,
    marginRight: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: AppTheme.primaryColor,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FarmerRegistrationScreen;