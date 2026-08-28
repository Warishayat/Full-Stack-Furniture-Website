const axios = require('axios');

class PayItMonthlyService {
  constructor() {
    this.accessKey = process.env.PAYITMONTHLY_ACCESS_KEY_ID;
    this.secretKey = process.env.PAYITMONTHLY_SECRET_ACCESS_KEY;
    this.token = null;
    this.tokenExpiry = null;
    this.baseUrl = 'https://app.payitmonthly.uk/openapi/v1';
  }

  async authenticate() {
    if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await axios.post(`${this.baseUrl}/partnerauthenticate/`, {
        access_key: this.accessKey,
        secret: this.secretKey,
      });

      this.token = response.data.token;
      // Token is valid for 8 hours, we'll cache it for 7.5 hours
      this.tokenExpiry = new Date(new Date().getTime() + 7.5 * 60 * 60 * 1000);
      return this.token;
    } catch (error) {
      console.error('PayItMonthly Authentication Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with PayItMonthly');
    }
  }

  async createFinanceApplication(payload) {
    const token = await this.authenticate();
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/finance_application/`,
        payload,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('PayItMonthly Application Error:', error.response?.data ? JSON.stringify(error.response.data, null, 2) : error.message);
      throw error;
    }
  }

  async getFinanceApplication(uuid) {
    const token = await this.authenticate();
    
    try {
      const response = await axios.get(
        `${this.baseUrl}/finance_application/${uuid}/`,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('PayItMonthly Get Application Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new PayItMonthlyService();
