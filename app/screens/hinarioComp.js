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
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigateTo('GrupoComp')}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>

        <Text style={{paddingLeft: 15, ...styles.h2}}>Hinário</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="&#x1F50D; Buscar hino..."
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />

      <View style={styles.listContainer}>
        {filteredHinos.length > 0 ? (
          filteredHinos.map((hino) => (
            <View key={hino.numero || hino._id} style={styles.hinoItemWrapper}>
              <TouchableOpacity
                style={styles.hinoItem}
                onPress={() => navigateTo('HinarioGrupo', hino)}
                activeOpacity={0.7}
              >
                <View style={styles.hinoTextContainer}>
                  <Text style={styles.hinoTitle}>{hino.titulo}</Text>
                  <View style={styles.hinoMetaRow}>
                    <Text style={styles.hinoAutor}>{hino.autor}</Text>
                    {hino.tag ? (
                      <View style={styles.tagBadge}>
                        <Text style={styles.tagBadgeText}>{hino.tag}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum hino encontrado.</Text>
        )}
      </View>
    </View>
  )
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
  searchBar: {
    padding: 18,
    backgroundColor: '#FFFAE1',
    borderWidth: 2,
    borderColor: '#FFCB69',
    fontFamily: 'Poppins_600SemiBold',
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 12,
    color: '#BA9D36'
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  hinoItemWrapper: {
    marginBottom: 12,
    position: 'relative',
  },
  hinoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 10,
    backgroundColor: '#FFFAE1',
  },
  hinoTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  hinoTitle: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#BA9D36',
    fontSize: 16,
  },
  hinoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hinoAutor: {
    fontFamily: 'Nunito_500Medium',
    color: '#A68B2E',
    fontSize: 13,
  },
  tagBadge: {
    backgroundColor: '#FFCB69',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  tagBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Poppins_600SemiBold',
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
