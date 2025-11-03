import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const AboutScreen = ({ navigation }) => {
  // App constants
  const appVersion = '1.0.0';
  const buildNumber = '123';

  // Section Component
  const Section = ({ title, icon, content, children }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {content ? (
        <Text style={styles.sectionContent}>{content}</Text>
      ) : null}
      {children}
    </View>
  );

  // Feature Item Component
  const FeatureItem = ({ icon, text }) => (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );

  // Contact Item Component
  const ContactItem = ({ icon, label, value }) => (
    <View style={styles.contactItem}>
      <Text style={styles.contactIcon}>{icon}</Text>
      <View style={styles.contactContent}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
    </View>
  );

  // Social Media Links Component
  const SocialMediaLinks = () => (
    <View style={styles.socialMediaContainer}>
      <TouchableOpacity 
        style={styles.socialButton}
        onPress={() => launchSocialMedia('facebook')}
      >
        <Text style={styles.socialIcon}>📘</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.socialButton}
        onPress={() => launchSocialMedia('twitter')}
      >
        <Text style={styles.socialIcon}>🐦</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.socialButton}
        onPress={() => launchSocialMedia('instagram')}
      >
        <Text style={styles.socialIcon}>📷</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.socialButton}
        onPress={() => launchSocialMedia('youtube')}
      >
        <Text style={styles.socialIcon}>📺</Text>
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
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#16a34a" barStyle="light-content" />
      
      {/* Custom Header */}
      <LinearGradient
        colors={['#16a34a', '#22c55e']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About</Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* App Logo and Basic Info */}
          <View style={styles.logoCard}>
            <Text style={styles.logoIcon}>🌾</Text>
            <Text style={styles.appTitle}>Smart Farmer</Text>
            <Text style={styles.appVersion}>
              Version {appVersion} (Build {buildNumber})
            </Text>
            <Text style={styles.appTagline}>
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
          <View style={styles.socialSection}>
            <Text style={styles.socialTitle}>Follow Us</Text>
            <SocialMediaLinks />
          </View>

          {/* Legal Information */}
          <TouchableOpacity 
            style={styles.legalButton}
            onPress={showLicenseDialog}
          >
            <Text style={styles.legalButtonText}>Terms & Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFFE',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  logoCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 24,
  },
  logoIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#166534',
    textAlign: 'center',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  appTagline: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'justify',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
    marginTop: 2,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  socialSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    backgroundColor: '#f0fdf4',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  socialIcon: {
    fontSize: 24,
  },
  legalButton: {
    backgroundColor: 'transparent',
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#16a34a',
    borderRadius: 12,
    marginBottom: 20,
  },
  legalButtonText: {
    color: '#16a34a',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AboutScreen;