import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://172.19.212.19:3000/api'
})