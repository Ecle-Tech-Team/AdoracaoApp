import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';

export default function MenuInferiorComp({ navigateTo }) {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity onPress={() => navigateTo('DashboardGrupo')} style={styles.option} activeOpacity={0.7}>
          <FontAwesome name="home" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateTo('Adoracao')} style={styles.option} activeOpacity={0.7}>
          <MaterialIcons name="menu-book" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateTo('Pesquisa')} style={styles.option} activeOpacity={0.7}>
          <Feather name="search" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateTo('GrupoComp')} style={styles.option} activeOpacity={0.7}>
          <FontAwesome name="users" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateTo('MaisComp')} style={styles.option} activeOpacity={0.7}>
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
    paddingBottom: 20, // Espaço para safe area em dispositivos com notch
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