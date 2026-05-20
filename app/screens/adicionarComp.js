import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchUsuariosParaComponentes } from '../../src/api/api';
import { AuthContext } from '../../src/contexts/AuthContext';
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
  });

  if (!fontLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigateTo('Componentes')}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>

        <Text style={{ paddingLeft: 15, ...styles.h2 }}>Novo Componente</Text>

        <View style={{ width: 52 }} />
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Buscar usuário..."
        placeholderTextColor="#64A95F"
        value={searchText}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredUsuarios}
        keyExtractor={(item) => item.id_usuario.toString()}
        renderItem={({ item }) => (
          <View style={styles.lista}>
            <View style={styles.usuarioItem}>
              <View style={styles.usuarioContent}>
                <Text style={styles.usuarioTitle}>{item.nome}</Text>
                <Text style={styles.usuarioText}>{item.tipo_usuario}</Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAdicionarComponente(item.id_usuario)}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <Text style={styles.noResultsText}>
            {searchText ? "Nenhum usuário encontrado." : "Digite para buscar usuários."}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    flex: 1,
  },
  titleContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#64A95F',
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  searchBar: {
    padding: 16,
    backgroundColor: '#E2FFE3',
    borderWidth: 2,
    borderColor: '#64A95F',
    fontFamily: 'Poppins_600SemiBold',
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 12,
    color: '#64A95F',
  },
  usuarioItem: {
    padding: 12,
    backgroundColor: '#E2FFE3',
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  usuarioContent: {
    flex: 1,
  },
  usuarioTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#64A95F',
    marginBottom: 3,
  },
  usuarioText: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    color: '#64A95F',
  },
  lista: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#64A95F',
    borderRadius: 15,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    color: '#64A95F',
    marginTop: 20,
  },
});
