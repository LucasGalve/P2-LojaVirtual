import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, Card, HelperText, Menu, Text, TextInput } from 'react-native-paper';
import { Pagina, EstadoVazio, s } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useAviso } from '../context/ToastContext';
import { api } from '../services/api';
import { listaDados, mensagemErro, precoBR } from '../utils/helpers';

export function NovaVendaScreen({navigation}){
  const {perfil}=useAuth();const avisar=useAviso();
  const [nomeCliente,setNomeCliente]=useState('');
  const [produtos,setProdutos]=useState([]);
  const [selecionado,setSelecionado]=useState(null);
  const [quantidade,setQuantidade]=useState('1');
  const [itens,setItens]=useState([]);
  const [menu,setMenu]=useState(false);
  const [carregando,setCarregando]=useState(true);
  const [ocupado,setOcupado]=useState(false);const [erro,setErro]=useState('');
  useEffect(()=>{let ativo=true;
    api.get(`/app/produtos/${encodeURIComponent(perfil?.usuario||'')}`)
      .then(r=>{if(ativo)setProdutos(listaDados(r.data));})
      .catch(e=>{if(ativo)setErro(mensagemErro(e));})
      .finally(()=>{if(ativo)setCarregando(false);});
    return()=>{ativo=false;};
  },[perfil?.usuario]);
  function adicionar(){
    const qtd=Number(quantidade);
    if(!selecionado){setErro('Escolha um produto.');return;}
    if(!Number.isInteger(qtd)||qtd<=0){setErro('Quantidade deve ser um número inteiro maior que zero.');return;}
    const existente=itens.find(i=>i.id===selecionado._id);
    const totalQ=(existente?.quantidade||0)+qtd;
    if(totalQ>Number(selecionado.quantidade||0)){setErro('Quantidade maior que o estoque cadastrado.');return;}
    const dados={id:selecionado._id,nome:selecionado.nome,quantidade:totalQ,preco:Number(selecionado.preco)};
    setItens(existente?itens.map(i=>i.id===selecionado._id?dados:i):[...itens,dados]);
    setErro('');setSelecionado(null);setQuantidade('1');
  }
  async function salvar(){
    if(!nomeCliente.trim()){setErro('Informe o nome do cliente.');return;}
    if(!itens.length){setErro('Adicione pelo menos um produto à venda.');return;}
    setErro('');setOcupado(true);
    const dados={nomeCliente:nomeCliente.trim(),data:new Date().toISOString(),usuario:perfil.usuario,
      produtos:itens.map(({nome,quantidade,preco})=>({nome,quantidade,preco}))};
    try{await api.post('/app/venda',dados);avisar('Venda registrada com sucesso.');navigation.goBack();}
    catch(e){setErro(mensagemErro(e));}finally{setOcupado(false);}
  }
  const total=itens.reduce((acc,p)=>acc+p.preco*p.quantidade,0);
  return <Pagina titulo="Registrar venda">
    <Text variant="titleMedium">Dados da venda</Text>
    <TextInput mode="outlined" label="Nome do cliente" value={nomeCliente} onChangeText={setNomeCliente} style={s.campo}/>
    <Text style={s.ajuda}>Data: {new Date().toLocaleDateString('pt-BR')} (registrada pela API no momento de salvar)</Text>
    <Text variant="titleMedium" style={{marginTop:10}}>Produtos vendidos</Text>
    {carregando?<ActivityIndicator/>:produtos.length===0?<EstadoVazio titulo="Sem produtos cadastrados" descricao="Cadastre produtos para registrar uma venda."/>:<Card style={s.cartao}><Card.Content style={{gap:12}}>
      <Menu visible={menu} onDismiss={()=>setMenu(false)} anchor={<Button mode="outlined" icon="chevron-down" onPress={()=>setMenu(true)}>{selecionado?`${selecionado.nome} (${precoBR(selecionado.preco)})`:'Escolher produto'}</Button>}>
        {produtos.map(p=><Menu.Item key={p._id} title={`${p.nome} • ${precoBR(p.preco)}`} onPress={()=>{setSelecionado(p);setMenu(false);}}/>)}
      </Menu>
      <TextInput mode="outlined" label="Quantidade" keyboardType="number-pad" value={quantidade} onChangeText={setQuantidade} style={s.campo}/>
      <Button mode="outlined" icon="plus" onPress={adicionar}>Adicionar à venda</Button>
    </Card.Content></Card>}
    {itens.map(p=><Card style={s.cartao} key={p.id}><Card.Title title={p.nome} subtitle={`${p.quantidade} × ${precoBR(p.preco)} = ${precoBR(p.preco*p.quantidade)}`}/>
      <Card.Actions><Button icon="minus-circle-outline" textColor="#B83D3D" onPress={()=>setItens(itens.filter(x=>x.id!==p.id))}>Retirar</Button></Card.Actions></Card>)}
    <Text variant="titleLarge" style={s.label}>Total: {precoBR(total)}</Text>
    {erro?<HelperText type="error" visible>{erro}</HelperText>:null}
    <Button mode="contained" icon="check" style={s.principal} loading={ocupado} disabled={ocupado||carregando} onPress={salvar}>Confirmar registro de venda</Button>
    <Text style={s.ajuda}>O backend registra a venda, mas não processa pagamento nem desconta o estoque automaticamente.</Text>
  </Pagina>;
}
