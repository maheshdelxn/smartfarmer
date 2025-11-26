// C:\Users\ADMIN\Desktop\SM-MOBILE\smartfarmer\src\services\ApiService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://smart-farmer-backend.vercel.app/api'; // or your backend URL

class ApiService {
  static async get(url) {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  }

  static async post(url, data) {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }

  static async patch(url, data) {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API PATCH Error:', error);
      throw error;
    }
  }
}

export default ApiService;