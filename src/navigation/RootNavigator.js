import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { RegistroScreen } from '../screens/RegistroScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { CategoriasScreen } from '../screens/CategoriasScreen';
import { CategoriaFormScreen } from '../screens/CategoriaFormScreen';
import { ProdutosScreen } from '../screens/ProdutosScreen';
import { ProdutoFormScreen } from '../screens/ProdutoFormScreen';
import { ProdutoDetalheScreen } from '../screens/ProdutoDetalheScreen';
import { VendasScreen } from '../screens/VendasScreen';
import { NovaVendaScreen } from '../screens/NovaVendaScreen';
import { VendaDetalheScreen } from '../screens/VendaDetalheScreen';
import { PerfilScreen } from '../screens/PerfilScreen';
import { SairScreen } from '../screens/SairScreen';

const Stack=createNativeStackNavigator();
export function RootNavigator(){
  const {perfil}=useAuth();
  return <Stack.Navigator screenOptions={{headerShown:false,animation:'slide_from_right'}}>
    {perfil ? <Stack.Group navigationKey="autenticado">
      <Stack.Screen name="Dashboard" component={DashboardScreen}/>
      <Stack.Screen name="Categorias" component={CategoriasScreen}/>
      <Stack.Screen name="CategoriaForm" component={CategoriaFormScreen}/>
      <Stack.Screen name="Produtos" component={ProdutosScreen}/>
      <Stack.Screen name="ProdutoForm" component={ProdutoFormScreen}/>
      <Stack.Screen name="ProdutoDetalhe" component={ProdutoDetalheScreen}/>
      <Stack.Screen name="Vendas" component={VendasScreen}/>
      <Stack.Screen name="NovaVenda" component={NovaVendaScreen}/>
      <Stack.Screen name="VendaDetalhe" component={VendaDetalheScreen}/>
      <Stack.Screen name="Perfil" component={PerfilScreen}/>
      <Stack.Screen name="Sair" component={SairScreen}/>
    </Stack.Group> : <Stack.Group navigationKey="publico">
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="Registro" component={RegistroScreen}/>
    </Stack.Group>}
  </Stack.Navigator>;
}
