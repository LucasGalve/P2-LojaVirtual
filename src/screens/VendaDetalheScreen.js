import React, { useState } from 'react';
import { Button, Card, Divider, Text } from 'react-native-paper';
import { Pagina, Confirmar, LinhaInfo, s } from '../components/UI';
import { useAviso } from '../context/ToastContext';
import { api } from '../services/api';
import { dataBR, listaDados, mensagemErro, precoBR } from '../utils/helpers';

export function VendaDetalheScreen({route,navigation}){
  const venda=route.params?.item;const avisar=useAviso();
  const [confirmacao,setConfirmacao]=useState(false);const [ocupado,setOcupado]=useState(false);
  if(!venda)return <Pagina titulo="Venda"><Text>Selecione uma venda na lista.</Text></Pagina>;
  const itens=listaDados(venda.produtos);
  const total=itens.reduce((s,i)=>s+Number(i.preco||0)*Number(i.quantidade||0),0);
  async function remover(){
    setOcupado(true);
    try{await api.delete(`/app/venda/${encodeURIComponent(venda._id)}`);setConfirmacao(false);avisar('Venda excluída.');navigation.goBack();}
    catch(e){setConfirmacao(false);avisar(mensagemErro(e));}finally{setOcupado(false);}
  }
  return <Pagina titulo="Detalhes da venda">
    <Card style={s.cartao}><Card.Content>
      <Text variant="titleLarge" style={s.label}>{venda.nomeCliente}</Text>
      <LinhaInfo rotulo="Data" valor={dataBR(venda.data)}/>
      <LinhaInfo rotulo="ID da venda" valor={venda._id}/>
      <Divider style={{marginVertical:14}} />
      <Text variant="titleMedium" style={s.label}>Produtos</Text>
      {itens.map((i,idx)=><React.Fragment key={idx}><LinhaInfo rotulo={i.nome} valor={`${i.quantidade} × ${precoBR(i.preco)} = ${precoBR(Number(i.quantidade)*Number(i.preco))}`}/></React.Fragment>)}
      <Divider style={{marginVertical:14}} />
      <Text variant="titleLarge" style={s.label}>Total: {precoBR(total)}</Text>
    </Card.Content></Card>
    <Button mode="outlined" textColor="#B83D3D" icon="delete-outline" onPress={()=>setConfirmacao(true)}>Excluir venda</Button>
    <Confirmar visivel={confirmacao} titulo="Excluir esta venda?" descricao="A venda será removida permanentemente do registro da loja." ocupado={ocupado} cancelar={()=>setConfirmacao(false)} confirmar={remover}/>
  </Pagina>;
}
