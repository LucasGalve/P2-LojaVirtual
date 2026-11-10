import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar, Button, Card, Text, TextInput } from 'react-native-paper';
import { Pagina, Carregando, EstadoVazio, ErroLista, s } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { listaDados, mensagemErro, precoBR } from '../utils/helpers';
import { colors } from '../theme';

export function ProdutosScreen({ navigation }) {
  const {perfil}=useAuth();const [busca,setBusca]=useState('');
  const [itens,setItens]=useState([]);const [carregando,setCarregando]=useState(true);const [erro,setErro]=useState('');
  const carregar=useCallback(async(nome='')=>{
    if(!perfil?.usuario)return;
    setCarregando(true);setErro('');
    const caminho=`/app/produtos/${encodeURIComponent(perfil.usuario)}`+(nome.trim()?`/${encodeURIComponent(nome.trim())}`:'');
    try{const r=await api.get(caminho);setItens(listaDados(r.data));}
    catch(e){setErro(mensagemErro(e));}finally{setCarregando(false);}
  },[perfil?.usuario]);
  useFocusEffect(useCallback(()=>{carregar(busca);},[carregar]));
  function limpar(){setBusca('');carregar('');}
  return <Pagina titulo="Produtos" acao={<Appbar.Action icon="plus" onPress={()=>navigation.navigate('ProdutoForm')}/> }>
    <Text style={s.ajuda}>Catálogo da loja {perfil?.usuario}. A busca consulta a API pública.</Text>
    <Button mode="contained" icon="plus" onPress={()=>navigation.navigate('ProdutoForm')}>Cadastrar produto</Button>
    <TextInput mode="outlined" label="Buscar produto" value={busca} onChangeText={setBusca} onSubmitEditing={()=>carregar(busca)} left={<TextInput.Icon icon="magnify"/>} style={s.campo}/>
    <View style={s.botoes}><Button mode="outlined" icon="magnify" onPress={()=>carregar(busca)}>Buscar na API</Button><Button onPress={limpar}>Limpar busca</Button></View>
    {carregando?<Carregando/>:erro?<ErroLista texto={erro} tentar={()=>carregar(busca)}/>:itens.length===0?
      <EstadoVazio titulo="Nenhum produto encontrado" descricao="Cadastre um produto ou faça outra busca."/>:
      itens.map(item=><Card key={item._id} style={s.cartao} onPress={()=>navigation.navigate('ProdutoDetalhe',{item})}>
        <Card.Content><View style={styles.linha}>
          {item.imagem?<Image source={{uri:item.imagem}} style={styles.imagem} resizeMode="cover"/>:<View style={[styles.imagem,{backgroundColor:colors.soft}]}/>}
          <View style={{flex:1,gap:5}}>
            <Text variant="titleMedium" style={styles.nome}>{item.nome}</Text>
            <Text style={styles.preco}>{precoBR(item.preco)}</Text>
            <Text style={s.ajuda}>Estoque: {item.quantidade} • {item.categoria || 'Sem categoria'}</Text>
          </View>
        </View></Card.Content>
        <Card.Actions><Button onPress={()=>navigation.navigate('ProdutoDetalhe',{item})}>Ver detalhes</Button></Card.Actions>
      </Card>)}
    <Button mode="outlined" icon="refresh" onPress={()=>carregar(busca)}>Atualizar</Button>
  </Pagina>;
}
const styles=StyleSheet.create({linha:{flexDirection:'row',alignItems:'center',gap:13},imagem:{width:88,height:88,borderRadius:12},nome:{fontWeight:'700'},preco:{fontSize:18,fontWeight:'700',color:colors.primary}});
