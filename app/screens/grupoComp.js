import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { AuthContext } from '../../src/contexts/AuthContext';
import { fetchGrupo } from '../../src/api/api';

export default function GrupoComp({ navigateTo }) {
  const { id_grupo } = useContext(AuthContext);
  const [grupoNome, setGrupoNome] = useState('');
  const [loadingGrupo, setLoadingGrupo] = useState(true);

  useEffect(() => {
    if (!id_grupo) {
      setLoadingGrupo(false);
      return;
    }
    const loadGrupo = async () => {
      try {
        const data = await fetchGrupo(id_grupo);
        setGrupoNome(data.nome || '');
      } catch (error) {
        console.error('Erro ao carregar dados do grupo:', error);
      } finally {
        setLoadingGrupo(false);
      }
    };
    loadGrupo();
  }, [id_grupo]);

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_700Bold,
    Poppins_600SemiBold,
  })

  if (!fontLoaded) {
    return null;
  };

  return (
    <View>
      <View>
        <View>
          {/* Cabeçalho com nome do grupo */}
          <View style={styles.headerContainer}>
            <Text style={{paddingLeft: 15, ...styles.h2}}>Grupo</Text>
            {loadingGrupo ? (
              <ActivityIndicator size="small" color="#FFCB69" style={{ marginLeft: 15 }} />
            ) : grupoNome ? (
              <View style={styles.grupoInfo}>
                <Image source={require('../../assets/icons/grupo.png')} style={styles.grupoIcon} />
                <Text style={styles.grupoNome}>{grupoNome}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.cards}>
            <TouchableOpacity onPress={() => navigateTo('HinarioComp')} style={{...styles.card, backgroundColor: "#FFFAE1",}}>
              <Image source={require('../../assets/images/hinario-grupo.jpg')} style={styles.image}/>
              <View style={{justifyContent: "center", paddingLeft: 15}}>
                <Text style={{...styles.cardTitle, color: "#BA9D36"}}>Hinário</Text>
                <Text style={{...styles.cardTxt, color: "#B8AB7D"}}>Pasta com todos os hinos {'\n'}do grupo.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigateTo('EnsaiosComp')} style={{...styles.card, backgroundColor: "#F1FBFF",}}>
              <Image source={require('../../assets/images/ensaio.jpg')} style={styles.image}/>
              <View style={{justifyContent: "center", paddingLeft: 15}}>
                <Text style={{...styles.cardTitle, color: "#26516E"}}>Ensaio</Text>
                <Text style={{...styles.cardTxt, color: "#5F8BA9"}}>Ensaio com todos os membros {'\n'}do grupo.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigateTo('EventosComp')} style={{...styles.card, backgroundColor: "#FFE9E9",}}>
              <Image source={require('../../assets/images/eventos.jpg')} style={styles.image}/>
              <View style={{justifyContent: "center", paddingLeft: 15}}>
                <Text style={{...styles.cardTitle, color: "#FF8282"}}>Eventos</Text>
                <Text style={{...styles.cardTxt, color: "#E39393"}}>Veja todos os eventos locais e externos {'\n'}que serão realizados.</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold'
  },
  h3: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    color: '#BFBFBF',
  },
  txt: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    color: '#BFBFBF',
    lineHeight: 14
  },
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 5,
  },
  grupoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    marginTop: 4,
  },
  grupoIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#FFCB69',
  },
  grupoNome: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#555',
  },
  cards: {
    paddingTop: 10,
  },
  card: {
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    display: "flex",
    flexDirection: 'row'
  },
  cardTitle:{
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },
  cardTxt:{
    fontFamily: 'Nunito_500Medium',
    lineHeight: 18,
    paddingTop: 4
  },
  image:{
    width: 90,
    height: 90,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10
  }
})
