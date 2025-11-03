import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const AboutScreen = () => {
  const navigation = useNavigation();
  
  // App constants
  const appVersion = '1.0.0';
  const buildNumber = '123';

  // Section Component
  const Section = ({ title, icon, content, children }) => (
    <View className="bg-white rounded-xl p-5 mb-5 shadow-sm">
      <View className="flex-row items-center mb-3">
        <Text className="text-lg mr-2">{icon}</Text>
        <Text className="text-lg font-bold text-gray-800">{title}</Text>
      </View>
      {content ? (
        <Text className="text-sm text-gray-500 leading-5 text-justify">{content}</Text>
      ) : null}
      {children}
    </View>
  );

  // Feature Item Component
  const FeatureItem = ({ icon, text }) => (
    <View className="flex-row items-center py-2">
      <Text className="text-lg mr-3 w-6">{icon}</Text>
      <Text className="text-sm text-gray-700 flex-1">{text}</Text>
    </View>
  );

  // Contact Item Component
  const ContactItem = ({ icon, label, value }) => (
    <View className="flex-row items-start py-2">
      <Text className="text-base mr-3 w-5 mt-0.5">{icon}</Text>
      <View className="flex-1">
        <Text className="text-xs text-gray-500 mb-1">{label}</Text>
        <Text className="text-sm font-medium text-gray-700">{value}</Text>
      </View>
    </View>
  );

  // Social Media Links Component
  const SocialMediaLinks = () => (
    <View className="flex-row justify-center gap-4">
      <TouchableOpacity 
        className="w-12 h-12 bg-green-50 rounded-full justify-center items-center border border-green-100"
        onPress={() => launchSocialMedia('facebook')}
      >
        <Text className="text-xl">📘</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        className="w-12 h-12 bg-green-50 rounded-full justify-center items-center border border-green-100"
        onPress={() => launchSocialMedia('twitter')}
      >
        <Text className="text-xl">🐦</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        className="w-12 h-12 bg-green-50 rounded-full justify-center items-center border border-green-100"
        onPress={() => launchSocialMedia('instagram')}
      >
        <Text className="text-xl">📷</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        className="w-12 h-12 bg-green-50 rounded-full justify-center items-center border border-green-100"
        onPress={() => launchSocialMedia('youtube')}
      >
        <Text className="text-xl">📺</Text>
      </TouchableOpacity>
    </View>
  );

  // Action Functions
  const launchSocialMedia = (platform) => {
    const urls = {
      facebook: 'https://facebook.com/smartfarmer',
      twitter: 'https://twitter.com/smartfarmer',
      instagram: 'https://instagram.com/smartfarmer',
      youtube: 'https://youtube.com/smartfarmer'
    };
    
    const url = urls[platform];
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'Could not open social media app');
      });
    }
  };

  const showLicenseDialog = () => {
    Alert.alert(
      'Legal Information',
      `Terms of Service:\nBy using Smart Farmer, you agree to our terms of service which include proper usage guidelines and data handling policies.\n\nPrivacy Policy:\nWe are committed to protecting your privacy. Your data is securely stored and only used to provide you with better farming insights and services.`,
      [
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <StatusBar backgroundColor="#16a34a" barStyle="light-content" />
      
      {/* Custom Header */}
      <LinearGradient
        colors={['#16a34a', '#22c55e']}
        className="pt-12 pb-4 shadow-lg"
      >
        <View className="flex-row items-center justify-between px-4">
          <TouchableOpacity 
            className="w-10 h-10 bg-white/20 rounded-xl justify-center items-center"
            onPress={handleBack}
          >
            <Text className="text-white text-lg font-bold">←</Text>
          </TouchableOpacity>
          <Text className="text-white text-xl font-semibold">About</Text>
          <View className="w-10" />
        </View>
      </LinearGradient>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="p-5">
          {/* App Logo and Basic Info */}
          <View className="bg-white rounded-2xl p-6 items-center shadow-lg mb-6">
            <Text className="text-6xl mb-4">🌾</Text>
            <Text className="text-2xl font-bold text-green-800 text-center mb-2">
              Smart Farmer
            </Text>
            <Text className="text-sm text-gray-500 mb-3">
              Version {appVersion} (Build {buildNumber})
            </Text>
            <Text className="text-base text-gray-500 italic text-center">
              Empowering farmers with smart technology
            </Text>
          </View>

          {/* App Description */}
          <Section
            title="About App"
            icon="ℹ️"
            content="Smart Farmer is a comprehensive mobile application designed to modernize farming practices. Our app provides farmers with real-time insights, market prices, weather alerts, and expert farming tips to maximize productivity and profitability."
          />

          {/* Key Features */}
          <Section
            title="Key Features"
            icon="⭐"
          >
            <FeatureItem
              icon="🌱"
              text="Crop Tracking & Management"
            />
            <FeatureItem
              icon="💰"
              text="Real-time Market Prices"
            />
            <FeatureItem
              icon="🌤️"
              text="Weather Alerts & Forecasts"
            />
            <FeatureItem
              icon="📚"
              text="Expert Farming Tips"
            />
            <FeatureItem
              icon="🤖"
              text="AI-powered Insights"
            />
            <FeatureItem
              icon="📊"
              text="Yield Analysis & Reports"
            />
          </Section>

          {/* Development Team */}
          <Section
            title="Development Team"
            icon="👨‍💻"
            content="Smart Farmer is developed by a passionate team of agricultural experts, software engineers, and data scientists dedicated to revolutionizing farming through technology. Our mission is to make advanced farming tools accessible to every farmer."
          />

          {/* Contact Information */}
          <Section
            title="Contact Us"
            icon="📞"
          >
            <ContactItem
              icon="📧"
              label="Email"
              value="support@smartfarmer.com"
            />
            <ContactItem
              icon="📱"
              label="Phone"
              value="+1 (555) 123-4567"
            />
            <ContactItem
              icon="📍"
              label="Address"
              value="Agricultural Tech Park, Farmville"
            />
            <ContactItem
              icon="🌐"
              label="Website"
              value="www.smartfarmer.com"
            />
          </Section>

          {/* Social Media Links */}
          <View className="bg-white rounded-xl p-5 mb-5 shadow-sm items-center">
            <Text className="text-lg font-bold text-gray-800 mb-4">Follow Us</Text>
            <SocialMediaLinks />
          </View>

          {/* Legal Information */}
          <TouchableOpacity 
            className="bg-transparent p-4 items-center border border-green-600 rounded-xl mb-5"
            onPress={showLicenseDialog}
          >
            <Text className="text-green-600 text-base font-medium">Terms & Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;