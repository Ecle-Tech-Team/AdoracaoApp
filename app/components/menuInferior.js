import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { FontAwesome, MaterialIcons, Feather, AntDesign } from '@expo/vector-icons';

export default function MenuInferior({ navigateTo }) {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity onPress={() => navigateTo('Dashboard')} style={styles.option} activeOpacity={0.7}>
          <FontAwesome name="home" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateTo('Adoracao')} style={styles.option} activeOpacity={0.7}>
          <MaterialIcons name="menu-book" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateTo('Pesquisa')} style={styles.option} activeOpacity={0.7}>
          <Feather name="search" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateTo('Favoritos')} style={styles.option} activeOpacity={0.7}>
          <AntDesign name="heart" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateTo('Mais')} style={styles.option} activeOpacity={0.7}>
          <Feather name="more-horizontal" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFCB69',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10, // Espaço para safe area em dispositivos com notch
  },
  main: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
});