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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';

// API Configuration
const API_CONFIG = {
  BASE_URL: 'http://192.168.1.17:1000/api',
  ENDPOINTS: {
    LOGIN: '/auth/mobile-user/loginByContact',
  }
};

const LoginScreen = () => {
  const navigation = useNavigation();
  
  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  const { height } = Dimensions.get('window');
  const isSmallScreen = height < 700;

  // Refs for text inputs
  const mobileInputRef = useRef(null);

  useEffect(() => {
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

    setTimeout(() => {
      mobileInputRef.current?.focus();
    }, 500);
  }, []);

  // Handle mobile number input - allow only numbers and limit to 10 digits
  const handleMobileNumberChange = (text) => {
    // Remove any non-digit characters
    const cleanedText = text.replace(/[^0-9]/g, '');
    // Limit to 10 digits
    if (cleanedText.length <= 10) {
      setMobileNumber(cleanedText);
    }
  };

  // Backend API Integration - Login with mobile number using QUERY PARAMETERS
  // In your LoginScreen.js - Update the handleLogin function
const handleLogin = async () => {
  if (!mobileNumber || mobileNumber.length !== 10) {
    Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
    return;
  }

  setIsLoading(true);

  try {
    console.log('Sending login request for:', mobileNumber);
    
    // Backend expects query parameters, not request body
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}?contact=${mobileNumber}`;
    
    console.log('Request URL:', url);
    
    // BACKEND API CALL - Mobile Login with QUERY PARAMETERS
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    
    let data;
    const responseText = await response.text();
    
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.log('Raw response:', responseText);
      throw new Error('Invalid JSON response from server');
    }

    console.log('Response data:', data);

    if (!response.ok) {
      // Handle 409 Conflict - Number exists but needs different handling
      if (response.status === 409) {
        Alert.alert(
          'Validation Error',
          data.message || 'Please check your mobile number format'
        );
        return;
      }
      
      // Check if user doesn't exist
      if (response.status === 401 || response.status === 404) {
        Alert.alert(
          'User Not Found',
          `The mobile number ${mobileNumber} is not registered. Would you like to sign up?`,
          [
            {
              text: 'Sign Up',
              onPress: () => navigation.navigate('FarmerRegistration', { initialContact: mobileNumber })
            },
            {
              text: 'Try Another Number',
              onPress: () => {
                setMobileNumber('');
                mobileInputRef.current?.focus();
              },
              style: 'cancel'
            }
          ]
        );
        return;
      }
      
      throw new Error(data.message || `Login failed with status: ${response.status}`);
    }

    console.log('Login successful, navigating to OTP:', data);
    
    // ✅ CHANGED: Navigate to OTP screen instead of directly to home
    navigation.navigate('OTPVerification', { 
      mobileNumber: mobileNumber,
      userData: data.user || data.data || { contact: mobileNumber, role: 'farmer' },
      token: data.token
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    // Handle specific error types
    if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
      Alert.alert(
        'Network Error',
        'Unable to connect to server. Please check your internet connection and try again.'
      );
    } else {
      Alert.alert('Login Error', error.message || 'Failed to login. Please try again.');
    }
  } finally {
    setIsLoading(false);
  }
};

  // Alternative: Try with GET request (since it's using query parameters)
  const handleLoginWithGet = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Sending GET login request for:', mobileNumber);
      
      // Try with GET method since we're using query parameters
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}?contact=${mobileNumber}`;
      
      console.log('GET Request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET', // Try GET instead of POST
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('GET Response status:', response.status);
      
      const data = await response.json();
      console.log('GET Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `GET login failed with status: ${response.status}`);
      }

      // Handle successful login - USE 'HomeScreen' consistently
      navigation.navigate('HomeScreen', { 
        user: data.user || data.data || { contact: mobileNumber, role: 'farmer' },
        token: data.token
      });
      
    } catch (error) {
      console.error('GET API Error:', error);
      Alert.alert('Login Error', error.message || 'Failed to login with GET. Please try POST method.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('FarmerRegistration', { preFilledMobile: mobileNumber });
  };

  const slideAnimation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <View className="flex-1 bg-green-700">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Section with Logo and Title */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnimation }]
            }}
            className="items-center py-6 px-4"
          >
            <View className="items-center justify-center">
              <Icon name="agriculture" size={isSmallScreen ? 80 : 120} color="#FFFFFF" />
            </View>
            <View style={{ height: isSmallScreen ? 14 : 16 }} />
            <Text className="text-white font-bold text-center" style={{ fontSize: isSmallScreen ? 24 : 28 }}>
              SmartFarmer
            </Text>
            <View className="h-2" />
            <Text className="text-white/90 text-center" style={{ fontSize: isSmallScreen ? 14 : 16 }}>
              Smart Farming Management
            </Text>
          </Animated.View>

          {/* Bottom Form Section */}
          <View className="flex-1 bg-white rounded-t-[32px] overflow-hidden">
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
                <Text className="font-semibold text-gray-900" style={{ fontSize: isSmallScreen ? 20 : 22 }}>
                  Welcome Back
                </Text>
                <View className="h-2" />
                <Text className="text-gray-600 text-sm leading-5">
                  Enter your registered mobile number to continue
                </Text>
                <View style={{ height: isSmallScreen ? 20 : 32 }} />

                {/* Mobile Number Input Field */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-900 mb-2">Mobile Number</Text>
                  <View className="flex-row items-center border border-gray-300 rounded-xl bg-white">
                    <View className="p-3">
                      <Feather name="phone" size={20} color="#2E7D32" />
                    </View>
                    <TextInput
                      ref={mobileInputRef}
                      className="flex-1 p-3 text-base text-gray-900"
                      value={mobileNumber}
                      onChangeText={handleMobileNumberChange} // Fixed: Use the proper handler
                      placeholder="Enter your 10-digit mobile number"
                      placeholderTextColor="#999"
                      keyboardType="number-pad"
                      maxLength={10}
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                    />
                    {mobileNumber.length === 10 && ( // Fixed: Changed from 14 to 10
                      <View className="pr-3">
                        <Feather name="check-circle" size={20} color="#22c55e" />
                      </View>
                    )}
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">
                    {mobileNumber.length}/10 digits entered
                  </Text>
                </View>

                <View style={{ height: isSmallScreen ? 16 : 24 }} />
                
                {/* Main Login Button - POST with query parameters */}
                <TouchableOpacity
                  className={`w-full h-[50px] bg-green-700 rounded-xl justify-center items-center ${
                    (isLoading || !mobileNumber || mobileNumber.length !== 10) ? 'opacity-50' : ''
                  }`}
                  onPress={handleLogin}
                  disabled={isLoading || !mobileNumber || mobileNumber.length !== 10}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text className="text-white font-semibold text-base">
                      {isLoading ? 'Checking...' : 'Continue'}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Alternative GET Method Button */}
                {/* <View style={{ height: isSmallScreen ? 12 : 16 }} />
                <TouchableOpacity
                  className="w-full h-12 bg-blue-600 rounded-xl justify-center items-center"
                  onPress={handleLoginWithGet}
                  disabled={isLoading || !mobileNumber || mobileNumber.length !== 10}
                >
                  <Text className="text-white font-semibold text-base">
                    Try GET Method
                  </Text>
                </TouchableOpacity>

                <View style={{ height: isSmallScreen ? 12 : 16 }} /> */}
                
                {/* Sign Up Button */}
                <TouchableOpacity
                  className="w-full h-12 bg-transparent border-2 border-green-700 mt-5 rounded-xl justify-center items-center"
                  onPress={handleSignUp}
                  disabled={isLoading}
                  style={{ opacity: isLoading ? 0.6 : 1 }}
                >
                  <Text className="text-green-700 font-semibold text-base">
                    New User? Sign Up
                  </Text>
                </TouchableOpacity>

                {/* Info Section */}
                <View className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <View className="flex-row items-center mb-2">
                    <Feather name="info" size={16} color="#3b82f6" />
                    <Text className="text-blue-700 font-medium ml-2 text-sm">
                      Backend Configuration
                    </Text>
                  </View>
                  <Text className="text-blue-600 text-xs leading-5">
                    {`• Using query parameters: ?contact=MOBILE_NUMBER\n• Try both POST and GET methods\n• Contact number sent in URL, not request body`}
                  </Text>
                </View>
              </ScrollView>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;