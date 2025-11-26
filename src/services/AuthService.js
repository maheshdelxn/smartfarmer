// C:\Users\ADMIN\Desktop\SM-MOBILE\smartfarmer\src\services\AuthService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from './ApiService';

class AuthService {
  static async login(phoneNumber, password) {
    try {
      const response = await ApiService.post('/auth/farmer/login', {
        phoneNumber,
        password,
      });
      
      if (response.token) {
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.farmer));
        await AsyncStorage.setItem('userId', response.farmer._id);
      }
      
      return response;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }

  // ADD THIS METHOD for registration
  static async storeAuthData(token, userData) {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('userId', userData._id);
      console.log('✅ Auth data stored successfully');
      return true;
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userId');
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  }

  static async getUserId() {
    try {
      return await AsyncStorage.getItem('userId');
    } catch (error) {
      console.error('Get User ID Error:', error);
      return null;
    }
  }

  static async getUserData() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get User Data Error:', error);
      return null;
    }
  }

  static async getAuthToken() {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Get Auth Token Error:', error);
      return null;
    }
  }
}

export default AuthService;