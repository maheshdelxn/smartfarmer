// C:\Users\ADMIN\Desktop\SM-MOBILE\smartfarmer\src\screens\auth\LoginScreen.jsx

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
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    <View className="mb-4">
      <Text className="text-sm font-medium text-black mb-2">{label}</Text>
      <View className="flex-row items-center border border-gray-300 rounded-xl bg-white">
        <Icon name={icon} size={20} color="#2E7D32" className="p-3" />
        <TextInput
          ref={inputRef}
          className={`flex-1 p-3 text-base text-black ${!editable && 'bg-gray-100 text-gray-600'}`}
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
  const [isLoading, setIsLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
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
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
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

  const DemoCredentialsInfo = () => (
    <View className="p-4 bg-blue-50 rounded-xl border border-blue-300">
      <View className="flex-row items-center mb-2">
        <Icon name="info-outline" size={18} color="#2196F3" />
        <Text className="text-blue-600 font-semibold ml-2">
          How it works
        </Text>
      </View>
      <Text className="text-gray-500 leading-5 text-xs">
        {`1. Enter any 10-digit mobile number\n2. You'll be redirected to OTP screen\n3. Enter any 6-digit OTP to login\n4. Get redirected to home screen`}
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
        <View className="flex-3 justify-center items-center py-4">
          <Animated.View 
            className="items-center"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnimation }]
            }}
          >
            <View className="bg-white/20 rounded-full p-5">
              <Icon name="agriculture" size={isSmallScreen ? 50 : 60} color="#FFFFFF" />
            </View>
            
            <View style={{ height: isSmallScreen ? 16 : 24 }} />
            
            <Text className="text-white font-bold text-2xl text-center">
              SmartFarmer
            </Text>
            
            <View style={{ height: 8 }} />
            
            <Text className="text-white/90 text-center text-base">
              Smart Farming Management
            </Text>
          </Animated.View>
        </View>

        <View className="flex-5 bg-white rounded-t-3xl overflow-hidden">
          <Animated.View 
            className="flex-1"
            style={{
              transform: [{ translateY: slideAnimation }]
            }}
          >
            <ScrollView 
              className="flex-1"
              contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text className="font-semibold text-black text-xl">
                Welcome Back
              </Text>
              
              <View style={{ height: 8 }} />
              
              <Text className="text-gray-500 text-sm">
                Enter your mobile number to continue
              </Text>
              
              <View style={{ height: isSmallScreen ? 20 : 32 }} />

              <View className="w-full">
                {/* Mobile Number Field */}
                <TextInputField
                  label="Mobile Number"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  placeholder="Enter any 10-digit mobile number"
                  icon="phone"
                  keyboardType="number-pad"
                  maxLength={10}
                  inputRef={mobileInputRef}
                  returnKeyType="done"
                  blurOnSubmit={false}
                />
                
                <View style={{ height: isSmallScreen ? 12 : 16 }} />
                
                <TouchableOpacity
                  className="w-full h-12 bg-green-700 rounded-xl justify-center items-center"
                  onPress={navigateToOTP}
                  disabled={isLoading || mobileNumber.length !== 10}
                  style={{ opacity: (isLoading || mobileNumber.length !== 10) ? 0.6 : 1 }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text className="text-white font-semibold text-base">
                      Send OTP
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Sign Up Button */}
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