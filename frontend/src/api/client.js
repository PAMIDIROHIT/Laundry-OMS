/**
 * @fileoverview API Client utility.
 * Creates an axios instance with a default base URL configured via environment variables.
 */

import axios from 'axios';

/**
 * Axios client instance mapped to the backend API.
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
