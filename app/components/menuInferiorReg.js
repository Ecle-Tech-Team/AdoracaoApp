import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Home, BookOpenText, Search, Users, MoreHorizontal } from 'lucide-react';

export default function MenuInferiorReg({ navigateTo }) {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity onPress={() => navigateTo('Dashboard')} style={styles.option} activeOpacity={0.7}>
          <Home size={28} fill='#fff' color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateTo('Adoracao')} style={styles.option} activeOpacity={0.7}>
          <BookOpenText size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateTo('Pesquisa')} style={styles.option} activeOpacity={0.7}>
          <Search size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateTo('GrupoReg')} style={styles.option} activeOpacity={0.7}>
          <Users size={28} fill='#fff' color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateTo('MaisReg')} style={styles.option} activeOpacity={0.7}>
          <MoreHorizontal size={28} color="#fff" />
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