import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar, Button, Card, Text } from 'react-native-paper';
import { Pagina, Carregando, EstadoVazio, ErroLista, Confirmar, s } from '../components/UI';
import { useAviso } from '../context/ToastContext';
import { api } from '../services/api';
import { listaDados, mensagemErro } from '../utils/helpers';

export function CategoriasScreen({ navigation }) {
  const avisar=useAviso();
  const [itens,setItens]=useState([]);const [carregando,setCarregando]=useState(true);
  const [erro,setErro]=useState('');const [excluir,setExcluir]=useState(null);const [ocupado,setOcupado]=useState(false);
  const carregar=useCallback(async()=>{
    setCarregando(true);setErro('');
    try{const r=await api.get('/app/categorias');setItens(listaDados(r.data));}
    catch(e){setErro(mensagemErro(e));}finally{setCarregando(false);}
  },[]);
  useFocusEffect(useCallback(()=>{carregar();},[carregar]));
  async function confirmarExclusao(){
    if(!excluir)return;
    setOcupado(true);
    try{await api.delete('/app/categorias',{data:{id:excluir._id}});setExcluir(null);avisar('Categoria excluída.');await carregar();}
    catch(e){setExcluir(null);avisar(mensagemErro(e));}finally{setOcupado(false);}
  }
  return <Pagina titulo="Categorias" acao={<Appbar.Action icon="plus" onPress={()=>navigation.navigate('CategoriaForm')}/> }>
    <Text style={s.ajuda}>Categorias cadastradas na API para sua loja.</Text>
    <Button mode="contained" icon="plus" onPress={()=>navigation.navigate('CategoriaForm')}>Nova categoria</Button>
    {carregando?<Carregando/>:erro?<ErroLista texto={erro} tentar={carregar}/>:itens.length===0?
      <EstadoVazio titulo="Sem categorias" descricao="Cadastre sua primeira categoria para organizar os produtos."/>:
      itens.map(item=><Card key={item._id} style={s.cartao}><Card.Title title={item.nome} subtitle="Categoria da loja"/>
        <Card.Actions>
          <Button icon="pencil-outline" onPress={()=>navigation.navigate('CategoriaForm',{item})}>Editar</Button>
          <Button icon="delete-outline" textColor="#B83D3D" onPress={()=>setExcluir(item)}>Excluir</Button>
        </Card.Actions></Card>)}
    <Button mode="outlined" icon="refresh" onPress={carregar}>Atualizar lista</Button>
    <Confirmar visivel={!!excluir} titulo="Excluir categoria?" descricao={`Deseja excluir ${excluir?.nome||'esta categoria'}? Os produtos já cadastrados não serão excluídos automaticamente.`} ocupado={ocupado} cancelar={()=>setExcluir(null)} confirmar={confirmarExclusao}/>
  </Pagina>;
}
