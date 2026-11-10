import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar, Button, Card, Text } from 'react-native-paper';
import { Pagina, Carregando, ErroLista } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { listaDados, mensagemErro } from '../utils/helpers';
import { colors } from '../theme';

export function DashboardScreen({ navigation }) {
  const { perfil } = useAuth();
  const [contagens,setContagens]=useState(null);
  const [carregando,setCarregando]=useState(true);
  const [erro,setErro]=useState('');
  const carregar=useCallback(async()=>{
    if(!perfil?.usuario)return;
    setCarregando(true);setErro('');
    try{
      const [cats,prods,vendas]=await Promise.all([
        api.get('/app/categorias'),
        api.get(`/app/produtos/${encodeURIComponent(perfil.usuario)}`),
        api.get('/app/venda')
      ]);
      setContagens({categorias:listaDados(cats.data).length,produtos:listaDados(prods.data).length,vendas:listaDados(vendas.data).length});
    }catch(e){setErro(mensagemErro(e));}finally{setCarregando(false);}
  },[perfil?.usuario]);
  useFocusEffect(useCallback(()=>{carregar();},[carregar]));
  const menus=[
    {nome:'Categorias',icone:'shape-outline',descricao:'Organize os grupos dos produtos',rota:'Categorias'},
    {nome:'Produtos',icone:'package-variant-closed',descricao:'Cadastre, edite e consulte seu catálogo',rota:'Produtos'},
    {nome:'Vendas',icone:'receipt-text-outline',descricao:'Registre e acompanhe pedidos',rota:'Vendas'},
    {nome:'Meu perfil',icone:'account-circle-outline',descricao:'Informações da conta e sessão',rota:'Perfil'},
  ];
  return <Pagina titulo="Painel da loja" voltar={false} acao={<Appbar.Action icon="logout" onPress={()=>navigation.navigate('Sair')}/>}>
    <View style={styles.hero}>
      <Text style={styles.heroSub}>ÁREA ADMINISTRATIVA</Text>
      <Text variant="headlineSmall" style={styles.heroTitulo}>Olá, {perfil?.usuario || 'administrador'}.</Text>
      <Text style={styles.heroTexto}>Sua loja em um só lugar.</Text>
    </View>
    <Text variant="titleMedium" style={styles.heading}>Visão geral</Text>
    {carregando?<Carregando/>:erro?<ErroLista texto={erro} tentar={carregar}/>:<View style={styles.grid}>
      {Object.entries(contagens || {}).map(([nome,numero])=><Card key={nome} style={styles.metrica}><Card.Content>
        <Text variant="headlineSmall" style={styles.num}>{numero}</Text>
        <Text style={styles.legenda}>{nome.charAt(0).toUpperCase()+nome.slice(1)}</Text>
      </Card.Content></Card>)}
    </View>}
    <Text variant="titleMedium" style={styles.heading}>Gerenciar loja</Text>
    {menus.map(x=><Card key={x.rota} style={styles.cartao} onPress={()=>navigation.navigate(x.rota)}><Card.Title
      title={x.nome} subtitle={x.descricao} left={props=><View style={styles.icone}><Text style={{color:colors.primary,fontWeight:'700',fontSize:20}}>{x.nome[0]}</Text></View>}
      right={props=><Button icon="chevron-right" onPress={()=>navigation.navigate(x.rota)}>Abrir</Button>}/></Card>)}
    <Button mode="outlined" icon="refresh" onPress={carregar}>Atualizar indicadores</Button>
  </Pagina>;
}
const styles=StyleSheet.create({
  hero:{backgroundColor:colors.primary,borderRadius:18,padding:22,gap:7},heroSub:{fontSize:11,letterSpacing:2,color:'#BBE4D6'},
  heroTitulo:{color:'white',fontWeight:'800'},heroTexto:{color:'#D9ECE4'},
  heading:{fontWeight:'700',color:colors.text,marginTop:14,marginBottom:2},
  grid:{flexDirection:'row',gap:8},metrica:{flex:1,backgroundColor:'white'},num:{color:colors.primary,fontWeight:'800'},legenda:{fontSize:12,color:colors.muted},
  cartao:{backgroundColor:'white'},icone:{height:42,width:42,borderRadius:13,backgroundColor:colors.soft,alignItems:'center',justifyContent:'center'}
});
