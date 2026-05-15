import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';

export default function Adoracao({ navigateTo }) {
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_700Bold
  })

  if (!fontLoaded) {
    return null;
  };
  
  return (
    <View>
      <View>        
        <View>
          <Text style={{paddingLeft: 15, ...styles.h2}}>Adoração</Text>

          <View style={styles.cards}>
            <TouchableOpacity onPress={() => navigateTo('MinhaBiblioteca')} style={{...styles.card, backgroundColor: "#EDEDED",}}>
              <Image source={require('../../assets/images/headphone.jpg')} style={styles.image}/>
              <View style={{justifyContent: "center", paddingLeft: 15}}>
                <Text style={{...styles.cardTitle, color: "#101010"}}>Minha Biblioteca</Text>
                <Text style={{...styles.cardTxt, color: "#2E2E2E"}}>Suas playlists personalizadas {'\n'}com seus hinos favoritos!</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigateTo('Harpa')} style={{...styles.card, backgroundColor: "#FFFAE1",}}>             
              <Image source={require('../../assets/images/harpa-crista.jpg')} style={styles.image}/>
              <View style={{justifyContent: "center", paddingLeft: 15}}>
                <Text style={{...styles.cardTitle, color: "#BA9D36"}}>Hinário</Text>
                <Text style={{...styles.cardTxt, color: "#B8AB7D"}}>Encontre todos os seus hinos {'\n'}cristãos e adore a Deus com alegria!</Text>
              </View>              
            </TouchableOpacity> 
            
            <TouchableOpacity onPress={() => navigateTo('Hinario')} style={{...styles.card, backgroundColor: "#F1FBFF",}}>
              <Image source={require('../../assets/images/homem-cantando.jpg')} style={styles.image}/>
              <View style={{justifyContent: "center", paddingLeft: 15}}>
                <Text style={{...styles.cardTitle, color: "#26516E"}}>Hinos Cristãos</Text>
                <Text style={{...styles.cardTxt, color: "#5F8BA9"}}>Encontre todos os Hinos Cristãos {'\n'}e adore a Deus com alegria!</Text>
              </View>
            </TouchableOpacity>

            {/* <Link href={'/screens/coros'} style={{...styles.card, backgroundColor: "#FFE9E9",}}> 
              <Image source={require('../../assets/images/pexels-thirdman-6193846.jpg')} style={styles.image}/>
              <View style={{justifyContent: "center", paddingLeft: 15}}>
                <Text style={{...styles.cardTitle, color: "#FF8282"}}>Coros Cristãos</Text>
                <Text style={{...styles.cardTxt, color: "#E39393"}}>Encontre todos os Coros Cristãos {'\n'}e adore a Deus com alegria!</Text>
              </View>
            </Link>

            <Link href={'/screens/coros'} style={{...styles.card, backgroundColor: "#E2FFE3",}}> 
              <Image source={require('../../assets/images/partitura.jpg')} style={styles.image}/>
              <View style={{justifyContent: "center", paddingLeft: 15}}>
                <Text style={{...styles.cardTitle, color: "#459041"}}>Cifras Cristãos</Text>
                <Text style={{...styles.cardTxt, color: "#64A95F"}}>Veja todas as Cifras dos hinos {'\n'}Cristãos e toque ao Senhor!</Text>
              </View>
            </Link> */}
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