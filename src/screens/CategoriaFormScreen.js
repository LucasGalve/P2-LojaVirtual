import React, { useState } from 'react';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { Pagina, s } from '../components/UI';
import { useAviso } from '../context/ToastContext';
import { api } from '../services/api';
import { mensagemErro } from '../utils/helpers';

export function CategoriaFormScreen({ route, navigation }) {
  const item=route.params?.item;const avisar=useAviso();
  const [nome,setNome]=useState(item?.nome||'');const [ocupado,setOcupado]=useState(false);const [erro,setErro]=useState('');
  async function salvar(){
    if(!nome.trim()){setErro('Informe o nome da categoria.');return;}
    setOcupado(true);setErro('');
    try{
      if(item)await api.put('/app/categorias',{id:item._id,nome_categoria:nome.trim()});
      else await api.post('/app/categorias',{nome_categoria:nome.trim()});
      avisar(item?'Categoria atualizada.':'Categoria cadastrada.');navigation.goBack();
    }catch(e){setErro(mensagemErro(e));}finally{setOcupado(false);}
  }
  return <Pagina titulo={item?'Editar categoria':'Nova categoria'}>
    <Text variant="titleMedium">Dados da categoria</Text>
    <TextInput mode="outlined" label="Nome da categoria" value={nome} onChangeText={setNome} style={s.campo} placeholder="Ex.: Informática"/>
    {erro?<HelperText type="error" visible>{erro}</HelperText>:null}
    <Button style={s.principal} mode="contained" icon="content-save" onPress={salvar} loading={ocupado} disabled={ocupado}>Salvar categoria</Button>
  </Pagina>;
}
