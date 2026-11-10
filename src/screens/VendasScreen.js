import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar, Button, Card, Text } from 'react-native-paper';
import { Pagina, Carregando, EstadoVazio, ErroLista, s } from '../components/UI';
import { api } from '../services/api';
import { dataBR, listaDados, mensagemErro, precoBR } from '../utils/helpers';

export function VendasScreen({navigation}){
  const [vendas,setVendas]=useState([]);const [carregando,setCarregando]=useState(true);const [erro,setErro]=useState('');
  const carregar=useCallback(async()=>{
    setCarregando(true);setErro('');
    try{const r=await api.get('/app/venda');setVendas(listaDados(r.data));}
    catch(e){setErro(mensagemErro(e));}finally{setCarregando(false);}
  },[]);
  useFocusEffect(useCallback(()=>{carregar();},[carregar]));
  return <Pagina titulo="Vendas" acao={<Appbar.Action icon="plus" onPress={()=>navigation.navigate('NovaVenda')}/> }>
    <Text style={s.ajuda}>Vendas registradas na API para a sua loja.</Text>
    <Button mode="contained" icon="plus" onPress={()=>navigation.navigate('NovaVenda')}>Registrar venda</Button>
    {carregando?<Carregando/>:erro?<ErroLista texto={erro} tentar={carregar}/>:vendas.length===0?
      <EstadoVazio titulo="Nenhuma venda registrada" descricao="Registre uma venda de teste utilizando produtos cadastrados."/>:
      vendas.map(v=>{
        const total=listaDados(v.produtos).reduce((s,i)=>s+Number(i.quantidade||0)*Number(i.preco||0),0);
        return <Card style={s.cartao} key={v._id} onPress={()=>navigation.navigate('VendaDetalhe',{item:v})}>
          <Card.Title title={v.nomeCliente || 'Cliente sem nome'} subtitle={dataBR(v.data)}/>
          <Card.Content><Text variant="titleMedium" style={s.label}>{precoBR(total)}</Text><Text style={s.ajuda}>{listaDados(v.produtos).length} tipo(s) de produto</Text></Card.Content>
          <Card.Actions><Button onPress={()=>navigation.navigate('VendaDetalhe',{item:v})}>Ver detalhes</Button></Card.Actions>
        </Card>;
      })}
    <Button mode="outlined" icon="refresh" onPress={carregar}>Atualizar vendas</Button>
  </Pagina>;
}
