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
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

 
const OTPVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const otpInputRef = useRef(null);

  const { height } = Dimensions.get('window');
  const isSmallScreen = height < 700;

  const mobileNumber = route.params?.mobileNumber || '';

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
      otpInputRef.current?.focus();
    }, 500);
  }, []);

  const handleOtpChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 6) {
      setOtp(numericText);
    }
  };

  const verifyOTP = async () => {
  if (!otp || otp.length !== 6) {
    Alert.alert('Error', 'Please enter a 6-digit OTP');
    return;
  }

  setIsLoading(true);

  try {
    console.log('Verifying OTP:', { mobileNumber, otp });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('OTP verification successful for mobile:', mobileNumber);
    
    // Navigate directly without storing any data
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainApp' }],
    });
    
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'OTP resent successfully!');
    } catch (error) {
      console.error('OTP resend error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToLogin = () => {
    navigation.goBack();
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Top Section with Logo and Title */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnimation }]
            }}
            className="items-center py-6 px-4"
          >
            <View className="items-center justify-center">
              <Feather name="sun" size={isSmallScreen ? 80 : 120} color="#FFFFFF" />
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
                {/* Back Button */}
                <TouchableOpacity
                  className="flex-row items-center mb-4 py-2"
                  onPress={goBackToLogin}
                >
                  <Feather name="arrow-left" size={24} color="#2E7D32" />
                  <Text className="text-green-700 font-semibold text-sm ml-2">
                    Back to login
                  </Text>
                </TouchableOpacity>

                <Text className="font-semibold text-gray-900" style={{ fontSize: isSmallScreen ? 20 : 22 }}>
                  Enter OTP
                </Text>
                <View className="h-2" />
                <Text className="text-gray-600 text-sm leading-5">
                  {`Enter any 6-digit code to verify ${mobileNumber}`}
                </Text>
                <View style={{ height: isSmallScreen ? 20 : 32 }} />

                {/* OTP Input Field */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-900 mb-2">OTP</Text>
                  <View className="flex-row items-center border border-gray-300 rounded-xl bg-white">
                    <View className="p-3">
                      <Feather name="lock" size={20} color="#2E7D32" />
                    </View>
                    <TextInput
                      ref={otpInputRef}
                      className="flex-1 p-3 text-base text-gray-900"
                      value={otp}
                      onChangeText={handleOtpChange}
                      placeholder="Enter any 6-digit OTP"
                      placeholderTextColor="#999"
                      keyboardType="number-pad"
                      maxLength={6}
                      returnKeyType="done"
                      onSubmitEditing={verifyOTP}
                    />
                  </View>
                </View>

                <View style={{ height: isSmallScreen ? 16 : 24 }} />
                <TouchableOpacity
                  className={`w-full h-[50px] bg-green-700 rounded-xl justify-center items-center ${
                    (isLoading || !otp || otp.length !== 6) ? 'opacity-50' : ''
                  }`}
                  onPress={verifyOTP}
                  disabled={isLoading || !otp || otp.length !== 6}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text className="text-white font-semibold text-base">
                      Verify OTP
                    </Text>
                  )}
                </TouchableOpacity>

                <View style={{ height: isSmallScreen ? 12 : 16 }} />
                <TouchableOpacity
                  className="p-3 items-center"
                  onPress={resendOTP}
                  disabled={isLoading}
                >
                  <Text className="text-green-700 font-semibold text-base">
                    Resend OTP
                  </Text>
                </TouchableOpacity>

                {/* Demo Info */}
                <View className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <View className="flex-row items-center mb-2">
                    <Feather name="info" size={18} color="#2196F3" />
                    <Text className="text-blue-600 font-semibold ml-2">
                      Demo Instructions
                    </Text>
                  </View>
                  <Text className="text-gray-600 text-xs leading-5">
                    {`Enter any 6-digit number (e.g., 123456) to login and get redirected to home screen.`}
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

export default OTPVerificationScreen;
