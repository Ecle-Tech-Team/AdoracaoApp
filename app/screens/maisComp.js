import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useContext } from 'react'
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { removeComponentFromGrupo } from '../../src/api/api';
import { AuthContext } from '../../src/contexts/AuthContext';

export default function MaisComp({ navigateTo }) {
  const { user, logout, refreshUser } = useContext(AuthContext);

  const handleRemove = async () => {
    if (!user?.id_user) return console.error('ID do usuário não encontrado.');

    try {
      const response = await removeComponentFromGrupo(user.id_user);
      if (response) {
        await refreshUser();
        Alert.alert('Você saiu do grupo');
      } else {
        console.error('Erro ao remover componente');
      }
    } catch (error) {
      console.error('Erro ao remover componente:', error);
    }
  };




  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_700Bold, Poppins_600SemiBold
  })

  if (!fontLoaded) {
    return null;
  };

  return (
    <View>
      <View>
        <View>
          <Text style={{paddingLeft: 15, ...styles.h2}}>Mais</Text>

          <View style={{marginTop: 20}}>
            <TouchableOpacity style={styles.item} activeOpacity={0.7}>
              <Text style={styles.itemText}>Editar Perfil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.item} activeOpacity={0.7}>
              <Text style={styles.itemText}>Redefinir Senha</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRemove} style={styles.item} activeOpacity={0.7}>
              <Text style={styles.itemText}>Sair do Grupo</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigateTo('MudarHinario')} style={styles.item} activeOpacity={0.7}>
              <Text style={styles.itemText}>Mudar Hinário</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={logout} style={styles.item} activeOpacity={0.7}>
              <Text style={styles.itemText}>Encerrar Sessão</Text>
            </TouchableOpacity>
          </View>

          <View style={{marginTop: 40}}>
            <TouchableOpacity style={styles.item} activeOpacity={0.7}>
                <Text style={styles.itemText}>Suporte</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.item} activeOpacity={0.7}>
                <Text style={styles.itemText}>Privacidade</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} activeOpacity={0.7}>
                <Text style={styles.itemText}>Termos e Condições</Text>
            </TouchableOpacity>            
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold'    
  },
  h3: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    color: '#BFBFBF',    
  },
  txt: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    color: '#BFBFBF',
    lineHeight: 14
  },
  item: {
    padding: 14,
    marginHorizontal: 5,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#FFCB69',
    
  },
  itemText: {
    fontFamily: 'Poppins_600SemiBold',  
    color: '#fff'
  }
})
