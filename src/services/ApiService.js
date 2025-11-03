// src/services/ApiService.js
const API_BASE_URL = 'http://localhost:1000'; // Replace with your actual backend URL

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth APIs
  static async mobileLoginByContact(contact) {
    return this.request('/auth/mobile-user/loginByContact', {
      method: 'POST',
      body: { contact },
    });
  }

  static async verifyOTP(contact, otp) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { 
        mobileNumber: contact, 
        otp: otp,
        role: 'farmer' 
      },
    });
  }

  static async registerFarmer(farmerData) {
    return this.request('/farmer/register', {
      method: 'POST',
      body: farmerData,
    });
  }

  // Check if farmer exists
  static async checkFarmerExists(contact) {
    try {
      // Try to login with contact - if successful, farmer exists
      const result = await this.mobileLoginByContact(contact);
      return {
        exists: true,
        userData: result.data
      };
    } catch (error) {
      // If login fails, farmer doesn't exist
      return {
        exists: false,
        error: error.message
      };
    }
  }
}

export default ApiService;