import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold , Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchHinosByHinario, addFavorito, removeFavorito, fetchFavoritos } from '../../src/api/api';
import { AuthContext } from '../../src/contexts/AuthContext';
import { HinarioContext } from '../../src/contexts/HinarioContext';

export default function Harpa({ navigateTo }) {
  const { user } = useContext(AuthContext);
  const { hinario } = useContext(HinarioContext);
  const [hinos, setHinos] = useState([]);
  const [filteredHinos, setFilteredHinos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [favoritos, setFavoritos] = useState(new Set());

 useEffect(() => {
  const loadHinos = async () => {
    try {
      let data = [];

      if (hinario === 'HARPA') {
        data = await fetchHinosByHinario('harpa');
      }

      if (hinario === 'CCB') {
        data = await fetchHinosByHinario('ccb');
      }

      if (hinario === 'CANTOR') {
        data = await fetchHinosByHinario('cantor');
      }

      setHinos(data);
      setFilteredHinos(data);
    } catch (error) {
      console.error('Erro ao carregar hinos:', error);
    }
  };

    loadHinos();
  }, [hinario]);
  
  useEffect(() => {    
  
    if (!user?.id_user) {
      console.warn('🚨 Usuário não encontrado, pulando carregamento de favoritos.');
      return;
    }
  
    const loadFavoritos = async () => {
      try {        
        const favoritosData = await fetchFavoritos(user.id_user);
        
  
        if (!Array.isArray(favoritosData)) {
          console.error('❌ Erro: favoritosData não é um array:', favoritosData);
          return;
        }
  
        setFavoritos(new Set(favoritosData.map(fav => fav._id)));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    };
  
    loadFavoritos();
  }, [user?.id_user]);

  const toggleFavorito = async (hinoId, tipo_hino) => {
    if (!hinoId || !tipo_hino) {
      console.warn('🚨 Erro: hinoId ou tipo_hino está indefinido.', { hinoId, tipo_hino });
      return;
    }
  
    try {
      if (favoritos.has(hinoId)) {
        await removeFavorito(user.id_user, hinoId);
        setFavoritos(prevFavoritos => {
          const newFavoritos = new Set(prevFavoritos);
          newFavoritos.delete(hinoId);
          return newFavoritos;
        });
      } else {
        await addFavorito(user.id_user, hinoId, tipo_hino);
        setFavoritos(prevFavoritos => new Set([...prevFavoritos, hinoId]));
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
      removeAccents(hino.titulo?.toLowerCase()).includes(removeAccents(searchText.toLowerCase())) ||
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

  const tipoHino = hinario;

  return (
    <View style={styles.container}>      
      <View>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={() => navigateTo('Adoracao')}>
            <Text style={styles.backButton}>&#60;</Text>
          </TouchableOpacity>    

          <Text style={{ paddingLeft: 15, ...styles.h2 }}>
            {hinario === 'HARPA' && 'Harpa Cristã'}
            {hinario === 'CCB' && 'Hinário 5 CCB'}
            {hinario === 'CANTOR' && 'Cantor Cristão'}
          </Text>
        </View>
        
        <TextInput
          style={styles.searchBar}
          placeholder="&#x1F50D; Buscar hino..."
          value={searchText}
          onChangeText={setSearchText}
        />

        <FlatList
          data={filteredHinos}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.hinoContainer}>
              <TouchableOpacity style={styles.hinoTouchable} onPress={() => {           
                navigateTo(
                  'Hino', 
                  item,                  
                  'Harpa'
                );
              }}
              >
                <Text style={styles.item}>{item.numero} - {item.titulo}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => toggleFavorito(item._id, tipoHino)}>
                <Image
                  source={favoritos.has(item._id) 
                    ? require('../../assets/icons/red-heart.png') 
                    : require('../../assets/icons/line-heart.png')}
                  style={styles.favoritoIcon}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>        
    </View>
  );
}

const styles = StyleSheet.create({
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',  
    marginBottom: 15  
  },
  container: {
    flex: 1
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
  hinoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#FFFAE1',
    borderRadius: 10,
  },
  hinoTouchable: {
    flex: 1,
    paddingVertical: 15,
  },
  hinoListed:{
    paddingVertical: 15
  },
  item: {
    fontFamily: 'Poppins_600SemiBold',  
    color: '#BA9D36',
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
    color: '#fff',
    backgroundColor: '#FFCB69',
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5
  },
  favoritoButton: {
    padding: 10,
  },
  favoritoIcon: {
    width: 26,
    height: 24,
  }
});
