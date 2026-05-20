import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchEventosDoGrupo } from '../../src/api/api';
import { AuthContext } from '../../src/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function EventosComp({ navigateTo }) {
  const { id_grupo } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const loadEventos = async () => {
      try {
        const data = await fetchEventosDoGrupo(id_grupo);
        setEventos(data);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      }
    };

    loadEventos();
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

        <Text style={{paddingLeft: 15, ...styles.h2}}>Eventos</Text>
      </View>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const formattedDate = format(new Date(item.data), 'dd/MM - HH:mm', { locale: ptBR });
          return (
            <View style={styles.lista}>
              <View style={styles.eventoItem}>
                <View style={styles.eventoTitleView}>
                  <Text style={{...styles.eventoTitle, fontSize: 18}}>{item.descricao}</Text>
                </View>
                <Text style={styles.eventoDate}>{formattedDate}</Text>
                <Text style={styles.eventoText}>{item.local}</Text>
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
    backgroundColor: '#FF4242',
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
  eventoTitleView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventoTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FF4242',
    marginBottom: 5,
  },
  eventoDate: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FF4242',
    marginBottom: 5,
  },
  eventoItem: {
    padding: 12,
    backgroundColor: '#FFE2E2',
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  eventoText: {
    fontSize: 15,
    fontFamily: 'Nunito_500Medium',
    color: '#FF8282',
    marginBottom: 5,
  },
})
