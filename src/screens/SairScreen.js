import React, { useState } from 'react';
import { Button, Card, Text } from 'react-native-paper';
import { Pagina, s } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export function SairScreen({navigation}){
  const {sair}=useAuth();const [ocupado,setOcupado]=useState(false);
  async function confirmar(){setOcupado(true);try{await sair();}finally{setOcupado(false);}}
  return <Pagina titulo="Encerrar sessão">
    <Card style={s.cartao}><Card.Content>
      <Text variant="titleLarge" style={s.label}>Deseja sair do sistema?</Text>
      <Text style={s.ajuda}>O token JWT será removido do AsyncStorage. Para entrar novamente, será necessário informar usuário e senha.</Text>
    </Card.Content></Card>
    <Button mode="contained" icon="logout" loading={ocupado} disabled={ocupado} onPress={confirmar}>Confirmar logout</Button>
    <Button mode="outlined" onPress={()=>navigation.goBack()}>Permanecer conectado</Button>
  </Pagina>;
}
