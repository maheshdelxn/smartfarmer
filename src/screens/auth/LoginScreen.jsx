import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import ApiService from '../../services/ApiService';
import AuthService from '../../services/AuthService';

// Updated TextInputField with Tailwind CSS
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
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-900 mb-2">{label}</Text>
      <View className="flex-row items-center border border-gray-300 rounded-xl bg-white">
        <View className="p-3">
          <Feather name={icon} size={20} color="#2E7D32" />
        </View>
        <TextInput
          ref={inputRef}
          className={`flex-1 p-3 text-base text-gray-900 ${!editable && 'bg-gray-100 text-gray-600'}`}
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

  // Auto-focus OTP field when it becomes visible
  useEffect(() => {
    if (showOTPField && otpInputRef.current) {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 300);
    }
  }, [showOTPField]);

  // Step 1: Check if mobile number exists in database
  const checkMobileNumber = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      navigation.navigate("OTPVerification")
      return;
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
    setOtp('');
  };

  const handleSignUp = () => {
    navigation.navigate('FarmerRegistration');
  };

  const DemoCredentialsInfo = () => (
    <View className="p-4 bg-blue-50 rounded-xl border border-blue-200">
      <View className="flex-row items-center mb-2">
        <Feather name="info" size={18} color="#2196F3" />
        <Text className="text-blue-600 font-semibold ml-2">
          How it works
        </Text>
      </View>
      <Text className="text-gray-600 text-xs leading-5">
        {`1. Enter your 10-digit mobile number\n2. System checks if you're registered\n3. If registered: Enter OTP to login\n4. If new: Redirect to registration`}
      </Text>
    </View>
  );

  const slideAnimation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <View className="flex-1 bg-green-700">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-[3] justify-center items-center py-4">
          <Animated.View 
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnimation }]
            }}
            className="items-center"
          >
            <View className="bg-white/20 rounded-full p-5">
              <Feather name="sun" size={isSmallScreen ? 50 : 60} color="#FFFFFF" />
            </View>
            
            <View style={{ height: isSmallScreen ? 16 : 24 }} />
            
            <Text className="text-white font-bold text-3xl text-center">
              SmartFarmer
            </Text>
            
            <View className="h-2" />
            
            <Text className="text-white/90 text-center text-base">
              Smart Farming Management
            </Text>
          </Animated.View>
        </View>

        <View className="flex-[5] bg-white rounded-t-[32px] overflow-hidden">
          <Animated.View 
            style={{
              transform: [{ translateY: slideAnimation }]
            }}
            className="flex-1"
          >
            <ScrollView 
              className="flex-1"
              contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Back Button for OTP Screen */}
              {showOTPField && (
                <TouchableOpacity 
                  className="flex-row items-center mb-4 py-2"
                  onPress={goBackToMobile}
                >
                  <Feather name="arrow-left" size={24} color="#2E7D32" />
                  <Text className="text-green-700 font-semibold text-sm ml-2">
                    Back to mobile number
                  </Text>
                </TouchableOpacity>
              )}

              <Text className="font-semibold text-gray-900 text-2xl">
                {showOTPField ? 'Enter OTP' : 'Welcome Back'}
              </Text>
              
              <View className="h-2" />
              
              <Text className="text-gray-600 text-sm">
                {showOTPField 
                  ? `Enter the 6-digit code sent to ${mobileNumber}`
                  : 'Sign in to continue to your account'
                }
              </Text>
              
              <View style={{ height: isSmallScreen ? 20 : 32 }} />

              <View className="w-full">
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
                      className={`w-full h-[50px] bg-green-700 rounded-xl justify-center items-center ${
                        (isLoading || mobileNumber.length !== 10) ? 'opacity-50' : ''
                      }`}
                      onPress={checkMobileNumber}
                      disabled={isLoading || mobileNumber.length !== 10}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text className="text-white font-semibold text-base">
                          Verify Mobile Number
                        </Text>
                      )}
                    </TouchableOpacity>

                    {/* Sign Up Button */}
                    <View style={{ height: isSmallScreen ? 12 : 16 }} />
                    
                    <TouchableOpacity
                      className={`w-full h-[50px] bg-transparent border-2 border-green-700 rounded-xl justify-center items-center ${
                        isLoading ? 'opacity-50' : ''
                      }`}
                      onPress={handleSignUp}
                      disabled={isLoading}
                    >
                      <Text className="text-green-700 font-semibold text-base">
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
                      className={`w-full h-[50px] bg-green-700 rounded-xl justify-center items-center ${
                        (isLoading || otp.length !== 6) ? 'opacity-50' : ''
                      }`}
                      onPress={verifyOTPAndLogin}
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text className="text-white font-semibold text-base">
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

export default LoginScreen;






















