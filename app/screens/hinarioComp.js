import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchHinarioGrupo } from '../../src/api/api';
import { AuthContext } from '../../src/contexts/AuthContext';

export default function HinarioComp({ navigateTo }) {
  const { id_grupo } = useContext(AuthContext);
  const [hinosGrupo, setHinosGrupo] = useState([]);
  const [filteredHinos, setFilteredHinos] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const getHinario = async () => {
      try {
        const data = await fetchHinarioGrupo(id_grupo);
        const safeData = Array.isArray(data) ? data : [];
        setHinosGrupo(safeData);
        setFilteredHinos(safeData);
      } catch (error) {
        console.error('Erro ao obter hinos:', error);
      }
    };
    getHinario();

  }, [id_grupo]);

  const removeAccents = (str) => {
    return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
  };

  useEffect(() => {
    if (Array.isArray(hinosGrupo)) {
      const filtered = hinosGrupo.filter((hino) =>
        (hino.titulo && removeAccents(hino.titulo.toLowerCase()).includes(removeAccents(searchText.toLowerCase()))) ||
        (hino.numero && hino.numero.toString().includes(searchText))
      );
      setFilteredHinos(filtered);
    } else {
      setFilteredHinos([]);
    }
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
          <TouchableOpacity onPress={() => navigateTo('GrupoComp')}>
            <Text style={styles.backButton}>&#60;</Text>
          </TouchableOpacity>

          <Text style={{paddingLeft: 15, ...styles.h2}}>Hinário</Text>
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
                <View style={styles.hinoContent}>
                  <Text style={styles.item}>{hino.titulo} - {hino.autor}</Text>
                  {hino.tag ? (
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagBadgeText}>{hino.tag}</Text>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhum hino encontrado.</Text>
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
  hinoContent: {
    flex: 1,
    flexDirection: 'column',
  },
  item: {
    padding: 18,
    paddingBottom: 8,
    marginHorizontal: 5,
    marginBottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#FFFAE1',
    fontFamily: 'Poppins_600SemiBold',
    color: '#BA9D36',
  },
  tagBadge: {
    backgroundColor: '#FFCB69',
    alignSelf: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 10,
    marginTop: -4,
    marginRight: 5,
  },
  tagBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  title: {
    fontSize: 18,
  },
  titleContainer: {
    paddingVertical: 10,
    paddingLeft: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  lista: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  backButton: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#FFCB69',
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    paddingLeft: 10,
  },
})
