import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Image, Alert } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchHinosGeral, fetchFavoritos, addFavorito, removeFavorito } from '../../src/api/api';
import { AuthContext } from '../../src/contexts/AuthContext';

export default function Hinario({ navigateTo }) {
  const { user } = useContext(AuthContext);
  const [hinos, setHinos] = useState([]);
  const [filteredHinos, setFilteredHinos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [favoritos, setFavoritos] = useState(new Set());

  useEffect(() => {
    const loadHinosGeral = async () => {
      try {
        const data = await fetchHinosGeral();
        setHinos(data);
        setFilteredHinos(data);
      } catch (error) {
        console.error('Erro ao obter hinos:', error);
      }
    };

    const loadFavoritos = async () => {
      if (!user?.id_user) return;
      try {
        const favoritosData = await fetchFavoritos(user.id_user);
        setFavoritos(new Set(favoritosData.map(fav => fav._id)));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    };

    loadHinosGeral();
    loadFavoritos();
  }, [user?.id_user]);

  const toggleFavorito = async (hinoId, tipoHino) => {
    try {
      if (favoritos.has(hinoId)) {
        await removeFavorito(user.id_user, hinoId);
        setFavoritos(prev => {
          const newSet = new Set(prev);
          newSet.delete(hinoId);
          return newSet;
        });        
      } else {
        await addFavorito(user.id_user, hinoId, tipoHino);
        setFavoritos(prev => new Set(prev).add(hinoId));        
      }
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);     
    }
  };

  const removeAccents = (str) => {
    return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
  };

  useEffect(() => {
    const filtered = hinos.filter(hino =>
      removeAccents(hino.titulo.toLowerCase()).includes(removeAccents(searchText.toLowerCase())) ||
      hino.numero.toString().includes(searchText)
    );
    setFilteredHinos(filtered);
  }, [searchText, hinos]);

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold
  });

  if (!fontLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigateTo('Adoracao')}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>
        <Text style={{ paddingLeft: 15, ...styles.h2 }}>Hinos Cristãos</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="&#x1F50D; Buscar hino..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredHinos}
        keyExtractor={(item) => item._id || item.numero.toString()}
        renderItem={({ item }) => (
          <View style={styles.hinoItem}>
            <TouchableOpacity onPress={() => navigateTo('HinoGeral', item)} style={styles.hinoTextContainer}>
              <Text style={styles.hinoText}>{item.titulo} - {item.autor}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFavorito(item._id, 'Geral')}>
              <Image
                source={favoritos.has(item._id) ? require('../../assets/icons/red-heart.png') : require('../../assets/icons/line-heart.png')}
                style={styles.favoritoIcon}
              />
            </TouchableOpacity>
          </View>
        )}
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
    marginBottom: 15
  },
  searchBar: {
    padding: 18,
    backgroundColor: '#F1FBFF',
    borderWidth: 2,
    borderColor: '#26516E',
    fontFamily: 'Poppins_600SemiBold',
    marginHorizontal: 5,
    marginBottom: 12,
    borderRadius: 12,
    color: '#26516E'
  },
  hinoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    marginHorizontal: 5,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#F1FBFF'
  },
  hinoTextContainer: {
    flex: 1
  },
  hinoText: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#26516E'
  },
  favoritoIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  },
  backButton: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#26516E',
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5
  },
  titleContainer: {
    paddingVertical: 10,
    paddingLeft: 10,
    display: 'flex',
    flexDirection: 'row'
  }
});
