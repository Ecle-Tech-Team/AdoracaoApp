import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchEnsaiosDoGrupo } from '../../src/api/api';
import { AuthContext } from '../../src/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function EnsaiosComp({ navigateTo }) {
  const { id_grupo } = useContext(AuthContext);
  const [ensaios, setEnsaios] = useState([]);

  useEffect(() => {
    const loadEnsaios = async () => {
      try {
        const data = await fetchEnsaiosDoGrupo(id_grupo);
        setEnsaios(data);
      } catch (error) {
        console.error('Erro ao carregar ensaios:', error);
      }
    };

    loadEnsaios();
  }, [id_grupo]);

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
        <TouchableOpacity onPress={() => navigateTo('GrupoComp')}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>

        <Text style={{paddingLeft: 15, ...styles.h2}}>Ensaios</Text>
      </View>

      <FlatList
        data={ensaios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const formattedDate = format(new Date(item.data), 'dd/MM - HH:mm', { locale: ptBR });
          return (
            <View style={styles.lista}>
              <View style={styles.ensaioItem}>
                <View style={styles.ensaioTitleView}>
                  <Text style={{...styles.ensaioTitle, fontSize: 18}}>{item.descricao}</Text>
                </View>
                <Text style={styles.ensaioDate}>{formattedDate}</Text>
                <Text style={styles.ensaioText}>{item.local}</Text>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
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
  titleContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
  lista: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  ensaioTitleView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ensaioTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#26516E',
    marginBottom: 5,
  },
  ensaioDate: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#26516E',
    marginBottom: 5,
  },
  ensaioItem: {
    padding: 12,
    backgroundColor: '#F5FBFF',
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  ensaioText: {
    fontSize: 15,
    fontFamily: 'Nunito_500Medium',
    color: '#5F8BA9',
    marginBottom: 5,
  },
})
