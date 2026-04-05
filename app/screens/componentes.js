import { StyleSheet, Text, Image, View, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchComponentes } from '../api/api';
import { AuthContext } from '../contexts/AuthContext';

export default function Componentes({ navigateTo }) {
  const { id_grupo } = useContext(AuthContext); 
  const [componentes, setComponentes] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const loadComponentes = async () => {
      try {
        const data = await fetchComponentes(id_grupo);
        setComponentes(data);        
      } catch (error) {
        console.error('Erro ao carregar usuários para componentes:', error);
      }
    };

    loadComponentes();
  }, [id_grupo]);

  const handleRemove = async (id_usuario) => {
    try {
      const response = await fetch(`https://api.adoracaoapp.com.br/user/removeComponente/${id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo_usuario: 'Adorador',  
          id_grupo: null, 
        }),
      });
  
      if (response.ok) {
        
        setComponentes(prevState => prevState.filter(comp => comp.id_usuario !== id_usuario));
      } else {
        console.error('Erro ao remover componente');
      }
    } catch (error) {
      console.error('Erro ao remover componente:', error);
    }
  };  

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_700Bold,
    Poppins_600SemiBold
  })

  if (!fontLoaded) {
    return null;
  };
  
  return (
    <View>
      <View>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={() => navigateTo('GrupoReg')}>
            <Text style={styles.backButton}>&#60;</Text>
          </TouchableOpacity>    

          <Text style={{paddingLeft: 15, ...styles.h2}}>Componentes</Text>

          <TouchableOpacity onPress={() => navigateTo('AdicionarComp')}>
            <Text style={{...styles.backButton, ...styles.btn}}>+</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TextInput
            style={styles.searchBar}
            placeholder="&#x1F50D; Buscar componente..."
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />

          <FlatList
            data={componentes}            
            keyExtractor={(item) => item.id_usuario.toString()}
            renderItem={({ item }) => (
              <View style={{...styles.componenteContainer, ...styles.lista}}>
                <Text style={styles.componenteText}>{item.nome}</Text>
                <TouchableOpacity onPress={() => handleRemove(item.id_usuario)} style={styles.removeButton}>
                  <Image source={require('../../assets/icons/lixo-comp.png')}/>
                </TouchableOpacity>                
              </View>
            )}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',  
    marginBottom: 15  
  },
  titleContainer:{
    paddingVertical: 10,
    paddingLeft: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  backButton: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#64A95F',
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5
  },
  btn: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    left: 114
  },
  searchBar: {
    padding: 18,
    backgroundColor: '#E2FFE3',
    borderWidth: 2,
    borderColor: '#64A95F',
    fontFamily: 'Poppins_600SemiBold', 
    marginHorizontal: 5,
    marginBottom: 12,
    borderRadius: 12,
    color: '#39DA36'
  },
  componenteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
  },
  componenteText: {
    fontSize: 16,
    color: '#39DA36',
    fontFamily: 'Poppins_600SemiBold',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#E2FFE3',
    width: 360,
  },
  lista: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#FFCB69',
    borderRadius: 15,
    marginLeft: 8,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30
  },
})