import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

const HelpSupportScreen = () => {
  const navigation = useNavigation();

  // Header Card Component
  const HeaderCard = () => (
    <View className="bg-white rounded-3xl p-6 items-center shadow-sm mb-4">
      <View className="w-20 h-20 bg-green-100 rounded-3xl items-center justify-center mb-4">
        <Ionicons name="help-circle" size={48} color="#16a34a" />
      </View>
      <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
        How can we help you?
      </Text>
      <Text className="text-sm text-gray-500 text-center leading-6">
        Get instant help with our comprehensive support resources, FAQs, and direct contact options.
      </Text>
    </View>
  );

  // Section Component
  const Section = ({ title, icon, iconType = "MaterialCommunityIcons", children }) => {
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
        <View className="bg-white rounded-3xl shadow-sm overflow-hidden">
          {children}
        </View>
      </View>
    );
  };

  // Contact Item Component
  const ContactItem = ({ icon, iconType = "Ionicons", title, subtitle, onPress }) => {
    const IconComponent = 
      iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
      iconType === 'Feather' ? Feather : Ionicons;

    return (
      <TouchableOpacity className="flex-row items-center p-5" onPress={onPress}>
        <View className="w-12 h-12 bg-green-100 rounded-2xl justify-center items-center">
          <IconComponent name={icon} size={24} color="#16a34a" />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-base font-semibold text-gray-800 mb-1">{title}</Text>
          <Text className="text-sm text-gray-500">{subtitle}</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#9ca3af" />
      </TouchableOpacity>
    );
  };

  // FAQ Item Component
  const FaqItem = ({ question, answer }) => (
    <View className="p-5">
      <Text className="text-base font-semibold text-green-700 mb-2">{question}</Text>
      <Text className="text-sm text-gray-600 leading-6">{answer}</Text>
    </View>
  );

  // Video Tutorial Item Component
  const VideoTutorialItem = ({ title, duration, onPress }) => (
    <TouchableOpacity className="flex-row items-center p-5" onPress={onPress}>
      <View className="w-16 h-16 bg-purple-600 rounded-2xl justify-center items-center">
        <Ionicons name="play" size={28} color="white" />
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-base font-semibold text-gray-800 mb-1">{title}</Text>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={14} color="#6b7280" />
          <Text className="text-sm text-gray-500 ml-1">{duration}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={24} color="#9ca3af" />
    </TouchableOpacity>
  );

  // Guide Item Component
  const GuideItem = ({ icon, iconType = "MaterialCommunityIcons", title, description, onPress }) => {
    const IconComponent = 
      iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
      iconType === 'Feather' ? Feather : Ionicons;

    return (
      <TouchableOpacity className="flex-row items-center p-5" onPress={onPress}>
        <View className="w-12 h-12 bg-blue-100 rounded-2xl justify-center items-center">
          <IconComponent name={icon} size={24} color="#3b82f6" />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-base font-semibold text-gray-800 mb-1">{title}</Text>
          <Text className="text-sm text-gray-500">{description}</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#9ca3af" />
      </TouchableOpacity>
    );
  };

  // Divider Component
  const Divider = () => <View className="h-px bg-gray-100 mx-5" />;

  // Action Functions
  const launchEmail = async () => {
    const emailUrl = 'mailto:support@farmerapp.com?subject=Help Request from Farmer App&body=Describe your issue here...';
    try {
      await Linking.openURL(emailUrl);
    } catch (error) {
      Alert.alert('Error', 'Could not launch email app');
    }
  };

  const launchPhoneCall = async () => {
    const phoneUrl = 'tel:+18001234567';
    try {
      await Linking.openURL(phoneUrl);
    } catch (error) {
      Alert.alert('Error', 'Could not launch phone app');
    }
  };

  const startLiveChat = () => {
    Alert.alert(
      'Live Chat',
      'Connecting you to a support agent...',
      [{ text: 'OK', onPress: () => console.log('Live chat started') }]
    );
  };

  const openForum = async () => {
    const url = 'https://forum.farmerapp.com';
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      Alert.alert('Error', 'Could not open forum');
    }
  };

  const openFacebookGroup = async () => {
    const url = 'https://facebook.com/groups/farmerapp';
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      Alert.alert('Error', 'Could not open Facebook group');
    }
  };

  const playVideo = async (url) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      Alert.alert('Error', 'Could not play video');
    }
  };

  const openPdfGuide = async () => {
    const url = 'https://www.fao.org/fileadmin/templates/nr/sustainability_pathways/docs/Compilation_techniques_organic_agriculture_rev.pdf';
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      Alert.alert('Error', 'Could not open PDF');
    }
  };

  const reportProblem = () => {
    Alert.alert(
      'Report Problem',
      'This feature will allow you to report any issues you encounter with the app.',
      [{ text: 'OK' }]
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
        <Text className="text-gray-800 text-xl font-semibold">Help & Support</Text>
        <View className="w-10" />
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 py-4">
          <HeaderCard />
          
          {/* Quick Help Section */}
          <Section title="Quick Help" icon="flash" iconType="Ionicons">
            <FaqItem
              question="How do I reset my password?"
              answer="Go to Profile > Settings > Change Password. You'll receive a reset link on your registered email."
            />
            <Divider />
            <FaqItem
              question="How to report a crop issue?"
              answer="Navigate to the 'My Crops' section, select the affected crop, and tap 'Report Issue'."
            />
            <Divider />
            <FaqItem
              question="Where can I see market prices?"
              answer="The 'Market' tab shows real-time prices for your region. You can filter by crop type."
            />
            <Divider />
            <FaqItem
              question="How to contact support?"
              answer="Use the 'Contact Support' section in this help screen or call our 24/7 helpline."
            />
          </Section>

          {/* Video Tutorials Section */}
          <Section title="Video Tutorials" icon="video" iconType="Feather">
            <VideoTutorialItem
              title="Getting Started with Farmer App"
              duration="5:23"
              onPress={() => playVideo('https://youtube.com/shorts/fy0SUhxY0KU?si=VgPNAi0SORWKkHAk')}
            />
            <Divider />
            <VideoTutorialItem
              title="Crop Management Basics"
              duration="8:45"
              onPress={() => playVideo('https://youtu.be/farmer-app-crops')}
            />
            <Divider />
            <VideoTutorialItem
              title="Market Price Analysis"
              duration="6:12"
              onPress={() => playVideo('https://youtu.be/farmer-app-market')}
            />
          </Section>

          {/* User Guide Section */}
          <Section title="User Guide" icon="book-open" iconType="Feather">
            <GuideItem
              icon="sprout"
              iconType="MaterialCommunityIcons"
              title="Crop Management Guide"
              description="Complete guide to adding and tracking crops"
              onPress={openPdfGuide}
            />
            <Divider />
            <GuideItem
              icon="chart-line"
              iconType="MaterialCommunityIcons"
              title="Market Trends Handbook"
              description="Understanding and using market price data"
              onPress={openPdfGuide}
            />
            <Divider />
            <GuideItem
              icon="settings"
              iconType="Ionicons"
              title="App Settings Manual"
              description="Customizing your app experience"
              onPress={openPdfGuide}
            />
          </Section>

          {/* Contact Support Section */}
          <Section title="Contact Support" icon="phone" iconType="Feather">
            <ContactItem
              icon="mail"
              iconType="Ionicons"
              title="Email Us"
              subtitle="support@farmerapp.com"
              onPress={launchEmail}
            />
            <Divider />
            <ContactItem
              icon="call"
              iconType="Ionicons"
              title="Call Us"
              subtitle="+1 (800) 123-4567"
              onPress={launchPhoneCall}
            />
            <Divider />
            <ContactItem
              icon="chatbubbles"
              iconType="Ionicons"
              title="Live Chat"
              subtitle="Available 24/7"
              onPress={startLiveChat}
            />
          </Section>

          {/* Community Section */}
          <Section title="Community" icon="people" iconType="Ionicons">
            <ContactItem
              icon="forum"
              iconType="MaterialCommunityIcons"
              title="Community Forum"
              subtitle="Join discussions with other farmers"
              onPress={openForum}
            />
            <Divider />
            <ContactItem
              icon="logo-facebook"
              iconType="Ionicons"
              title="Facebook Group"
              subtitle="Connect with our farming community"
              onPress={openFacebookGroup}
            />
          </Section>

          {/* Report Problem Button */}
          <TouchableOpacity 
            className="flex-row items-center justify-center bg-red-50 border-2 border-red-200 rounded-3xl p-5 shadow-sm"
            onPress={reportProblem}
          >
            <Ionicons name="bug" size={24} color="#ef4444" />
            <Text className="text-base font-semibold text-red-600 ml-2">Report a Problem</Text>
          </TouchableOpacity>

          <View className="h-6" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupportScreen;