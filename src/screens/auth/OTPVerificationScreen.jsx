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
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Mock services and constants - replace with your actual implementations
const AppStrings = {
  getString: (key, langCode = 'en') => {
    const strings = {
      'app_title': { en: 'SmartFarmer', hi: 'स्मार्टफार्मर' },
      'smart_farming_management': { en: 'Smart Farming Management', hi: 'स्मार्ट फार्मिंग प्रबंधन' },
      'mobile_verification': { en: 'Mobile Verification', hi: 'मोबाइल सत्यापन' },
      'enter_mobile_number': { en: 'Enter your mobile number to continue', hi: 'जारी रखने के लिए अपना मोबाइल नंबर दर्ज करें' },
      'enter_otp': { en: 'Enter OTP', hi: 'ओटीपी दर्ज करें' },
      'enter_otp_message': { en: 'Enter the 6-digit code sent to {number}', hi: '{number} पर भेजा गया 6-अंकीय कोड दर्ज करें' },
      'mobile_number': { en: 'Mobile Number', hi: 'मोबाइल नंबर' },
      'enter_mobile_number_hint': { en: 'Enter 10-digit mobile number', hi: '10-अंकीय मोबाइल नंबर दर्ज करें' },
      'otp': { en: 'OTP', hi: 'ओटीपी' },
      'enter_otp_hint': { en: 'Enter 6-digit OTP', hi: '6-अंकीय ओटीपी दर्ज करें' },
      'send_otp': { en: 'Send OTP', hi: 'ओटीपी भेजें' },
      'verify_otp': { en: 'Verify OTP', hi: 'ओटीपी सत्यापित करें' },
      'resend_otp': { en: 'Resend OTP', hi: 'ओटीपी पुनः भेजें' },
      'back_to_mobile_number': { en: 'Back to mobile number', hi: 'मोबाइल नंबर पर वापस' },
      'please_enter_mobile_number': { en: 'Please enter mobile number', hi: 'कृपया मोबाइल नंबर दर्ज करें' },
      'mobile_number_must_be_10_digits': { en: 'Mobile number must be 10 digits', hi: 'मोबाइल नंबर 10 अंकों का होना चाहिए' },
      'please_enter_valid_otp': { en: 'Please enter valid 6-digit OTP', hi: 'कृपया वैध 6-अंकीय ओटीपी दर्ज करें' },
    };
    return strings[key]?.[langCode] || key;
  }
};

const AppTheme = {
  primaryColor: '#2E7D32',
  backgroundColor: '#FFFFFF',
  textPrimaryColor: '#000000',
  textSecondaryColor: '#666666',
  dividerColor: '#E0E0E0',
  successColor: '#4CAF50',
  errorColor: '#F44336',
  infoColor: '#2196F3',
  primaryGradient: ['#2E7D32', '#1B5E20'],
};

const AppConstants = {
  roleFarmer: 'farmer',
  roleVerifier: 'verifier',
};

const OTPVerificationScreen = () => {
  const navigation = useNavigation();
  
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const [langCode, setLangCode] = useState('en');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  const { width, height } = Dimensions.get('window');
  const isSmallScreen = height < 700;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    // Load language preference
    // const loadLanguage = async () => {
    //   const savedLang = await SharedPrefsService.getLanguage();
    //   setLangCode(savedLang || 'en');
    // };
    // loadLanguage();
  }, []);

  const sendOTP = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      Alert.alert('Error', AppStrings.getString('mobile_number_must_be_10_digits', langCode));
      return;
    }

    setIsLoading(true);

    try {
      // Mock OTP sending - replace with your actual implementation
      console.log('Sending OTP to:', mobileNumber);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show OTP field after successful OTP send
      setShowOTPField(true);
      
      // Start background login check (optional)
      // loginWithContactInBackground(mobileNumber);
      
    } catch (error) {
      console.error('OTP send error:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', AppStrings.getString('please_enter_valid_otp', langCode));
      return;
    }

    setIsLoading(true);

    try {
      // Mock OTP verification - replace with your actual AuthService
      console.log('Verifying OTP:', { mobileNumber, otp });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful verification
      const verificationResult = {
        success: true,
        message: 'OTP verified successfully',
        data: {
          role: AppConstants.roleFarmer, // or AppConstants.roleVerifier
          userData: {
            id: '12345',
            name: 'Demo Farmer',
            mobile: mobileNumber,
          },
          token: 'demo-token-12345',
        }
      };

      if (verificationResult.success) {
        Alert.alert('Success', verificationResult.message);
        
        // Navigate based on role
        navigateBasedOnRole(verificationResult.data.role);
      } else {
        Alert.alert('Error', verificationResult.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      Alert.alert('Error', 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);

    try {
      // Mock OTP resend - replace with your actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'OTP resent successfully!');
    } catch (error) {
      console.error('OTP resend error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateBasedOnRole = (role) => {
    console.log('Navigating based on role:', role);

    let destination;
    switch (role.toLowerCase()) {
      case AppConstants.roleFarmer:
        destination = 'FarmerDashboard';
        break;
      case AppConstants.roleVerifier:
        destination = 'VerifierDashboard';
        break;
      default:
        console.log('Unknown role, defaulting to farmer dashboard');
        destination = 'FarmerDashboard';
    }

    navigation.reset({
      index: 0,
      routes: [{ name: destination }],
    });
  };

  const goBackToMobile = () => {
    setShowOTPField(false);
    setOtp('');
  };

  const TextInputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    keyboardType = 'default',
    maxLength,
    prefixText,
    editable = true,
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Icon name={icon} size={20} color={AppTheme.primaryColor} style={styles.inputIcon} />
        {prefixText && (
          <Text style={styles.prefixText}>{prefixText}</Text>
        )}
        <TextInput
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
        />
      </View>
    </View>
  );

  const ActionButton = ({ 
    title, 
    onPress, 
    loading, 
    disabled,
    variant = 'primary' 
  }) => (
    <TouchableOpacity
      style={[
        styles.actionButton,
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        (loading || disabled) && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#FFFFFF' : AppTheme.primaryColor} 
        />
      ) : (
        <Text style={[
          styles.actionButtonText,
          variant === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );

  const slideAnimation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Top Section with Logo and Title */}
          <Animated.View 
            style={[
              styles.topSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnimation }]
              }
            ]}
          >
            {/* Replace with your actual logo image */}
            <View style={styles.logoContainer}>
              <Icon name="agriculture" size={120} color="#FFFFFF" />
              {/* Or use actual image: */}
              {/* <Image 
                source={require('../../assets/images/smart-farmingLogo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              /> */}
            </View>
            
            <View style={{ height: isSmallScreen ? 14 : 16 }} />
            
            <Text style={[
              styles.appTitle,
              { fontSize: isSmallScreen ? 24 : 28 }
            ]}>
              {AppStrings.getString('app_title', langCode)}
            </Text>
            
            <View style={{ height: 8 }} />
            
            <Text style={[
              styles.appSubtitle,
              { fontSize: isSmallScreen ? 14 : 16 }
            ]}>
              {AppStrings.getString('smart_farming_management', langCode)}
            </Text>
          </Animated.View>

          {/* Bottom Form Section */}
          <View style={styles.bottomSection}>
            <Animated.View 
              style={[
                styles.formContainer,
                {
                  transform: [{ translateY: slideAnimation }]
                }
              ]}
            >
              <ScrollView 
                style={styles.formScroll}
                contentContainerStyle={styles.formContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Back Button for OTP Screen */}
                {showOTPField && (
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={goBackToMobile}
                  >
                    <Icon name="arrow-back" size={24} color={AppTheme.primaryColor} />
                    <Text style={styles.backButtonText}>
                      {AppStrings.getString('back_to_mobile_number', langCode)}
                    </Text>
                  </TouchableOpacity>
                )}

                <Text style={[
                  styles.screenTitle,
                  { fontSize: isSmallScreen ? 20 : 22 }
                ]}>
                  {showOTPField 
                    ? AppStrings.getString('enter_otp', langCode)
                    : AppStrings.getString('mobile_verification', langCode)
                  }
                </Text>
                
                <View style={{ height: 8 }} />
                
                <Text style={styles.screenSubtitle}>
                  {showOTPField 
                    ? AppStrings.getString('enter_otp_message', langCode).replace('{number}', mobileNumber)
                    : AppStrings.getString('enter_mobile_number', langCode)
                  }
                </Text>
                
                <View style={{ height: isSmallScreen ? 20 : 32 }} />

                {/* Mobile Number Form */}
                {!showOTPField && (
                  <>
                    <TextInputField
                      label={AppStrings.getString('mobile_number', langCode)}
                      value={mobileNumber}
                      onChangeText={setMobileNumber}
                      placeholder={AppStrings.getString('enter_mobile_number_hint', langCode)}
                      icon="phone"
                      keyboardType="phone-pad"
                      maxLength={10}
                      prefixText="+91 "
                    />
                    
                    <View style={{ height: isSmallScreen ? 16 : 24 }} />
                    
                    <ActionButton
                      title={AppStrings.getString('send_otp', langCode)}
                      onPress={sendOTP}
                      loading={isLoading}
                      disabled={!mobileNumber || mobileNumber.length !== 10}
                    />
                  </>
                )}

                {/* OTP Form */}
                {showOTPField && (
                  <>
                    <TextInputField
                      label={AppStrings.getString('otp', langCode)}
                      value={otp}
                      onChangeText={setOtp}
                      placeholder={AppStrings.getString('enter_otp_hint', langCode)}
                      icon="lock-outline"
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                    
                    <View style={{ height: isSmallScreen ? 16 : 24 }} />
                    
                    <ActionButton
                      title={AppStrings.getString('verify_otp', langCode)}
                      onPress={verifyOTP}
                      loading={isLoading}
                      disabled={!otp || otp.length !== 6}
                    />
                    
                    <View style={{ height: isSmallScreen ? 12 : 16 }} />
                    
                    <TouchableOpacity
                      style={styles.resendButton}
                      onPress={resendOTP}
                      disabled={isLoading}
                    >
                      <Text style={styles.resendButtonText}>
                        {AppStrings.getString('resend_otp', langCode)}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.primaryColor,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  appTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  appSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: AppTheme.backgroundColor,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  formContainer: {
    flex: 1,
  },
  formScroll: {
    flex: 1,
  },
  formContent: {
    padding: 24,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    color: AppTheme.primaryColor,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  screenTitle: {
    fontWeight: '600',
    color: AppTheme.textPrimaryColor,
  },
  screenSubtitle: {
    color: AppTheme.textSecondaryColor,
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: AppTheme.textPrimaryColor,
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
  prefixText: {
    fontSize: 16,
    color: AppTheme.textPrimaryColor,
    paddingHorizontal: 4,
  },
  textInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: AppTheme.textPrimaryColor,
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: '#666666',
  },
  actionButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: AppTheme.primaryColor,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: AppTheme.primaryColor,
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: AppTheme.primaryColor,
  },
  resendButton: {
    padding: 12,
    alignItems: 'center',
  },
  resendButtonText: {
    color: AppTheme.primaryColor,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default OTPVerificationScreen;