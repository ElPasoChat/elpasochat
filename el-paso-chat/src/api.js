// src/api.js

import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // your server URL

// Placeholder for future API functions
async function fetchSomeData() {
  try {
    const response = await axios.get(`${API_URL}/some-data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching some data:', error);
    throw error;
  }
}

export { fetchSomeData };
