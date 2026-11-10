import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, HelperText, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { mensagemErro } from '../utils/helpers';
import { colors } from '../theme';

export function LoginScreen({ navigation }) {
  const { entrar } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  async function enviar() {
    if (!usuario.trim() || !senha) {setErro('Preencha seu usuário e sua senha.');return;}
    setErro('');setSalvando(true);
    try {await entrar(usuario,senha);} catch(e){setErro(mensagemErro(e));} finally {setSalvando(false);}
  }
  return <KeyboardAvoidingView style={styles.raiz} behavior={Platform.OS==='ios'?'padding':undefined}>
    <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <View style={styles.marca}><Text style={styles.marcaTexto}>loja.</Text></View>
      <Text variant="headlineMedium" style={styles.titulo}>Sua loja, sob controle.</Text>
      <Text style={styles.descricao}>Entre para acompanhar produtos, categorias e vendas.</Text>
      <Card style={styles.cartao}><Card.Content style={{gap:10}}>
        <Text variant="titleMedium" style={styles.subtitulo}>Acesso administrativo</Text>
        <TextInput label="Usuário" mode="outlined" value={usuario} onChangeText={setUsuario} autoCapitalize="none" autoCorrect={false} style={styles.campo}/>
        <TextInput label="Senha" mode="outlined" value={senha} onChangeText={setSenha} secureTextEntry={!mostrarSenha} right={<TextInput.Icon icon={mostrarSenha?'eye-off':'eye'} onPress={()=>setMostrarSenha(!mostrarSenha)}/>} style={styles.campo}/>
        {erro ? <HelperText type="error" visible>{erro}</HelperText>:null}
        <Button mode="contained" icon="login" onPress={enviar} loading={salvando} disabled={salvando}>Entrar</Button>
        <Button mode="text" onPress={()=>navigation.navigate('Registro')}>Criar conta de administrador</Button>
      </Card.Content></Card>
      <Text style={styles.rodape}>Projeto acadêmico • API do professor • JWT</Text>
    </ScrollView>
  </KeyboardAvoidingView>;
}
const styles=StyleSheet.create({
  raiz:{flex:1,backgroundColor:colors.background},
  conteudo:{flexGrow:1,justifyContent:'center',padding:22,gap:18},
  marca:{backgroundColor:colors.primary,width:74,height:74,borderRadius:22,alignItems:'center',justifyContent:'center'},
  marcaTexto:{color:'white',fontWeight:'800',fontSize:26},
  titulo:{fontWeight:'800',color:colors.text},descricao:{color:colors.muted,lineHeight:23,marginBottom:2},
  cartao:{backgroundColor:'white',borderRadius:18},subtitulo:{fontWeight:'700',marginBottom:8},
  campo:{backgroundColor:'white'},rodape:{textAlign:'center',color:colors.muted,fontSize:12}
});
