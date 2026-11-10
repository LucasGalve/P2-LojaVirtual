import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, CHAVE_TOKEN, definirFalhaAutenticacao } from '../services/api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [perfil, setPerfil] = useState(null);
  const [iniciando, setIniciando] = useState(true);

  const sair = useCallback(async () => {
    await AsyncStorage.removeItem(CHAVE_TOKEN);
    setPerfil(null);
  }, []);

  useEffect(() => {
    definirFalhaAutenticacao(() => { setPerfil(null); });
    let ativo = true;
    (async () => {
      try {
        const token = await AsyncStorage.getItem(CHAVE_TOKEN);
        if (token) {
          const resposta = await api.get('/app/perfil');
          if (ativo) setPerfil(resposta.data);
        }
      } catch (err) {
        await AsyncStorage.removeItem(CHAVE_TOKEN);
        if (ativo) setPerfil(null);
      } finally {
        if (ativo) setIniciando(false);
      }
    })();
    return () => { ativo = false; definirFalhaAutenticacao(null); };
  }, []);

  async function entrar(usuario, senha) {
    const resposta = await api.post('/app/login', { usuario: usuario.trim(), senha });
    if (!resposta.data?.token) throw new Error('A API não retornou um token JWT.');
    await AsyncStorage.setItem(CHAVE_TOKEN, resposta.data.token);
    try {
      const usuarioAtual = await api.get('/app/perfil');
      setPerfil(usuarioAtual.data);
    } catch (e) {
      await AsyncStorage.removeItem(CHAVE_TOKEN);
      setPerfil(null);
      throw e;
    }
  }

  async function registrar(usuario, senha, confirma) {
    return await api.post('/app/registrar', { usuario: usuario.trim(), senha, confirma });
  }

  async function atualizarPerfil() {
    const resposta = await api.get('/app/perfil');
    setPerfil(resposta.data);
    return resposta.data;
  }

  return <AuthContext.Provider value={{ perfil, iniciando, entrar, registrar, sair, atualizarPerfil }}>
    {children}
  </AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
