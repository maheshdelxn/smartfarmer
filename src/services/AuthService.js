// src/services/AuthService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from './ApiService';

class AuthService {
  static async saveUserData(userData) {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('token', userData.token || '');
      await AsyncStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  static async getUserData() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  static async isLoggedIn() {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      return isLoggedIn === 'true';
    } catch (error) {
      return false;
    }
  }

  static async logout() {
    try {
      await AsyncStorage.multiRemove(['userData', 'token', 'isLoggedIn']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}

export default AuthService;