import React, { useState } from 'react';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { Pagina, s } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useAviso } from '../context/ToastContext';
import { mensagemErro } from '../utils/helpers';

export function RegistroScreen({ navigation }) {
  const { registrar } = useAuth();const avisar=useAviso();
  const [usuario,setUsuario]=useState('');const [senha,setSenha]=useState('');const [confirma,setConfirma]=useState('');
  const [ocupado,setOcupado]=useState(false);const [erro,setErro]=useState('');
  async function enviar(){
    if(!usuario.trim()||!senha||!confirma){setErro('Preencha todos os campos.');return;}
    if(senha!==confirma){setErro('As senhas são diferentes.');return;}
    setErro('');setOcupado(true);
    try {await registrar(usuario,senha,confirma);avisar('Conta criada! Faça login para entrar.');navigation.goBack();}
    catch(e){setErro(mensagemErro(e));}finally{setOcupado(false);}
  }
  return <Pagina titulo="Criar conta">
    <Text variant="titleMedium">Cadastre o administrador da loja</Text>
    <Text>Use um nome de usuário próprio. Ele também identifica o catálogo público da loja.</Text>
    <TextInput mode="outlined" label="Nome de usuário" value={usuario} onChangeText={setUsuario} autoCapitalize="none" autoCorrect={false} style={s.campo}/>
    <TextInput mode="outlined" label="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={s.campo}/>
    <TextInput mode="outlined" label="Confirmar senha" value={confirma} onChangeText={setConfirma} secureTextEntry style={s.campo}/>
    {erro?<HelperText type="error" visible>{erro}</HelperText>:null}
    <Button style={s.principal} mode="contained" onPress={enviar} loading={ocupado} disabled={ocupado}>Registrar</Button>
  </Pagina>;
}
