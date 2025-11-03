import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApiService from '../../services/ApiService';
import AuthService from '../../services/AuthService';

const AppTheme = {
  primaryColor: '#2E7D32',
  backgroundColor: '#FFFFFF',
  textPrimaryColor: '#000000',
  textSecondaryColor: '#666666',
  successColor: '#4CAF50',
  errorColor: '#F44336',
  infoColor: '#2196F3',
};

// Updated TextInputField with proper keyboard handling
const TextInputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = 'default',
  secureTextEntry = false,
  maxLength,
  editable = true,
  inputRef,
  returnKeyType = 'done',
  onSubmitEditing = () => {},
  blurOnSubmit = true
}) => {
  return (
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
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
        />
      </View>
    </View>
  );
};

const LoginScreen = () => {
  const navigation = useNavigation();
  
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const [currentStep, setCurrentStep] = useState('mobile'); // 'mobile' or 'otp'
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  const { height } = Dimensions.get('window');
  const isSmallScreen = height < 700;

  // Refs for text inputs
  const mobileInputRef = useRef(null);
  const otpInputRef = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Step 1: Check if mobile number exists in database
  const checkMobileNumber = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Checking mobile number:', mobileNumber);
      
      const result = await ApiService.checkFarmerExists(mobileNumber);
      
      if (result.exists) {
        // Mobile number exists - show OTP field
        setShowOTPField(true);
        setCurrentStep('otp');
        Alert.alert('Success', 'Mobile number verified! Please enter OTP.');
      } else {
        // Mobile number doesn't exist - redirect to registration
        Alert.alert(
          'Account Not Found',
          'This mobile number is not registered. Would you like to register as a farmer?',
          [
            {
              text: 'Register',
              onPress: () => navigation.navigate('FarmerRegistration', { 
                initialContact: mobileNumber 
              }),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      }
    } catch (error) {
      console.error('Check mobile error:', error);
      Alert.alert('Error', 'Failed to check mobile number. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and login
  const verifyOTPAndLogin = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Verifying OTP for:', mobileNumber);
      
      const loginResult = await ApiService.verifyOTP(mobileNumber, otp);

      if (loginResult.success) {
        // Save user data to local storage
        await AuthService.saveUserData(loginResult.user);
        
        Alert.alert('Success', loginResult.message);
        
        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        });
      } else {
        Alert.alert('Error', loginResult.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToMobile = () => {
    setShowOTPField(false);
    setCurrentStep('mobile');
    setOtp('');
  };

  const handleSignUp = () => {
    navigation.navigate('FarmerRegistration');
  };

  const DemoCredentialsInfo = () => (
    <View style={styles.demoInfoContainer}>
      <View style={styles.demoInfoHeader}>
        <Icon name="info-outline" size={18} color={AppTheme.infoColor} />
        <Text style={styles.demoInfoTitle}>
          How it works
        </Text>
      </View>
      <Text style={styles.demoInfoText}>
        {`1. Enter your 10-digit mobile number\n2. System checks if you're registered\n3. If registered: Enter OTP to login\n4. If new: Redirect to registration`}
      </Text>
    </View>
  );

  const slideAnimation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.topSection, { flex: 3 }]}>
          <Animated.View 
            style={[
              styles.topContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnimation }]
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <Icon name="agriculture" size={isSmallScreen ? 50 : 60} color="#FFFFFF" />
            </View>
            
            <View style={{ height: isSmallScreen ? 16 : 24 }} />
            
            <Text style={styles.appTitle}>
              SmartFarmer
            </Text>
            
            <View style={{ height: 8 }} />
            
            <Text style={styles.appSubtitle}>
              Smart Farming Management
            </Text>
          </Animated.View>
        </View>

        <View style={[styles.bottomSection, { flex: -5 }]}>
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
              keyboardShouldPersistTaps="handled"
            >
              {/* Back Button for OTP Screen */}
              {showOTPField && (
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={goBackToMobile}
                >
                  <Icon name="arrow-back" size={24} color={AppTheme.primaryColor} />
                  <Text style={styles.backButtonText}>
                    Back to mobile number
                  </Text>
                </TouchableOpacity>
              )}

              <Text style={styles.welcomeTitle}>
                {showOTPField ? 'Enter OTP' : 'Welcome Back'}
              </Text>
              
              <View style={{ height: 8 }} />
              
              <Text style={styles.welcomeSubtitle}>
                {showOTPField 
                  ? `Enter the 6-digit code sent to ${mobileNumber}`
                  : 'Sign in to continue to your account'
                }
              </Text>
              
              <View style={{ height: isSmallScreen ? 20 : 32 }} />

              <View style={styles.form}>
                {/* Mobile Number Field */}
                {!showOTPField && (
                  <>
                    <TextInputField
                      label="Mobile Number"
                      value={mobileNumber}
                      onChangeText={setMobileNumber}
                      placeholder="Enter your 10-digit mobile number"
                      icon="phone"
                      keyboardType="number-pad"
                      maxLength={10}
                      inputRef={mobileInputRef}
                      returnKeyType="done"
                      blurOnSubmit={false}
                    />
                    
                    <View style={{ height: isSmallScreen ? 12 : 16 }} />
                    
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={checkMobileNumber}
                      disabled={isLoading || mobileNumber.length !== 10}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.primaryButtonText}>
                          Verify Mobile Number
                        </Text>
                      )}
                    </TouchableOpacity>

                    {/* Sign Up Button */}
                    <View style={{ height: isSmallScreen ? 12 : 16 }} />
                    
                    <TouchableOpacity
                      style={styles.outlineButton}
                      onPress={handleSignUp}
                      disabled={isLoading}
                    >
                      <Text style={styles.outlineButtonText}>
                        New User? Sign Up
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* OTP Field */}
                {showOTPField && (
                  <>
                    <TextInputField
                      label="OTP"
                      value={otp}
                      onChangeText={setOtp}
                      placeholder="Enter 6-digit OTP"
                      icon="lock"
                      keyboardType="number-pad"
                      maxLength={6}
                      inputRef={otpInputRef}
                      returnKeyType="done"
                      blurOnSubmit={false}
                    />
                    
                    <View style={{ height: isSmallScreen ? 12 : 16 }} />
                    
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={verifyOTPAndLogin}
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.primaryButtonText}>
                          Sign In
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>

              <View style={{ height: isSmallScreen ? 16 : 24 }} />

              <DemoCredentialsInfo />

            </ScrollView>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.primaryColor,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  topContent: {
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
    padding: 20,
  },
  appTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
  },
  appSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontSize: 16,
  },
  bottomSection: {
    backgroundColor: AppTheme.backgroundColor,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    flex: 1,
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
  welcomeTitle: {
    fontWeight: '600',
    color: AppTheme.textPrimaryColor,
    fontSize: 22,
  },
  welcomeSubtitle: {
    color: AppTheme.textSecondaryColor,
    fontSize: 14,
  },
  form: {
    width: '100%',
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
  primaryButton: {
    width: '100%',
    height: 50,
    backgroundColor: AppTheme.primaryColor,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  outlineButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: AppTheme.primaryColor,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineButtonText: {
    color: AppTheme.primaryColor,
    fontWeight: '600',
    fontSize: 16,
  },
  demoInfoContainer: {
    padding: 16,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.3)',
  },
  demoInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  demoInfoTitle: {
    color: AppTheme.infoColor,
    fontWeight: '600',
    marginLeft: 8,
  },
  demoInfoText: {
    color: AppTheme.textSecondaryColor,
    lineHeight: 18,
    fontSize: 12,
  },
});

export default LoginScreen;