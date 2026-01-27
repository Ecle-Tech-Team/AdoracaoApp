import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchFavoritos, removeFavorito } from '../api/api';
import { AuthContext } from '../contexts/AuthContext';

export default function Favoritos({ navigateTo }) {
  const { user } = useContext(AuthContext);
  const [favoritos, setFavoritos] = useState([]);

  /* 🔄 Carrega favoritos */
  useEffect(() => {
    const loadFavoritos = async () => {
      if (!user?.id_user) return;

      try {
        const data = await fetchFavoritos(user.id_user);

        if (!Array.isArray(data)) {
          console.warn('Favoritos não retornaram um array:', data);
          return;
        }

        setFavoritos(data);
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    };

    loadFavoritos();
  }, [user?.id_user]);

  /* ❤️ Remove favorito */
  const handleRemoveFavorito = async (hinoId) => {
    try {
      await removeFavorito(user.id_user, hinoId);

      setFavoritos(prev =>
        prev.filter(hino => hino._id !== hinoId)
      );

      Alert.alert('Removido', 'O hino foi removido dos favoritos.');
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      Alert.alert('Erro', 'Não foi possível remover o favorito.');
    }
  };

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold
  });

  if (!fontLoaded) {
    return null;
  }

  /* 🎵 Label do hinário */
  const renderHinarioLabel = (tipo) => {
    switch (tipo) {
      case 'HARPA':
        return 'Harpa Cristã';
      case 'CCB':
        return 'Hinário 5 CCB';
      case 'CANTOR':
        return 'Cantor Cristão';
      case 'GERAL':
        return 'Hinário Geral';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔙 Header */}
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigateTo('Adoracao')}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>
        <Text style={{ paddingLeft: 15, ...styles.h2 }}>
          Favoritos
        </Text>
      </View>

      {/* 📭 Estado vazio */}
      {favoritos.length === 0 ? (
        <Text style={styles.emptyText}>
          Nenhum hino favoritado ainda.
        </Text>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.hinoItem}>
              {/* 🎶 Texto */}
              <TouchableOpacity
                style={styles.hinoTextContainer}
                onPress={() =>
                  navigateTo('Hino', {
                    ...item,
                    hinario: item.tipo_hino
                  }, null, 'Favoritos')
                }
              >
                <Text style={styles.hinoText}>
                  {item.numero ? `${item.numero} - ` : ''}
                  {item.titulo}
                </Text>

                <Text style={styles.hinoAutor}>
                  {renderHinarioLabel(item.tipo_hino)}
                </Text>
              </TouchableOpacity>

              {/* ❤️ Ícone */}
              <TouchableOpacity onPress={() => handleRemoveFavorito(item._id)}>
                <Image
                  source={require('../../assets/icons/red-heart.png')}
                  style={styles.favoritoIcon}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

/* 🎨 ESTILOS */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 15
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Nunito_500Medium',
    textAlign: 'center',
    marginTop: 50,
    color: '#B8AB7D'
  },
  hinoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    marginHorizontal: 5,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#FFCB69'
  },
  hinoTextContainer: {
    flex: 1,
  },
  hinoText: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#ffffff'
  },
  hinoAutor: {
    fontFamily: 'Nunito_500Medium',
    color: '#ffffff',
    fontSize: 14,
    marginTop: 4
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
    backgroundColor: '#FFCB69',
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
