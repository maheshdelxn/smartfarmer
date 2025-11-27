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
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

const AboutScreen = () => {
  const navigation = useNavigation();
  
  // App constants
  const appVersion = '1.0.0';
  const buildNumber = '123';

  // Section Component
  const Section = ({ title, icon, iconType = "MaterialCommunityIcons", content, children }) => {
    const IconComponent = 
      iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
      iconType === 'Feather' ? Feather : Ionicons;

    return (
      <View className="mb-4">
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-2">
            <IconComponent name={icon} size={20} color="#16a34a" />
          </View>
          <Text className="text-xl font-semibold text-green-800">{title}</Text>
        </View>
        <View className="bg-white rounded-3xl p-5 shadow-sm">
          {content ? (
            <Text className="text-sm text-gray-600 leading-6 text-justify">{content}</Text>
          ) : null}
          {children}
        </View>
      </View>
    );
  };

  // Feature Item Component
  const FeatureItem = ({ icon, iconType = "MaterialCommunityIcons", text }) => {
    const IconComponent = 
      iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
      iconType === 'Feather' ? Feather : Ionicons;

    return (
      <View className="flex-row items-center py-3">
        <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mr-3">
          <IconComponent name={icon} size={20} color="#16a34a" />
        </View>
        <Text className="text-sm text-gray-700 flex-1">{text}</Text>
      </View>
    );
  };

  // Contact Item Component
  const ContactItem = ({ icon, iconType = "Ionicons", label, value }) => {
    const IconComponent = 
      iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
      iconType === 'Feather' ? Feather : Ionicons;

    return (
      <View className="flex-row items-start py-3">
        <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mr-3">
          <IconComponent name={icon} size={20} color="#16a34a" />
        </View>
        <View className="flex-1">
          <Text className="text-xs text-gray-500 mb-1">{label}</Text>
          <Text className="text-sm font-medium text-gray-700">{value}</Text>
        </View>
      </View>
    );
  };

  // Social Media Links Component
  const SocialMediaLinks = () => (
    <View className="flex-row justify-center gap-3">
      <TouchableOpacity 
        className="w-14 h-14 bg-blue-500 rounded-2xl justify-center items-center shadow-sm"
        onPress={() => launchSocialMedia('facebook')}
      >
        <Ionicons name="logo-facebook" size={28} color="white" />
      </TouchableOpacity>
      <TouchableOpacity 
        className="w-14 h-14 bg-blue-400 rounded-2xl justify-center items-center shadow-sm"
        onPress={() => launchSocialMedia('twitter')}
      >
        <Ionicons name="logo-twitter" size={28} color="white" />
      </TouchableOpacity>
      <TouchableOpacity 
        className="w-14 h-14 bg-pink-500 rounded-2xl justify-center items-center shadow-sm"
        onPress={() => launchSocialMedia('instagram')}
      >
        <Ionicons name="logo-instagram" size={28} color="white" />
      </TouchableOpacity>
      <TouchableOpacity 
        className="w-14 h-14 bg-red-500 rounded-2xl justify-center items-center shadow-sm"
        onPress={() => launchSocialMedia('youtube')}
      >
        <Ionicons name="logo-youtube" size={28} color="white" />
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
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      {/* Custom Header */}
      <View className="bg-white flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity 
          className="w-10 h-10 bg-gray-100 rounded-xl justify-center items-center"
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-gray-800 text-xl font-semibold">About</Text>
        <View className="w-10" />
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 py-4">
          {/* App Logo and Basic Info */}
          <View className="bg-white rounded-3xl p-6 items-center shadow-sm mb-4">
            <View className="w-24 h-24 bg-green-600 rounded-3xl items-center justify-center mb-4">
              <MaterialCommunityIcons name="sprout" size={56} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
              Smart Farmer
            </Text>
            <View className="bg-green-50 px-4 py-2 rounded-xl mb-3">
              <Text className="text-sm text-green-700 font-medium">
                Version {appVersion} (Build {buildNumber})
              </Text>
            </View>
            <Text className="text-base text-gray-500 italic text-center">
              Empowering farmers with smart technology
            </Text>
          </View>

          {/* App Description */}
          <Section
            title="About App"
            icon="information-circle"
            iconType="Ionicons"
            content="Smart Farmer is a comprehensive mobile application designed to modernize farming practices. Our app provides farmers with real-time insights, market prices, weather alerts, and expert farming tips to maximize productivity and profitability."
          />

          {/* Key Features */}
          <Section
            title="Key Features"
            icon="star"
            iconType="Ionicons"
          >
            <FeatureItem
              icon="sprout"
              iconType="MaterialCommunityIcons"
              text="Crop Tracking & Management"
            />
            <FeatureItem
              icon="cash"
              iconType="Ionicons"
              text="Real-time Market Prices"
            />
            <FeatureItem
              icon="partly-sunny"
              iconType="Ionicons"
              text="Weather Alerts & Forecasts"
            />
            <FeatureItem
              icon="book"
              iconType="Feather"
              text="Expert Farming Tips"
            />
            <FeatureItem
              icon="brain"
              iconType="MaterialCommunityIcons"
              text="AI-powered Insights"
            />
            <FeatureItem
              icon="bar-chart"
              iconType="Feather"
              text="Yield Analysis & Reports"
            />
          </Section>

          {/* Development Team */}
          <Section
            title="Development Team"
            icon="people"
            iconType="Ionicons"
            content="Smart Farmer is developed by a passionate team of agricultural experts, software engineers, and data scientists dedicated to revolutionizing farming through technology. Our mission is to make advanced farming tools accessible to every farmer."
          />

          {/* Contact Information */}
          <Section
            title="Contact Us"
            icon="phone"
            iconType="Feather"
          >
            <ContactItem
              icon="mail"
              iconType="Ionicons"
              label="Email"
              value="support@smartfarmer.com"
            />
            <ContactItem
              icon="call"
              iconType="Ionicons"
              label="Phone"
              value="+1 (555) 123-4567"
            />
            <ContactItem
              icon="location"
              iconType="Ionicons"
              label="Address"
              value="Agricultural Tech Park, Farmville"
            />
            <ContactItem
              icon="globe"
              iconType="Feather"
              label="Website"
              value="www.smartfarmer.com"
            />
          </Section>

          {/* Social Media Links */}
          <View className="mb-4">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-2">
                <Ionicons name="share-social" size={20} color="#16a34a" />
              </View>
              <Text className="text-xl font-semibold text-green-800">Follow Us</Text>
            </View>
            <View className="bg-white rounded-3xl p-6 shadow-sm items-center">
              <SocialMediaLinks />
            </View>
          </View>

          {/* Legal Information */}
          <TouchableOpacity 
            className="bg-white border-2 border-green-600 rounded-3xl p-5 items-center shadow-sm flex-row justify-center"
            onPress={showLicenseDialog}
          >
            <Ionicons name="document-text" size={20} color="#16a34a" />
            <Text className="text-green-700 text-base font-semibold ml-2">Terms & Privacy Policy</Text>
          </TouchableOpacity>

          <View className="h-6" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;