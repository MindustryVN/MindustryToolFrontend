import axios from 'axios';

const Api = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
    headers: { 'ngrok-skip-browser-warning': 'true' }
});

export default Api;
