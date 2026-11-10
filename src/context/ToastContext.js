import React, { createContext, useContext, useState } from 'react';
import { Portal, Snackbar } from 'react-native-paper';
const ToastContext = createContext(null);
export function ToastProvider({ children }) {
  const [mensagem, setMensagem] = useState('');
  const [visivel, setVisivel] = useState(false);
  const avisar = (texto) => { setMensagem(texto); setVisivel(true); };
  return <ToastContext.Provider value={avisar}>
    {children}
    <Portal><Snackbar visible={visivel} onDismiss={() => setVisivel(false)} duration={3000} action={{label:'OK',onPress:()=>setVisivel(false)}}>{mensagem}</Snackbar></Portal>
  </ToastContext.Provider>;
}
export const useAviso = () => useContext(ToastContext);
