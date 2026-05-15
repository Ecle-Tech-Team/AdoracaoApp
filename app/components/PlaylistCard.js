import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import React from 'react';

const CORES_CAPA = [
  '#101010',
  '#2E2E2E',
  '#404040',
  '#1A1A1A',
  '#333333',
];

const getCorPorId = (id) => {
  if (!id) return CORES_CAPA[0];
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CORES_CAPA.length;
  return CORES_CAPA[index];
};

const PlaylistCard = ({ playlist, onPress }) => {
  const corCapa = getCorPorId(playlist.id);
  const totalHinos = playlist.total_hinos || 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(playlist)}
      activeOpacity={0.7}
    >
      <View style={[styles.capa, { backgroundColor: corCapa }]}>
        <Feather name="folder" size={32} color="rgba(255,255,255,0.9)" />
        <Text style={styles.hinoCount}>{totalHinos}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {playlist.nome}
        </Text>
        <Text style={styles.subtitle}>
          {totalHinos} {totalHinos === 1 ? 'hino' : 'hinos'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    marginRight: 16,
  },
  capa: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hinoCount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  infoContainer: {
    paddingHorizontal: 2,
  },
  title: {
    color: '#101010',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitle: {
    color: '#2E2E2E',
    fontSize: 12,
  },
});

export default PlaylistCard;
