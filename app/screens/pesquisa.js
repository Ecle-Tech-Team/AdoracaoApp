import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchHinosByHinario, fetchHinosGeral } from '../../src/api/api';

const removeAccents = (str) =>
  str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';

export default function Pesquisa({ navigateTo }) {
  const [searchText, setSearchText] = useState('');
  const [todosHinos, setTodosHinos] = useState([]);
  const [filteredHinos, setFilteredHinos] = useState([]);

  useEffect(() => {
    const loadHinos = async () => {
      try {
        // 🔹 TODOS OS HINÁRIOS
        const harpa = await fetchHinosByHinario('harpa');
        const ccb = await fetchHinosByHinario('ccb');

        // 🔹 HINOS GERAIS
        const geral = await fetchHinosGeral();

        // 🔹 Normaliza os dados
        const hinosHinarios = [...harpa, ...ccb].map(h => ({
          ...h,
          tipo_hino: h.tipo_hino || 'HARPA'
        }));

        const hinosGerais = geral.map(h => ({
          ...h,
          tipo_hino: h.tipo_hino || 'GERAL'
        }));

        const all = [...hinosHinarios, ...hinosGerais];

        setTodosHinos(all);
        setFilteredHinos(all);
      } catch (error) {
        console.error('Erro ao carregar hinos:', error);
      }
    };

    loadHinos();
  }, []);

  useEffect(() => {
    const filtered = todosHinos.filter(hino =>
      hino.titulo &&
      removeAccents(hino.titulo.toLowerCase()).includes(
        removeAccents(searchText.toLowerCase())
      ) ||
      (hino.tipo_hino !== 'GERAL' &&
        hino.numero?.toString().includes(searchText))
    );

    setFilteredHinos(filtered);
  }, [searchText, todosHinos]);

  const handleSelectHino = (hino) => {
    navigateTo('Hino', hino, 'Pesquisa');
  };

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_700Bold,
    Poppins_600SemiBold
  });

  if (!fontLoaded) return null;

  return (
    <View>
      <Text style={{ paddingLeft: 15, ...styles.h2 }}>Pesquisa</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Buscar hino..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {filteredHinos.length > 0 ? (
        <FlatList
          data={filteredHinos}
          keyExtractor={(item, index) =>
            item._id ? item._id : `geral-${index}`
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.hinoItem}
              onPress={() => handleSelectHino(item)}
            >
              <Text style={styles.hinoText}>
                {item.tipo_hino !== 'GERAL'
                  ? `${item.numero} - ${item.titulo}`
                  : `${item.titulo}${item.autor ? ` · ${item.autor}` : ''}`}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noResults}>Nenhum hino encontrado.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold'
  },
  searchBar: {
    padding: 18,
    backgroundColor: '#FFFAE1',
    borderWidth: 2,
    borderColor: '#FFCB69',
    borderRadius: 12,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 12,
    color: '#BA9D36'
  },
  hinoItem: {
    padding: 18,
    borderRadius: 10,
    backgroundColor: '#FFFAE1',
    marginBottom: 10
  },
  hinoText: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#BA9D36'
  },
  noResults: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#B8AB7D'
  }
});