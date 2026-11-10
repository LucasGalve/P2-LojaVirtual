import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Button, Card, Dialog, Paragraph, Portal, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';

export function Pagina({ titulo, children, acao, voltar = true }) {
  const navigation = useNavigation();
  return <View style={s.raiz}>
    <Appbar.Header style={s.cabecalho}>
      {voltar && navigation.canGoBack() ? <Appbar.BackAction onPress={() => navigation.goBack()} /> : null}
      <Appbar.Content title={titulo} titleStyle={s.titulo} />
      {acao}
    </Appbar.Header>
    <ScrollView contentContainerStyle={s.conteudo} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  </View>;
}

export function Carregando({ texto = 'Buscando informações...' }) {
  return <View style={s.centro}><ActivityIndicator size="large" /><Text style={s.ajuda}>{texto}</Text></View>;
}
export function EstadoVazio({ titulo, descricao }) {
  return <Card style={s.cartao}><Card.Content>
    <Text variant="titleMedium" style={s.label}>{titulo}</Text>
    <Text style={s.ajuda}>{descricao}</Text>
  </Card.Content></Card>;
}
export function ErroLista({ texto, tentar }) {
  return <Card style={s.cartao}><Card.Content>
    <Text style={{ color: colors.danger }}>{texto}</Text>
    {tentar && <Button onPress={tentar}>Tentar novamente</Button>}
  </Card.Content></Card>;
}
export function Confirmar({ visivel, titulo, descricao, ocupada, cancelar, confirmar }) {
  return <Portal><Dialog visible={visivel} onDismiss={cancelar}>
    <Dialog.Title>{titulo || 'Confirmar exclusão'}</Dialog.Title>
    <Dialog.Content><Paragraph>{descricao || 'Essa ação não pode ser desfeita.'}</Paragraph></Dialog.Content>
    <Dialog.Actions>
      <Button onPress={cancelar} disabled={ocupada}>Cancelar</Button>
      <Button textColor={colors.danger} loading={ocupada} disabled={ocupada} onPress={confirmar}>Excluir</Button>
    </Dialog.Actions>
  </Dialog></Portal>;
}
export function LinhaInfo({ rotulo, valor }) {
  return <View style={s.linha}><Text style={s.ajuda}>{rotulo}</Text><Text selectable style={s.valor}>{String(valor ?? '—')}</Text></View>;
}
export const s = StyleSheet.create({
  raiz:{ flex:1, backgroundColor:colors.background },
  cabecalho:{backgroundColor:colors.background},
  titulo:{fontWeight:'700', color:colors.text},
  conteudo:{padding:18,paddingBottom:50,gap:12},
  centro:{alignItems:'center',paddingVertical:40,gap:12},
  ajuda:{color:colors.muted,marginTop:4,lineHeight:21},
  cartao:{backgroundColor:colors.surface,borderRadius:16,marginBottom:4},
  label:{fontWeight:'700',color:colors.text},
  linha:{marginVertical:6},
  valor:{fontSize:16,color:colors.text,marginTop:2},
  botoes:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:10},
  campo:{backgroundColor:colors.surface,marginBottom:3},
  principal:{marginTop:10, borderRadius:10},
  divisao:{height:1,backgroundColor:colors.line,marginVertical:8}
});
