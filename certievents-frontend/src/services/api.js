import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

/**
 * Configuração do Axios para comunicação com o backend Laravel
 * 
 * Este arquivo centraliza todas as requisições HTTP da aplicação,
 * garantindo que todas as chamadas para a API tenham:
 * - A URL base correta (http://localhost:8000/api)
 * - O token de autenticação no header (quando disponível)
 * - Interceptadores para tratamento automático de tokens
 */