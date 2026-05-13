import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchHinarioGrupo, removeHinoFromGrupo } from '../../src/api/api';
import { AuthContext } from '../../src/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HinarioReg({ navigateTo }) {
  const { id_grupo } = useContext(AuthContext);   
  const [hinosGrupo, setHinosGrupo] = useState([]);
  const [filteredHinos, setFilteredHinos] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const getHinario = async () => {
      try {
        const data = await fetchHinarioGrupo(id_grupo);

        // ✅ GARANTIA DE ARRAY
        const safeData = Array.isArray(data) ? data : [];

        setHinosGrupo(safeData);
        setFilteredHinos(safeData);
      } catch (error) {
        console.error('Erro ao obter hinos:', error);
        setHinosGrupo([]);
        setFilteredHinos([]);
      }
    };

    if (id_grupo) {
      getHinario();
    }
  }, [id_grupo]);


  const handleRemoveHino = async (id_hino) => {
    try {
      await removeHinoFromGrupo(id_grupo, id_hino);
      Alert.alert('Sucesso', 'Hino removido do grupo com sucesso!');

      const updated = hinosGrupo.filter(hino => hino._id !== id_hino);
      setHinosGrupo(updated);
      setFilteredHinos(updated);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao remover hino do grupo.');
      console.error(error);
    }
  };

  
  const removeAccents = (str) => {
    return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
  };

  useEffect(() => {
    const filtered = hinosGrupo.filter(hino =>
      removeAccents(hino?.titulo?.toLowerCase() || '')
        .includes(removeAccents(searchText.toLowerCase()))
    );

    setFilteredHinos(filtered);
  }, [searchText, hinosGrupo]); 

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

          <Text style={{paddingLeft: 15, ...styles.h2}}>Hinário</Text>

          <TouchableOpacity onPress={() => navigateTo('AdicionarHino')}>
            <Text style={{...styles.backButton, ...styles.btn}}>+</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TextInput
            style={styles.searchBar}
            placeholder="&#x1F50D; Buscar hino..."
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          {filteredHinos.length > 0 ? (
            filteredHinos.map((hino) => (
              <TouchableOpacity
                key={hino.numero}
                style={styles.lista}
                data={filteredHinos}
                onPress={() => navigateTo('HinarioGrupo', hino)}
              >
                <Text style={styles.item}>{hino.titulo} - {hino.autor}</Text>
                <TouchableOpacity onPress={() => handleRemoveHino(hino._id)} style={styles.removeButton}>
                  <Image style={styles.removeButtonText} source={require('../../assets/icons/lixo.png')}/>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <Text>Nenhum hino encontrado.</Text>
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
  searchBar: {
    padding: 18,
    backgroundColor: '#FFFAE1',
    borderWidth: 2,
    borderColor: '#FFCB69',
    fontFamily: 'Poppins_600SemiBold', 
    marginHorizontal: 5,
    marginBottom: 12,
    borderRadius: 12,
    color: '#BA9D36'
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  item: {
    padding: 18,
    width: 360,
    marginHorizontal: 5,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#FFFAE1',
    fontFamily: 'Poppins_600SemiBold',  
    color: '#BA9D36'
  },
  title: {
    fontSize: 18,
  },    
  titleContainer:{
    paddingVertical: 10,
    paddingLeft: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  lista: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#FFCB69',
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5
  },
  btn: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    left: 195
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
  }
})