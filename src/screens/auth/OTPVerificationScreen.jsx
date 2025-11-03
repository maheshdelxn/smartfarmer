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
 
  // Get mobile number from navigation params
  const mobileNumber = route.params?.mobileNumber || '';
 
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
 
    // Auto-focus OTP input
    setTimeout(() => {
      otpInputRef.current?.focus();
    }, 500);
  }, []);
 
  const handleOtpChange = (text) => {
    // Only allow numbers and limit to 6 digits
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
      // Mock OTP resend
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
 
                {/* OTP Input Field - FIXED */}
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















// // C:\Users\ADMIN\Desktop\SM-MOBILE\smartfarmer\src\screens\auth\OTPVerificationScreen.jsx

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   SafeAreaView,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   Animated,
//   Dimensions,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AuthService from '../../services/AuthService';

// const AppTheme = {
//   primaryColor: '#2E7D32',
//   backgroundColor: '#FFFFFF',
//   textPrimaryColor: '#000000',
//   textSecondaryColor: '#666666',
//   dividerColor: '#E0E0E0',
//   successColor: '#4CAF50',
//   errorColor: '#F44336',
//   infoColor: '#2196F3',
// };

// const OTPVerificationScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
  
//   const [otp, setOtp] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
  
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(0)).current;
  
//   const { height } = Dimensions.get('window');
//   const isSmallScreen = height < 700;

//   // Get mobile number from navigation params
//   const mobileNumber = route.params?.mobileNumber || '';

//   useEffect(() => {
//     // Start animations
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1500,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 1,
//         duration: 1500,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   const verifyOTP = async () => {
//     if (!otp || otp.length !== 6) {
//       Alert.alert('Error', 'Please enter any 6-digit OTP');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       console.log('Verifying OTP:', { mobileNumber, otp });
      
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // Create mock user data
//       const mockUserData = {
//         id: Math.random().toString(36).substr(2, 9),
//         name: `Farmer ${mobileNumber}`,
//         mobileNumber: mobileNumber,
//         aadhaarNumber: 'XXXX XXXX XXXX',
//         contactNumber: mobileNumber,
//         village: 'Demo Village',
//         taluka: 'Demo Taluka',
//         district: 'Demo District',
//         pincode: '123456',
//         token: 'demo-token-' + Math.random().toString(36).substr(2, 16),
//         createdAt: new Date().toISOString(),
//       };

//       // Save user data to local storage
//       await AuthService.saveUserData(mockUserData);
      
//       console.log('OTP verification successful for mobile:', mobileNumber);
      
//       // Navigate to home screen
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'MainApp' }],
//       });
      
//     } catch (error) {
//       console.error('OTP verification error:', error);
//       Alert.alert('Error', 'OTP verification failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resendOTP = async () => {
//     setIsLoading(true);

//     try {
//       // Mock OTP resend
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       Alert.alert('Success', 'OTP resent successfully!');
//     } catch (error) {
//       console.error('OTP resend error:', error);
//       Alert.alert('Error', 'Failed to resend OTP. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const goBackToLogin = () => {
//     navigation.goBack();
//   };

//   const TextInputField = ({
//     label,
//     value,
//     onChangeText,
//     placeholder,
//     icon,
//     keyboardType = 'default',
//     maxLength,
//     editable = true,
//   }) => (
//     <View style={styles.inputContainer}>
//       <Text style={styles.inputLabel}>{label}</Text>
//       <View style={styles.inputWrapper}>
//         <Icon name={icon} size={20} color={AppTheme.primaryColor} style={styles.inputIcon} />
//         <TextInput
//           style={[
//             styles.textInput,
//             !editable && styles.disabledInput
//           ]}
//           value={value}
//           onChangeText={onChangeText}
//           placeholder={placeholder}
//           placeholderTextColor="#999"
//           keyboardType={keyboardType}
//           maxLength={maxLength}
//           editable={editable}
//           autoFocus={true}
//         />
//       </View>
//     </View>
//   );

//   const ActionButton = ({ 
//     title, 
//     onPress, 
//     loading, 
//     disabled,
//     variant = 'primary' 
//   }) => (
//     <TouchableOpacity
//       style={[
//         styles.actionButton,
//         variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
//         (loading || disabled) && styles.disabledButton
//       ]}
//       onPress={onPress}
//       disabled={loading || disabled}
//     >
//       {loading ? (
//         <ActivityIndicator 
//           size="small" 
//           color={variant === 'primary' ? '#FFFFFF' : AppTheme.primaryColor} 
//         />
//       ) : (
//         <Text style={[
//           styles.actionButtonText,
//           variant === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText
//         ]}>
//           {title}
//         </Text>
//       )}
//     </TouchableOpacity>
//   );

//   const slideAnimation = slideAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [30, 0],
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView 
//         style={styles.keyboardAvoid}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           {/* Top Section with Logo and Title */}
//           <Animated.View 
//             style={[
//               styles.topSection,
//               {
//                 opacity: fadeAnim,
//                 transform: [{ translateY: slideAnimation }]
//               }
//             ]}
//           >
//             <View style={styles.logoContainer}>
//               <Icon name="agriculture" size={isSmallScreen ? 80 : 120} color="#FFFFFF" />
//             </View>
            
//             <View style={{ height: isSmallScreen ? 14 : 16 }} />
            
//             <Text style={[
//               styles.appTitle,
//               { fontSize: isSmallScreen ? 24 : 28 }
//             ]}>
//               SmartFarmer
//             </Text>
            
//             <View style={{ height: 8 }} />
            
//             <Text style={[
//               styles.appSubtitle,
//               { fontSize: isSmallScreen ? 14 : 16 }
//             ]}>
//               Smart Farming Management
//             </Text>
//           </Animated.View>

//           {/* Bottom Form Section */}
//           <View style={styles.bottomSection}>
//             <Animated.View 
//               style={[
//                 styles.formContainer,
//                 {
//                   transform: [{ translateY: slideAnimation }]
//                 }
//               ]}
//             >
//               <ScrollView 
//                 style={styles.formScroll}
//                 contentContainerStyle={styles.formContent}
//                 showsVerticalScrollIndicator={false}
//               >
//                 {/* Back Button */}
//                 <TouchableOpacity 
//                   style={styles.backButton}
//                   onPress={goBackToLogin}
//                 >
//                   <Icon name="arrow-back" size={24} color={AppTheme.primaryColor} />
//                   <Text style={styles.backButtonText}>
//                     Back to login
//                   </Text>
//                 </TouchableOpacity>

//                 <Text style={[
//                   styles.screenTitle,
//                   { fontSize: isSmallScreen ? 20 : 22 }
//                 ]}>
//                   Enter OTP
//                 </Text>
                
//                 <View style={{ height: 8 }} />
                
//                 <Text style={styles.screenSubtitle}>
//                   {`Enter any 6-digit code to verify ${mobileNumber}`}
//                 </Text>
                
//                 <View style={{ height: isSmallScreen ? 20 : 32 }} />

//                 {/* OTP Form */}
//                 <TextInputField
//                   label="OTP"
//                   value={otp}
//                   onChangeText={setOtp}
//                   placeholder="Enter any 6-digit OTP"
//                   icon="lock-outline"
//                   keyboardType="number-pad"
//                   maxLength={6}
//                 />
                
//                 <View style={{ height: isSmallScreen ? 16 : 24 }} />
                
//                 <ActionButton
//                   title="Verify OTP"
//                   onPress={verifyOTP}
//                   loading={isLoading}
//                   disabled={!otp || otp.length !== 6}
//                 />
                
//                 <View style={{ height: isSmallScreen ? 12 : 16 }} />
                
//                 <TouchableOpacity
//                   style={styles.resendButton}
//                   onPress={resendOTP}
//                   disabled={isLoading}
//                 >
//                   <Text style={styles.resendButtonText}>
//                     Resend OTP
//                   </Text>
//                 </TouchableOpacity>

//                 {/* Demo Info */}
//                 <View style={styles.demoInfoContainer}>
//                   <View style={styles.demoInfoHeader}>
//                     <Icon name="info-outline" size={18} color={AppTheme.infoColor} />
//                     <Text style={styles.demoInfoTitle}>
//                       Demo Instructions
//                     </Text>
//                   </View>
//                   <Text style={styles.demoInfoText}>
//                     {`Enter any 6-digit number (e.g., 123456) to login and get redirected to home screen.`}
//                   </Text>
//                 </View>
//               </ScrollView>
//             </Animated.View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: AppTheme.primaryColor,
//   },
//   keyboardAvoid: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   topSection: {
//     alignItems: 'center',
//     paddingVertical: 24,
//     paddingHorizontal: 16,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   appTitle: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   appSubtitle: {
//     color: 'rgba(255, 255, 255, 0.9)',
//     textAlign: 'center',
//   },
//   bottomSection: {
//     flex: 1,
//     backgroundColor: AppTheme.backgroundColor,
//     borderTopLeftRadius: 32,
//     borderTopRightRadius: 32,
//     overflow: 'hidden',
//   },
//   formContainer: {
//     flex: 1,
//   },
//   formScroll: {
//     flex: 1,
//   },
//   formContent: {
//     padding: 24,
//     paddingBottom: 40,
//   },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingVertical: 8,
//   },
//   backButtonText: {
//     color: AppTheme.primaryColor,
//     fontWeight: '600',
//     fontSize: 14,
//     marginLeft: 8,
//   },
//   screenTitle: {
//     fontWeight: '600',
//     color: AppTheme.textPrimaryColor,
//   },
//   screenSubtitle: {
//     color: AppTheme.textSecondaryColor,
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: AppTheme.textPrimaryColor,
//     marginBottom: 8,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#DDD',
//     borderRadius: 12,
//     backgroundColor: '#FFFFFF',
//   },
//   inputIcon: {
//     padding: 12,
//   },
//   textInput: {
//     flex: 1,
//     padding: 12,
//     fontSize: 16,
//     color: AppTheme.textPrimaryColor,
//   },
//   disabledInput: {
//     backgroundColor: '#F5F5F5',
//     color: '#666666',
//   },
//   actionButton: {
//     width: '100%',
//     height: 50,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   primaryButton: {
//     backgroundColor: AppTheme.primaryColor,
//   },
//   secondaryButton: {
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: AppTheme.primaryColor,
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
//   actionButtonText: {
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   primaryButtonText: {
//     color: '#FFFFFF',
//   },
//   secondaryButtonText: {
//     color: AppTheme.primaryColor,
//   },
//   resendButton: {
//     padding: 12,
//     alignItems: 'center',
//   },
//   resendButtonText: {
//     color: AppTheme.primaryColor,
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   demoInfoContainer: {
//     marginTop: 24,
//     padding: 16,
//     backgroundColor: 'rgba(33, 150, 243, 0.1)',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(33, 150, 243, 0.3)',
//   },
//   demoInfoHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   demoInfoTitle: {
//     color: AppTheme.infoColor,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   demoInfoText: {
//     color: AppTheme.textSecondaryColor,
//     lineHeight: 18,
//     fontSize: 12,
//   },
// });

// export default OTPVerificationScreen;
