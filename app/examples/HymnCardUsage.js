import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import HymnCard from '../components/HymnCard';
import { useHymns } from '../hooks/useHymns';

// Exemplo de uso do HymnCard com diferentes filtros
const HymnCardUsage = () => {
  const userId = 'user123'; // Substituir pelo ID real do usuário
  const {
    hymns,
    loading,
    filterHymns,
    fetchHymnsByHinario
  } = useHymns(userId);

  // Exemplo 1: Hinos da Harpa
  const harpaHymns = filterHymns({ hinario: 'harpa', limit: 4 });

  // Exemplo 2: Hinos do CCB
  const ccbHymns = filterHymns({ hinario: 'ccb', limit: 4 });

  // Exemplo 3: Hinos favoritos
  const favoriteHymns = filterHymns({ favoritesOnly: true, limit: 4 });

  // Exemplo 4: Busca por termo
  const searchResults = filterHymns({ search: 'amor', limit: 4 });

  // Exemplo 5: Ordenados por número
  const hymnsByNumber = filterHymns({ sortBy: 'number', limit: 4 });

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando hinos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Seção 1: Hinos da Harpa */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hinos da Harpa</Text>
        <View style={styles.cardRow}>
          {harpaHymns.map((hymn) => (
            <HymnCard
              key={hymn.id}
              hymn={hymn}
              onPress={(hymn) => console.log('Harpa hymn:', hymn.titulo)}
              size="small"
            />
          ))}
        </View>
      </View>

      {/* Seção 2: Hinos do CCB */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hinos do CCB</Text>
        <View style={styles.cardRow}>
          {ccbHymns.map((hymn) => (
            <HymnCard
              key={hymn.id}
              hymn={hymn}
              onPress={(hymn) => console.log('CCB hymn:', hymn.titulo)}
              size="medium"
            />
          ))}
        </View>
      </View>

      {/* Seção 3: Hinos Favoritos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meus Favoritos</Text>
        <View style={styles.cardRow}>
          {favoriteHymns.map((hymn) => (
            <HymnCard
              key={hymn.id}
              hymn={hymn}
              onPress={(hymn) => console.log('Favorite hymn:', hymn.titulo)}
              size="large"
            />
          ))}
        </View>
      </View>

      {/* Seção 4: Resultados de Busca */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Busca: "amor"</Text>
        <View style={styles.cardRow}>
          {searchResults.map((hymn) => (
            <HymnCard
              key={hymn.id}
              hymn={hymn}
              onPress={(hymn) => console.log('Search result:', hymn.titulo)}
              size="small"
            />
          ))}
        </View>
      </View>

      {/* Seção 5: Ordenados por Número */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ordenados por Número</Text>
        <View style={styles.cardRow}>
          {hymnsByNumber.map((hymn) => (
            <HymnCard
              key={hymn.id}
              hymn={hymn}
              onPress={(hymn) => console.log('Hymn #', hymn.numero)}
              size="medium"
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default HymnCardUsage;