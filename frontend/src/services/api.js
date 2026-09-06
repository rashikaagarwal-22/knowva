import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000', // adjust to your backend port
  withCredentials: true, // cookies
})

export default API