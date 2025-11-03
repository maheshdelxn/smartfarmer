import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';

const HelpSupportScreen = ({ navigation }) => {
  // Header Card Component
  const HeaderCard = () => (
    <View style={styles.headerCard}>
      <Text style={styles.headerIcon}>❓</Text>
      <Text style={styles.headerTitle}>How can we help you?</Text>
      <Text style={styles.headerDescription}>
        Get instant help with our comprehensive support resources, FAQs, and direct contact options.
      </Text>
    </View>
  );

  // Section Component
  const Section = ({ title, icon, children }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  // Contact Item Component
  const ContactItem = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.contactItem} onPress={onPress}>
      <View style={styles.contactIcon}>
        <Text style={styles.contactIconText}>{icon}</Text>
      </View>
      <View style={styles.contactContent}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.contactArrow}>›</Text>
    </TouchableOpacity>
  );

  // FAQ Item Component
  const FaqItem = ({ question, answer }) => (
    <View style={styles.faqItem}>
      <Text style={styles.faqQuestion}>{question}</Text>
      <Text style={styles.faqAnswer}>{answer}</Text>
    </View>
  );

  // Video Tutorial Item Component
  const VideoTutorialItem = ({ title, duration, onPress }) => (
    <TouchableOpacity style={styles.videoItem} onPress={onPress}>
      <View style={styles.videoThumbnail}>
        <Text style={styles.videoPlayIcon}>▶️</Text>
      </View>
      <View style={styles.videoContent}>
        <Text style={styles.videoTitle}>{title}</Text>
        <View style={styles.videoDuration}>
          <Text style={styles.durationIcon}>⏱️</Text>
          <Text style={styles.durationText}>{duration}</Text>
        </View>
      </View>
      <Text style={styles.videoPlayButton}>▶</Text>
    </TouchableOpacity>
  );

  // Guide Item Component
  const GuideItem = ({ icon, title, description, onPress }) => (
    <TouchableOpacity style={styles.guideItem} onPress={onPress}>
      <View style={styles.guideIcon}>
        <Text style={styles.guideIconText}>{icon}</Text>
      </View>
      <View style={styles.guideContent}>
        <Text style={styles.guideTitle}>{title}</Text>
        <Text style={styles.guideDescription}>{description}</Text>
      </View>
      <Text style={styles.guideArrow}>›</Text>
    </TouchableOpacity>
  );

  // Divider Component
  const Divider = () => <View style={styles.divider} />;

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
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
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
          <TouchableOpacity style={styles.reportButton} onPress={reportProblem}>
            <Text style={styles.reportButtonIcon}>🐛</Text>
            <Text style={styles.reportButtonText}>Report a Problem</Text>
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
  headerCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 24,
  },
  headerIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#166534',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    padding: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  contactIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactIconText: {
    fontSize: 18,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  contactArrow: {
    fontSize: 18,
    color: '#999',
    marginLeft: 8,
  },
  faqItem: {
    padding: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  videoThumbnail: {
    width: 80,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  videoPlayIcon: {
    fontSize: 20,
  },
  videoContent: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  videoDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  durationText: {
    fontSize: 14,
    color: '#666',
  },
  videoPlayButton: {
    fontSize: 20,
    color: '#16a34a',
    marginLeft: 8,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  guideIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  guideIconText: {
    fontSize: 18,
  },
  guideContent: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  guideDescription: {
    fontSize: 14,
    color: '#666',
  },
  guideArrow: {
    fontSize: 18,
    color: '#999',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 12,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  reportButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#dc2626',
  },
});

export default HelpSupportScreen;