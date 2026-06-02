import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchComponentes, removeComponentFromGrupo } from '../../src/api/api';
import { AuthContext } from '../../src/contexts/AuthContext';
import { useOnboarding } from '../../src/contexts/OnboardingContext';

export default function MaisComp({ navigateTo }) {
  const [componentes, setComponentes] = useState([]);
  const [idUser, setidUser] = useState(null);
  const { id_grupo, user, logout } = useContext(AuthContext);
  const { resetOnboarding } = useOnboarding();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchComponentes(id_grupo); 
        setComponentes(response);
        const currentUser = response.find(user => user.tipo_usuario === 'Componente'); 
        if (currentUser) setidUser(currentUser.id_usuario);
      } catch (error) {
        console.error('Erro ao buscar componentes:', error);
      }
    };
    fetchData();
  }, []);


  const handleRemove = async () => {
    if (!idUser) return console.error('ID do usuário não encontrado.');

    try {
      const response = await removeComponentFromGrupo(user.id_user);
      if (response) {
        setComponentes(prevState => prevState.filter(comp => comp.id_usuario !== idUser));
        logout();        
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

            <TouchableOpacity onPress={() => { logout(); resetOnboarding(); }} style={styles.item} activeOpacity={0.7}>
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