import axios from 'axios';

import { API_BASE_URL } from './config/Config';

export const API = axios.create({
	baseURL: API_BASE_URL,
	headers: { 'ngrok-skip-browser-warning': 'true' }
});
