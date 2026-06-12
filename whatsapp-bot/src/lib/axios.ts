import axios from 'axios'

const BASE_URL = process.env['BACKEND_API_URL'] ?? 'http://localhost:3000/api/v1'
const API_KEY = process.env['BOT_API_KEY'] ?? ''

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'x-api-key': API_KEY },
})
