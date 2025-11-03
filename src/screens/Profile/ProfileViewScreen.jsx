import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthService from '../../services/AuthService';

const { width: screenWidth } = Dimensions.get('window');

const ProfileViewScreen = ({ navigation, route }) => {
  const [profileData, setProfileData] = useState(null);
  
  // Hide footer when this screen is active
  useEffect(() => {
    // You can also use navigation.setOptions to dynamically show/hide tab bar
    // or use a context to control footer visibility
    
    return () => {
      // Cleanup when component unmounts
    };
  }, []);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const userData = await AuthService.getUserData();
      if (userData) {
        setProfileData(userData);
      }
    } catch (error) {
      console.log('Error loading profile data:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString.split('T')[0];
    }
  };

  const navigateToEditProfile = () => {
    if (profileData) {
      navigation.navigate('EditFarmerDetails', { farmer: profileData });
    } else {
      Alert.alert('Error', 'Profile data not available for editing');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Get profile data with fallbacks
  const name = profileData?.name || '';
  const aadhaar = profileData?.aadhaarNumber || profileData?.aadhaar_number || '';
  const contact = profileData?.contactNumber || profileData?.contact_number || '';
  const village = profileData?.village || '';
  const taluka = profileData?.taluka || '';
  const district = profileData?.district || '';
  const pincode = profileData?.pincode || '';
  const id = profileData?.id || profileData?._id || '';
  const createdAt = formatDate(profileData?.createdAt || profileData?.created_at || '');

  const buildProfileHeader = () => (
    <View style={styles.profileHeader}>
      <LinearGradient
        colors={['#66BB6A', '#4CAF50']}
        style={styles.profileHeaderGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name ? name.substring(0, 2).toUpperCase() : ''}
            </Text>
          </View>
          <Text style={styles.profileName} numberOfLines={2}>
            {name}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  const buildQuickStats = () => (
    <View style={styles.statsContainer}>
      <StatCard
        title="Total Crops"
        value="12"
        unit=""
        icon="🌱"
        color="#2196F3"
      />
      <View style={styles.statSpacer} />
      <StatCard
        title="Total Area"
        value="45"
        unit="acres"
        icon="🌾"
        color="#FF9800"
      />
      <View style={styles.statSpacer} />
      <StatCard
        title="Verified Crops"
        value="8"
        unit=""
        icon="✅"
        color="#4CAF50"
      />
    </View>
  );

  const StatCard = ({ title, value, unit, icon, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}10` }]}>
        <Text style={[styles.statIconText, { color }]}>{icon}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={styles.statValueContainer}>
        <Text style={styles.statValue}>{value}</Text>
        {unit ? <Text style={styles.statUnit}> {unit}</Text> : null}
      </View>
    </View>
  );

  const buildDetailsSection = ({ title, sectionIcon, details }) => (
    <View style={styles.detailsSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Text style={styles.sectionIconText}>{sectionIcon}</Text>
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {details}
    </View>
  );

  const buildDetailRow = (title, value, icon, color, isLast = false) => (
    <View style={[styles.detailRow, isLast && styles.detailRowLast]}>
      <View style={[styles.detailIcon, { backgroundColor: `${color}10` }]}>
        <Text style={[styles.detailIconText, { color }]}>{icon}</Text>
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailTitle}>{title}</Text>
        <Text style={styles.detailValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
      
      {/* Custom Header - Profile Details */}
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.header}
      >
        <View style={styles.headerContentWrapper}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Profile Details</Text>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={navigateToEditProfile}
          >
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {buildProfileHeader()}
          <View style={styles.spacer} />
          {buildQuickStats()}
          <View style={styles.spacer} />

          {/* Personal Information */}
          {buildDetailsSection({
            title: "Personal Information",
            sectionIcon: "👤",
            details: [
              buildDetailRow("Name", name, "👨‍🌾", "#4CAF50"),
              buildDetailRow("Contact Number", contact, "📞", "#2196F3"),
              buildDetailRow("Aadhaar Number", aadhaar, "🆔", "#FF9800", true),
            ]
          })}

          <View style={styles.spacer} />

          {/* Address Information */}
          {buildDetailsSection({
            title: "Address Information",
            sectionIcon: "📍",
            details: [
              buildDetailRow("Village", village, "🏘️", "#4CAF50"),
              buildDetailRow("Taluka", taluka, "🗺️", "#2196F3"),
              buildDetailRow("District", district, "🏛️", "#FF9800"),
              buildDetailRow("Pincode", pincode, "📮", "#F44336", true),
            ]
          })}

          <View style={styles.spacer} />

          {/* Account Information */}
          {buildDetailsSection({
            title: "Account Information",
            sectionIcon: "📋",
            details: [
              buildDetailRow("Registration Date", createdAt, "📅", "#2196F3", true),
            ]
          })}

          <View style={styles.bottomSpacer} />
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
  headerContentWrapper: {
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
  editButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40, // Extra padding at bottom since no footer
  },
  profileHeader: {
    marginTop: 10,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  profileHeaderGradient: {
    padding: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileName: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    letterSpacing: -0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statSpacer: {
    width: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconText: {
    fontSize: 16,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  spacer: {
    height: 24,
  },
  bottomSpacer: {
    height: 40,
  },
  detailsSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionIconText: {
    fontSize: 16,
    color: '#1976D2',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailIconText: {
    fontSize: 14,
  },
  detailContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#37474F',
    flex: 2,
  },
  detailValue: {
    fontWeight: '500',
    fontSize: 14,
    color: '#333',
    flex: 3,
    textAlign: 'right',
  },
});

export default ProfileViewScreen;