import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchUsuariosParaComponentes } from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

export default function AdicionarComp({ navigateTo }) {
  const { id_grupo } = useContext(AuthContext); 
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchText, setSearchText] = useState('');
  
  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const data = await fetchUsuariosParaComponentes();
        setUsuarios(data);        
      } catch (error) {
        console.error('Erro ao carregar usuários para componentes:', error);
      }
    };

    loadUsuarios();
  }, []);

  const adicionarComponenteAoGrupo = async (idUser, id_grupo) => {
    try {

      const response = await axios.post(`https://api.adoracaoapp.com.br/user/addComponente/${idUser}/${id_grupo}`);
      return response.data;      
    } catch (error) {
      console.error('Erro ao adicionar componente ao grupo:', error);
      throw error;
    }
  };

  const handleAdicionarComponente = async (idUser) => {
    try {
      await adicionarComponenteAoGrupo(idUser, id_grupo);
      Alert.alert('Sucesso', 'Componente adicionado ao grupo com sucesso!');
      setUsuarios(usuarios.filter(user => user.id_usuario !== idUser)); 
      setFilteredUsuarios(filteredUsuarios.filter(user => user.id_usuario !== idUser));
    } catch (error) {
      Alert.alert('Erro', 'Erro ao adicionar componente ao grupo.');
      console.error(error);
    }
  };
  

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = usuarios.filter((user) =>
        user.nome.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsuarios(filtered);
    } else {
      setFilteredUsuarios([]); 
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
          <TouchableOpacity onPress={() => navigateTo('Componentes')}>
            <Text style={styles.backButton}>&#60;</Text>
          </TouchableOpacity>    

          <Text style={{paddingLeft: 7, ...styles.h2}}>Adicionar Componente</Text>

          <TouchableOpacity onPress={() => navigateTo('AdicionarComp')}>
            <Text style={{...styles.backButton, ...styles.btn}}>+</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TextInput
            style={styles.searchBar}
            placeholder="&#x1F50D; Buscar componente..."
            value={searchText}
            onChangeText={handleSearch}
          />
          {filteredUsuarios.length > 0 ? (
          <FlatList
            data={filteredUsuarios}
            keyExtractor={(item) => item.id_usuario.toString()}
            renderItem={({ item }) => (
              <View style={styles.usuarioContainer}>
                <Text style={styles.usuarioText}>{item.nome} - {item.tipo_usuario}</Text>
                <TouchableOpacity 
                  style={styles.addButton} 
                  onPress={() => handleAdicionarComponente(item.id_usuario)}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noResultsText}>Digite para buscar usuários.</Text>
          )}
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
    color: 'white',
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
    left: 10
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
  usuarioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#E2FFE3',
  },
  usuarioText: {
    fontSize: 16,
    color: '#39DA36',
    fontFamily: 'Poppins_600SemiBold'
  },
  addButton: {
    backgroundColor: '#64A95F',
    borderRadius: 15,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  noResultsText: {
    textAlign: "center",
    fontFamily: 'Poppins_600SemiBold',
  }
})