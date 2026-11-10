import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CHAVE_TOKEN = '@loja_p2_token';
export const URL_API = 'https://backend-completo.vercel.app';
export const api = axios.create({ baseURL: URL_API, timeout: 20000 });
let aoFalharAutenticacao = null;
export const definirFalhaAutenticacao = (callback) => { aoFalharAutenticacao = callback; };

api.interceptors.request.use(async (config) => {
  // Login e registro são públicos: não envie credenciais antigas.
  if (!/\/app\/(login|registrar)$/.test(config.url || '')) {
    const token = await AsyncStorage.getItem(CHAVE_TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config?.url || '';
    if (error.response?.status === 401 && !/\/app\/(login|registrar)$/.test(url)) {
      // A navegação depende do estado do AuthProvider; não apenas de uma tela.
      await AsyncStorage.removeItem(CHAVE_TOKEN);
      if (aoFalharAutenticacao) aoFalharAutenticacao();
    }
    return Promise.reject(error);
  }
);
