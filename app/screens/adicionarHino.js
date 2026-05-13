import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchHinosGeral, fetchHinarioGrupo } from '../../src/api/api'; 
import { AuthContext } from '../../src/contexts/AuthContext';
import axios from 'axios';

export default function AdicionarHino({ navigateTo }) {
    const { id_grupo } = useContext(AuthContext);
    const [hinos, setHinos] = useState([]);
    const [filteredHinos, setFilteredHinos] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [hinosExistentes, setHinosExistentes] = useState([]);

    useEffect(() => {
      // Busca os hinos do hinário do grupo para evitar duplicação
      const loadHinarioGrupo = async () => {
        try {
          const existingHinos = await fetchHinarioGrupo(id_grupo);

          // ✅ GARANTIA DE ARRAY
          const safeHinos = Array.isArray(existingHinos) ? existingHinos : [];

          setHinosExistentes(safeHinos.map(hino => hino._id));
        } catch (error) {
          console.error('Erro ao carregar o hinário do grupo:', error);
          setHinosExistentes([]);
        }
      };

  
      // Carrega todos os hinos disponíveis para adição
      const loadHinos = async () => {
        try {
          const allHinos = await fetchHinosGeral();
          setHinos(allHinos);
          setFilteredHinos(allHinos);
        } catch (error) {
          console.error('Erro ao carregar hinos:', error);
        }
      };
  
      loadHinarioGrupo();
      loadHinos();
    }, [id_grupo]);
    
    const addHinoToGrupo = async (id_grupo, hinoId) => {
      try {
        const response = await axios.post(`https://api.adoracaoapp.com.br/grupo/${id_grupo}/hinos`, { hinoId });
        return response.data;
      } catch (error) {
        console.error('Erro ao adicionar hino ao grupo:', error);
        throw error;
      }
    };
    
    const handleAddHino = async (hinoId) => {
        try {
          await addHinoToGrupo(id_grupo, hinoId);
          Alert.alert('Sucesso', 'Hino adicionado ao grupo com sucesso!');
          
          // Atualiza os estados para remover o hino adicionado da lista visível
          setHinosExistentes([...hinosExistentes, hinoId]);
          setFilteredHinos(filteredHinos.filter(hino => hino._id !== hinoId));
        } catch (error) {
          Alert.alert('Erro', 'Erro ao adicionar hino ao grupo.');
          console.error(error);
        }
    };

    const removeAccents = (str) => {
        return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
    };

    useEffect(() => {
      const filtered = hinos.filter(hino => 
        !hinosExistentes.includes(hino._id) && 
        (removeAccents(hino.titulo.toLowerCase()).includes(removeAccents(searchText.toLowerCase())) || 
        hino.numero.toString().includes(searchText))
      );
      setFilteredHinos(filtered);
    }, [searchText, hinos, hinosExistentes]);
    
    const [fontLoaded] = useFonts({
        Nunito_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold
    });
    
    if (!fontLoaded) {
        return null;
    }
    
  return (
    <View>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigateTo('HinarioReg')}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>    
        <Text style={{ paddingLeft: 15, ...styles.h2 }}>Adicionar Hino</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="&#x1F50D; Buscar hino..."
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />

      <FlatList
        data={filteredHinos}
        keyExtractor={(item) => item._id} 
        renderItem={({ item }) => (
          <View style={styles.hinoContainer}>
            <Text style={styles.hinoText}>{item.titulo} - {item.autor}</Text>
            <TouchableOpacity onPress={() => handleAddHino(item._id)} style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold'
  },
  titleContainer: {
    paddingVertical: 10,
    paddingLeft: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  backButton: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#FFCB69',
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5
  },
  searchBar: {
    padding: 18,
    backgroundColor: '#FFFAE1',
    borderWidth: 2,
    borderColor: '#FFCB69',
    fontFamily: 'Poppins_600SemiBold', 
    marginHorizontal: 5,
    marginTop: 10,
    marginBottom: 12,
    borderRadius: 12,
    color: '#BA9D36'
  },
  hinoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    backgroundColor: '#FFFAE1',
    marginBottom: 10,
    borderRadius: 10
  },
  hinoText: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#BA9D36',
    marginHorizontal: 5,
  },
  addButton: {
    backgroundColor: '#FFCB69',
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
  }
});
