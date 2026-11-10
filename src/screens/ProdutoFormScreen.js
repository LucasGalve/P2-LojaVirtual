import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { Button, Card, HelperText, Menu, Text, TextInput } from 'react-native-paper';
import { Pagina, s } from '../components/UI';
import { useAviso } from '../context/ToastContext';
import { api } from '../services/api';
import { listaDados, mensagemErro, numeroDigitado } from '../utils/helpers';

export function ProdutoFormScreen({route,navigation}) {
  const item=route.params?.item;const avisar=useAviso();
  const [nome,setNome]=useState(item?.nome||'');
  const [quantidade,setQuantidade]=useState(item?.quantidade!=null?String(item.quantidade):'');
  const [preco,setPreco]=useState(item?.preco!=null?String(item.preco):'');
  const [descricao,setDescricao]=useState(item?.descricao||'');
  const [imagem,setImagem]=useState(item?.imagem||'');
  const [categoria,setCategoria]=useState(item?.categoria||'');
  const [categorias,setCategorias]=useState([]);
  const [menuAberto,setMenuAberto]=useState(false);
  const [ocupado,setOcupado]=useState(false);const [erro,setErro]=useState('');
  useEffect(()=>{let ativo=true;api.get('/app/categorias').then(r=>{if(ativo)setCategorias(listaDados(r.data));}).catch(e=>{if(ativo)setErro(mensagemErro(e));});return()=>{ativo=false;};},[]);
  async function salvar(){
    const estoque=numeroDigitado(quantidade);const valor=numeroDigitado(preco);
    if(!nome.trim()||!descricao.trim()||!imagem.trim()||!categoria.trim()||!quantidade.trim()||!preco.trim()){
      setErro('Preencha todos os campos, inclusive a categoria.');return;
    }
    if(!Number.isInteger(estoque)||estoque<0){setErro('Quantidade deve ser um inteiro maior ou igual a zero.');return;}
    if(!Number.isFinite(valor)||valor<0){setErro('Preço deve ser um número maior ou igual a zero.');return;}
    if(!/^https?:\/\//i.test(imagem.trim())){setErro('Informe uma URL de imagem válida (http ou https).');return;}
    const dados={nome:nome.trim(),quantidade:estoque,preco:valor,descricao:descricao.trim(),imagem:imagem.trim(),categoria};
    setErro('');setOcupado(true);
    try{
      if(item)await api.put('/app/produtos',{id:item._id,...dados});
      else await api.post('/app/produtos',dados);
      avisar(item?'Produto atualizado.':'Produto cadastrado.');
      // Volta à lista, que carrega os dados atuais da API ao receber foco.
      navigation.navigate('Produtos');
    }catch(e){setErro(mensagemErro(e));}finally{setOcupado(false);}
  }
  return <Pagina titulo={item?'Editar produto':'Cadastrar produto'}>
    <Text variant="titleMedium">Informações do produto</Text>
    <TextInput label="Nome" mode="outlined" value={nome} onChangeText={setNome} style={s.campo}/>
    <TextInput label="Quantidade em estoque" mode="outlined" value={quantidade} onChangeText={setQuantidade} keyboardType="number-pad" style={s.campo}/>
    <TextInput label="Preço em reais (ex.: 59,90)" mode="outlined" value={preco} onChangeText={setPreco} keyboardType="decimal-pad" style={s.campo}/>
    <TextInput label="Descrição" mode="outlined" value={descricao} onChangeText={setDescricao} multiline numberOfLines={3} style={s.campo}/>
    <TextInput label="URL da imagem" mode="outlined" value={imagem} onChangeText={setImagem} autoCapitalize="none" keyboardType="url" style={s.campo}/>
    {/^https?:\/\//i.test(imagem.trim())?<Image source={{uri:imagem}} style={{height:170,borderRadius:13}} resizeMode="contain"/>:null}
    <Card style={s.cartao}><Card.Content>
      <Text style={s.ajuda}>Categoria</Text>
      <Menu visible={menuAberto} onDismiss={()=>setMenuAberto(false)} anchor={<Button mode="outlined" icon="chevron-down" onPress={()=>setMenuAberto(true)}>{categoria || 'Selecionar categoria'}</Button>}>
        {categorias.map(cat=><Menu.Item key={cat._id} title={cat.nome} onPress={()=>{setCategoria(cat.nome);setMenuAberto(false);}}/>)}
      </Menu>
      {categorias.length===0?<View>
        <Text style={s.ajuda}>Nenhuma categoria disponível. Cadastre uma categoria primeiro.</Text>
        <Button onPress={()=>navigation.navigate('Categorias')}>Gerenciar categorias</Button>
      </View>:null}
    </Card.Content></Card>
    {erro?<HelperText type="error" visible>{erro}</HelperText>:null}
    <Button mode="contained" icon="content-save" style={s.principal} loading={ocupado} disabled={ocupado} onPress={salvar}>Salvar produto</Button>
  </Pagina>;
}
