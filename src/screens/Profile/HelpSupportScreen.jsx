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
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';

const HelpSupportScreen = () => {
  const navigation = useNavigation();

  // Header Card Component
  const HeaderCard = () => (
    <View className="bg-white rounded-2xl p-5 items-center shadow-lg mb-6">
      <Text className="text-5xl mb-4">❓</Text>
      <Text className="text-xl font-bold text-green-800 text-center mb-2">
        How can we help you?
      </Text>
      <Text className="text-sm text-gray-500 text-center leading-5">
        Get instant help with our comprehensive support resources, FAQs, and direct contact options.
      </Text>
    </View>
  );

  // Section Component
  const Section = ({ title, icon, children }) => (
    <View className="bg-white rounded-xl shadow-sm mb-6">
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <Text className="text-lg mr-2">{icon}</Text>
        <Text className="text-lg font-bold text-gray-800">{title}</Text>
      </View>
      <View className="p-2">
        {children}
      </View>
    </View>
  );

  // Contact Item Component
  const ContactItem = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity className="flex-row items-center p-3 rounded-lg" onPress={onPress}>
      <View className="w-10 h-10 bg-green-50 rounded-lg justify-center items-center mr-4">
        <Text className="text-lg">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-800 mb-1">{title}</Text>
        <Text className="text-sm text-gray-500">{subtitle}</Text>
      </View>
      <Text className="text-lg text-gray-400 ml-2">›</Text>
    </TouchableOpacity>
  );

  // FAQ Item Component
  const FaqItem = ({ question, answer }) => (
    <View className="p-3">
      <Text className="text-base font-bold text-green-600 mb-2">{question}</Text>
      <Text className="text-sm text-gray-500 leading-5">{answer}</Text>
    </View>
  );

  // Video Tutorial Item Component
  const VideoTutorialItem = ({ title, duration, onPress }) => (
    <TouchableOpacity className="flex-row items-center p-3 rounded-lg" onPress={onPress}>
      <View className="w-20 h-15 bg-gray-100 rounded-lg justify-center items-center mr-4">
        <Text className="text-lg">▶️</Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-800 mb-1">{title}</Text>
        <View className="flex-row items-center">
          <Text className="text-xs mr-1">⏱️</Text>
          <Text className="text-sm text-gray-500">{duration}</Text>
        </View>
      </View>
      <Text className="text-lg text-green-600 ml-2">▶</Text>
    </TouchableOpacity>
  );

  // Guide Item Component
  const GuideItem = ({ icon, title, description, onPress }) => (
    <TouchableOpacity className="flex-row items-center p-3 rounded-lg" onPress={onPress}>
      <View className="w-10 h-10 bg-green-50 rounded-lg justify-center items-center mr-4">
        <Text className="text-lg">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-800 mb-1">{title}</Text>
        <Text className="text-sm text-gray-500">{description}</Text>
      </View>
      <Text className="text-lg text-gray-400 ml-2">›</Text>
    </TouchableOpacity>
  );

  // Divider Component
  const Divider = () => <View className="h-px bg-gray-100 mx-3" />;

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
          <Text className="text-white text-xl font-semibold">Help & Support</Text>
          <View className="w-10" />
        </View>
      </LinearGradient>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="p-5">
          <HeaderCard />
          
          {/* Quick Help Section */}
          <Section title="Quick Help" icon="⚡">
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
          <Section title="Video Tutorials" icon="🎬">
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
          <Section title="User Guide" icon="📚">
            <GuideItem
              icon="🌱"
              title="Crop Management Guide"
              description="Complete guide to adding and tracking crops"
              onPress={openPdfGuide}
            />
            <Divider />
            <GuideItem
              icon="📊"
              title="Market Trends Handbook"
              description="Understanding and using market price data"
              onPress={openPdfGuide}
            />
            <Divider />
            <GuideItem
              icon="⚙️"
              title="App Settings Manual"
              description="Customizing your app experience"
              onPress={openPdfGuide}
            />
          </Section>

          {/* Contact Support Section */}
          <Section title="Contact Support" icon="📞">
            <ContactItem
              icon="📧"
              title="Email Us"
              subtitle="support@farmerapp.com"
              onPress={launchEmail}
            />
            <Divider />
            <ContactItem
              icon="📱"
              title="Call Us"
              subtitle="+1 (800) 123-4567"
              onPress={launchPhoneCall}
            />
            <Divider />
            <ContactItem
              icon="💬"
              title="Live Chat"
              subtitle="Available 24/7"
              onPress={startLiveChat}
            />
          </Section>

          {/* Community Section */}
          <Section title="Community" icon="👥">
            <ContactItem
              icon="💬"
              title="Community Forum"
              subtitle="Join discussions with other farmers"
              onPress={openForum}
            />
            <Divider />
            <ContactItem
              icon="👥"
              title="Facebook Group"
              subtitle="Connect with our farming community"
              onPress={openFacebookGroup}
            />
          </Section>

          {/* Report Problem Button */}
          <TouchableOpacity 
            className="flex-row items-center justify-center bg-red-50 border border-red-200 rounded-xl p-4 mt-2"
            onPress={reportProblem}
          >
            <Text className="text-lg mr-2">🐛</Text>
            <Text className="text-base font-medium text-red-600">Report a Problem</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupportScreen;