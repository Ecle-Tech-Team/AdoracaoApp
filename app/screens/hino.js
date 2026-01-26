import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useFonts, Nunito_700Bold, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { fetchHinoByNumero } from '../api/api';

const formatText = (text, style = styles.textLine) => {
  return text.split('<br>').map((line, index) => (
    <Text key={index} style={style}>{line.trim()}</Text>
  ));
};

export default function Hino({ selectedHino, hinario, navigateTo, previousScreen }) {
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_700Bold,
    Poppins_700Bold    
  })

  if (!fontLoaded) {
    return null;
  }

  if (!selectedHino ) {
    return (
      <View style={styles.container}>
        <Text>Hino não encontrado.</Text>
      </View>
    );
  }

  const { numero, titulo, coro } = selectedHino ;
  const verses = selectedHino.verses || selectedHino.versos;

  return (
     <View style={styles.container}>              
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigateTo(previousScreen || 'Harpa')}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>    

        <Text style={{ paddingLeft: 15, ...styles.h2 }}>
          {numero} - {titulo}
        </Text>
      </View>

      <ScrollView style={styles.box}>                           
        {verses && Object.entries(verses).map(([key, verse], index) => (
          <View key={index} style={styles.verseContainer}>
            {formatText(verse)}

            {index === 0 && coro && (
              <View style={styles.coroContainer}>
                {formatText(coro, styles.coro)}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,   
    marginBottom: 60   
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold'    
  },
  box: {
    backgroundColor: '#FFFAE1',
    paddingLeft: 20,
    marginTop: 15,
    borderRadius: 15,
    margin: 20
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#BA9D36',
    marginBottom: 20,
    marginTop: 15
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
  textLine: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Nunito_500Medium',
    color: '#B8AB7D',
    lineHeight: 17
  },
  coro: {
    fontSize: 15,    
    marginBottom: 3,
    marginTop: 3,
    color: '#BA9D36',
    fontFamily: 'Poppins_700Bold' 
  },
  titleContainer:{
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingLeft: 10,
  },
  coroContainer: {
    marginTop: 10,
    marginBottom: 10
  },
  verseContainer: {
    paddingTop:20,
    marginBottom: 10, 
  },

})