import axios from 'axios';

export const API = axios.create({
	// baseURL: 'http://localhost:8080/api/v1/',
	baseURL: 'https://mindustry-tool-backend.onrender.com/api/v1/',
	headers: { 'ngrok-skip-browser-warning': 'true' }
});
