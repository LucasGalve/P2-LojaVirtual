import React, { useState } from 'react';
import { Image } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { Pagina, Confirmar, LinhaInfo, s } from '../components/UI';
import { useAviso } from '../context/ToastContext';
import { api } from '../services/api';
import { mensagemErro, precoBR } from '../utils/helpers';

export function ProdutoDetalheScreen({route,navigation}){
  const item=route.params?.item;const avisar=useAviso();
  const [excluir,setExcluir]=useState(false);const [ocupado,setOcupado]=useState(false);
  if(!item)return <Pagina titulo="Produto"><Text>Produto não selecionado.</Text></Pagina>;
  async function remover(){
    setOcupado(true);
    try{await api.delete('/app/produtos',{data:{id:item._id}});setExcluir(false);avisar('Produto excluído.');navigation.navigate('Produtos');}
    catch(e){setExcluir(false);avisar(mensagemErro(e));}finally{setOcupado(false);}
  }
  return <Pagina titulo="Detalhes do produto">
    <Card style={s.cartao}><Card.Content>
      <Image source={{uri:item.imagem}} style={{height:215,borderRadius:14,marginBottom:15}} resizeMode="contain"/>
      <Text variant="headlineSmall" style={s.label}>{item.nome}</Text>
      <Text variant="titleLarge" style={{fontWeight:'700',marginVertical:8}}>{precoBR(item.preco)}</Text>
      <LinhaInfo rotulo="Quantidade em estoque" valor={item.quantidade}/>
      <LinhaInfo rotulo="Categoria" valor={item.categoria}/>
      <LinhaInfo rotulo="Descrição" valor={item.descricao}/>
      <LinhaInfo rotulo="ID do produto" valor={item._id}/>
    </Card.Content></Card>
    <Button mode="contained" icon="pencil" onPress={()=>navigation.navigate('ProdutoForm',{item})}>Editar produto</Button>
    <Button mode="outlined" textColor="#B83D3D" icon="delete-outline" onPress={()=>setExcluir(true)}>Excluir produto</Button>
    <Confirmar visivel={excluir} titulo="Excluir produto?" descricao={`Deseja excluir ${item.nome}? Essa ação não pode ser desfeita.`} ocupado={ocupado} cancelar={()=>setExcluir(false)} confirmar={remover}/>
  </Pagina>;
}
