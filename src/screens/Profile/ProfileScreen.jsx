// C:\Users\ADMIN\Desktop\SM-MOBILE\smartfarmer\src\screens\Profile\HelpSupportScreen.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ApiService from '../../services/ApiService';
import AuthService from '../../services/AuthService';

const ProfileScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [totalCrops, setTotalCrops] = useState(0);
  const [totalArea, setTotalArea] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setupAnimations();
    initializeData();
  }, []);

  const setupAnimations = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const initializeData = async () => {
    try {
      await loadProfileData();
      await fetchCropsData();
    } catch (error) {
      console.log('Error initializing data:', error);
    }
  };

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

  const fetchCropsData = async () => {
    try {
      const farmerId = await AuthService.getUserId();
      const response = await ApiService.get(`/crop/by-farmer/${farmerId}`);
      
      if (response.crops) {
        setTotalCrops(response.crops.length);
        
        // Calculate total area
        const area = response.crops.reduce((total, crop) => {
          return total + (parseFloat(crop.area?.value) || 0);
        }, 0);
        setTotalArea(area);
      }
    } catch (error) {
      console.log('Error fetching crops data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCropsData();
    await loadProfileData();
    setRefreshing(false);
  };

  const buildProfileHeader = () => {
    const displayName = profileData?.name || 'User';
    const displayAadhaar = profileData?.aadhaarNumber || profileData?.aadhaar_number || '';
    
    return (
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.profileHeader}
      >
        <View style={styles.profileAvatarContainer}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {displayName.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.profileName}>{displayName}</Text>
        
        <View style={styles.aadhaarBadge}>
          <Text style={styles.aadhaarText}>
            {displayAadhaar || 'No Aadhaar'}
          </Text>
        </View>
        
        <View style={styles.profileActions}>
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => navigation.navigate('ProfileView')}
        >
          <Text style={styles.viewButtonText}>View Profile</Text>
        </TouchableOpacity>
      </View>
      </LinearGradient>
    );
  };

  const buildStatsCards = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: '#4CAF5010' }]}>
          <Text style={[styles.statIconText, { color: '#4CAF50' }]}>🌱</Text>
        </View>
        <Text style={styles.statValue}>{totalCrops}</Text>
        <Text style={styles.statLabel}>Total Crops</Text>
      </View>
      
      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: '#2196F310' }]}>
          <Text style={[styles.statIconText, { color: '#2196F3' }]}>🌾</Text>
        </View>
        <Text style={styles.statValue}>{totalArea} acres</Text>
        <Text style={styles.statLabel}>Total Area</Text>
      </View>
    </View>
  );

  const buildSettingsList = () => (
    <View style={styles.settingsContainer}>
      <SettingTile
        icon="🌐"
        title="Language"
        subtitle="English"
        onPress={() => showLanguageDialog()}
      />
      <View style={styles.divider} />
      <SettingTile
        icon="🔔"
        title="Notifications"
        trailing={
          <TouchableOpacity onPress={() => setNotificationsEnabled(!notificationsEnabled)}>
            <View style={[
              styles.switch,
              notificationsEnabled ? styles.switchOn : styles.switchOff
            ]}>
              <View style={[
                styles.switchThumb,
                notificationsEnabled ? styles.switchThumbOn : styles.switchThumbOff
              ]} />
            </View>
          </TouchableOpacity>
        }
      />
      <View style={styles.divider} />
      <SettingTile
        icon="❓"
        title="Help & Support"
        onPress={() => navigation.navigate('HelpSupport')}
      />
      <View style={styles.divider} />
      <SettingTile
        icon="ℹ️"
        title="About"
        onPress={() => navigation.navigate('About')}
      />
    </View>
  );

  const SettingTile = ({ icon, title, subtitle, trailing, onPress }) => (
    <TouchableOpacity style={styles.settingTile} onPress={onPress}>
      <View style={styles.settingIcon}>
        <Text style={styles.settingIconText}>{icon}</Text>
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {trailing || <Text style={styles.settingArrow}>›</Text>}
    </TouchableOpacity>
  );

  const showLanguageDialog = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      [
        { text: 'English', onPress: () => console.log('English selected') },
        { text: 'हिंदी', onPress: () => console.log('Hindi selected') },
        { text: 'मराठी', onPress: () => console.log('Marathi selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await AuthService.logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        },
      ]
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
          />
        }
        style={styles.scrollView}
      >
        {buildProfileHeader()}
        <View style={styles.content}>
          {buildStatsCards()}
          
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Text style={styles.sectionIconText}>⚙️</Text>
            </View>
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>
          
          {buildSettingsList()}
          
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFFE',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    padding: 24,
    alignItems: 'center',
  },
  profileAvatarContainer: {
    marginBottom: 16,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  aadhaarBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  aadhaarText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  profileActions: {
    flexDirection: 'row',
    width: '100%',
  },
  viewButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconText: {
    fontSize: 26,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    backgroundColor: '#4CAF5010',
    padding: 8,
    borderRadius: 12,
  },
  sectionIconText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginLeft: 12,
  },
  settingsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
    marginBottom: 32,
  },
  settingTile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  settingIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#4CAF5010',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingIconText: {
    fontSize: 20,
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  settingArrow: {
    fontSize: 16,
    color: '#999',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  switchOn: {
    backgroundColor: '#4CAF50',
  },
  switchOff: {
    backgroundColor: '#ccc',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  switchThumbOn: {
    transform: [{ translateX: 22 }],
  },
  switchThumbOff: {
    transform: [{ translateX: 0 }],
  },
  logoutButton: {
    backgroundColor: '#FF5252',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#FF5252',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;