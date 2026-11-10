import React, { useState } from 'react';
import { Button, Card, Text } from 'react-native-paper';
import { Pagina, LinhaInfo, s } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useAviso } from '../context/ToastContext';
import { mensagemErro } from '../utils/helpers';

export function PerfilScreen({navigation}){
  const {perfil,atualizarPerfil}=useAuth();const avisar=useAviso();const [ocupado,setOcupado]=useState(false);
  async function carregar(){setOcupado(true);try{await atualizarPerfil();avisar('Perfil atualizado pela API.');}catch(e){avisar(mensagemErro(e));}finally{setOcupado(false);}}
  return <Pagina titulo="Meu perfil">
    <Card style={s.cartao}><Card.Content>
      <Text variant="titleLarge" style={s.label}>Administrador</Text>
      <LinhaInfo rotulo="Usuário" valor={perfil?.usuario}/>
      <LinhaInfo rotulo="ID da conta" valor={perfil?._id}/>
      <Text style={s.ajuda}>A sessão é validada pelo endpoint protegido GET /app/perfil.</Text>
    </Card.Content></Card>
    <Button mode="outlined" icon="refresh" loading={ocupado} disabled={ocupado} onPress={carregar}>Consultar perfil novamente</Button>
    <Button mode="contained" icon="logout" onPress={()=>navigation.navigate('Sair')}>Sair da conta</Button>
  </Pagina>;
}
