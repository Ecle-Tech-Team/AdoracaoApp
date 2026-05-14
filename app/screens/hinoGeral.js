import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect } from 'react';
import { useFonts, Nunito_700Bold, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { saveRecentlyViewed } from '../../src/services/recentlyViewed';

const formatText = (text, style = styles.textLine) => {
    return text.split('<br>').map((line, index) => (
      <Text key={index} style={styles.textLine}>{line.trim()}</Text>
    ));
  };

export default function HinoGeral({ selectedHino, navigateTo, previousScreen }) {

    const [fontLoaded] = useFonts({
      Nunito_500Medium,
      Nunito_700Bold,
      Poppins_600SemiBold,
      Poppins_700Bold
    })

    useEffect(() => {
      if (selectedHino) {
        saveRecentlyViewed(selectedHino);
      }
    }, [selectedHino]);

    if (!fontLoaded) {
      return null;
    }

    if (!selectedHino) {
      return (
        <View style={styles.container}>
            <Text>Hino não encontrado.</Text>
        </View>
      );
    }

    const { titulo, autor, verses } = selectedHino;
  return (
    <View style={styles.container}>              
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigateTo(previousScreen || 'Hinario')}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>    

        <Text style={{paddingLeft: 15, ...styles.h2}}>Hinos Cristãos</Text>
      </View>
        <ScrollView style={styles.box}>                          
          <Text style={styles.title}>{titulo}</Text>
          <Text style={styles.autor}>{autor}</Text>

          {Object.entries(verses).map(([key, verse], index) => (
            <View key={index} style={styles.verseContainer}>
              {formatText(verse)}              
            </View>
          ))}
        </ScrollView>        
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold'    
  },
  box: {
    backgroundColor: '#F1FBFF',
    paddingLeft: 20,
    marginTop: 15,
    borderRadius: 15,
    margin: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#26516E',    
    marginTop: 15
  },
  autor: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#26516E',
    marginBottom: 20,   
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
  textLine: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Nunito_500Medium',
    color: '#5F8BA9',
    lineHeight: 17
  },
  coro: {
    fontSize: 44,
    fontStyle: 'italic',
    marginBottom: 20,
    marginTop: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold' 
  },
  titleContainer:{
    paddingVertical: 10,
    paddingLeft: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  coroContainer: {
    marginTop: 10,
  },
  verseContainer: {
    marginBottom: 10, // Adds space between verses
  },
})