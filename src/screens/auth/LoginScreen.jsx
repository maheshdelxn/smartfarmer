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

  // Navigate to OTP screen with mobile number
  const navigateToOTP = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Navigating to OTP screen for:', mobileNumber);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to OTP screen with mobile number
      navigation.navigate('OTPVerification', { 
        mobileNumber: mobileNumber 
      });
      
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Failed to proceed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('FarmerRegistration');
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
          {/* Top Section with Logo and Title - MATCHING OTP SCREEN SIZE */}
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
                  Enter your mobile number to continue
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
                      onChangeText={setMobileNumber}
                      placeholder="Enter any 10-digit mobile number"
                      placeholderTextColor="#999"
                      keyboardType="number-pad"
                      maxLength={10}
                      returnKeyType="done"
                      onSubmitEditing={navigateToOTP}
                    />
                  </View>
                </View>

                <View style={{ height: isSmallScreen ? 16 : 24 }} />
                <TouchableOpacity
                  className={`w-full h-[50px] bg-green-700 rounded-xl justify-center items-center ${
                    (isLoading || !mobileNumber || mobileNumber.length !== 10) ? 'opacity-50' : ''
                  }`}
                  onPress={navigateToOTP}
                  disabled={isLoading || !mobileNumber || mobileNumber.length !== 10}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text className="text-white font-semibold text-base">
                      Send OTP
                    </Text>
                  )}
                </TouchableOpacity>

                <View style={{ height: isSmallScreen ? 12 : 16 }} />
                <TouchableOpacity
                  className="w-full h-12 bg-transparent border-2 border-green-700 rounded-xl justify-center items-center"
                  onPress={handleSignUp}
                  disabled={isLoading}
                  style={{ opacity: isLoading ? 0.6 : 1 }}
                >
                  <Text className="text-green-700 font-semibold text-base">
                    New User? Sign Up
                  </Text>
                </TouchableOpacity>

                {/* Demo Info */}
                <View className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <View className="flex-row items-center mb-2">
                    <Feather name="info" size={18} color="#2196F3" />
                    <Text className="text-blue-600 font-semibold ml-2">
                      How it works
                    </Text>
                  </View>
                  <Text className="text-gray-600 text-xs leading-5">
                    {`1. Enter any 10-digit mobile number\n2. You'll be redirected to OTP screen\n3. Enter any 6-digit OTP to login\n4. Get redirected to home screen`}
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