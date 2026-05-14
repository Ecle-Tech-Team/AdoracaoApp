import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import HymnCard from '../components/HymnCard';
import { useHymns } from '../../src/hooks/useHymns';
import { useSection } from '../../src/contexts/SectionContext';

export default function HymnsSection({ navigateTo, selectedHino, previousScreen }) {
  const { sectionData } = useSection();
  const { title: sectionTitle, hymns: initialHymns, filterType } = sectionData;
  const [hymns, setHymns] = useState(initialHymns || []);
  const [loading, setLoading] = useState(!initialHymns);
  const [filteredHymns, setFilteredHymns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const userId = 'user123'; // TODO: Substituir pelo ID real do usuário
  const { filterHymns } = useHymns(userId);

  // Carregar hinos se não foram passados via params
  useEffect(() => {
    const loadHymns = async () => {
      if (!initialHymns && filterType) {
        setLoading(true);
        try {
          let filtered = [];

          // Aplicar filtros baseados no tipo da seção
          switch (filterType) {
            case 'recentemente_vistos':
              filtered = filterHymns({ sortBy: 'recent', limit: 50 });
              break;
            case 'novos_lançamentos':
              // Simular novos lançamentos (últimos adicionados)
              const allHymns = filterHymns({});
              filtered = allHymns.slice(0, 50); // Primeiros 50 como "novos"
              break;
            case 'hinos_populares':
              // Simular hinos populares (aleatórios)
              const allHymns2 = filterHymns({});
              filtered = [...allHymns2].sort(() => 0.5 - Math.random()).slice(0, 50);
              break;
            case 'harpa':
              filtered = filterHymns({ hinario: 'harpa', limit: 50 });
              break;
            case 'ccb':
              filtered = filterHymns({ hinario: 'ccb', limit: 50 });
              break;
            case 'favoritos':
              filtered = filterHymns({ favoritesOnly: true, limit: 50 });
              break;
            default:
              filtered = filterHymns({ limit: 50 });
          }

          setHymns(filtered);
          setFilteredHymns(filtered);
        } catch (error) {
          console.error('Erro ao carregar hinos:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setFilteredHymns(initialHymns || []);
      }
    };

    loadHymns();
  }, [initialHymns, filterType]);

  // Filtrar hinos quando a busca mudar
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredHymns(hymns);
    } else {
      const filtered = hymns.filter(hymn =>
        (hymn.titulo && hymn.titulo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (hymn.autor && hymn.autor.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (hymn.numero && hymn.numero.toString().includes(searchQuery))
      );
      setFilteredHymns(filtered);
    }
  }, [searchQuery, hymns]);

  const handleHymnPress = (hymn) => {
    // Navegar para a tela do hino apropriada usando o sistema do app
    if (hymn.tipo_hino === 'GERAL') {
      navigateTo('HinoGeral', hymn, null, 'HymnsSection');
    } else {
      navigateTo('Hino', hymn, null, 'HymnsSection');
    }
  };

  const renderHymnItem = ({ item, index }) => (
    <View style={[
      styles.hymnItem,
      index % 2 === 0 ? styles.evenItem : styles.oddItem
    ]}>
      <HymnCard
        hymn={item}
        onPress={() => handleHymnPress(item)}
        size="medium"
      />
      <View style={styles.hymnInfo}>        
        {item.numero && (
          <Text style={styles.hymnNumber}>#{item.numero}</Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFCB69" />
        <Text style={styles.loadingText}>Carregando hinos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateTo(previousScreen || 'Dashboard')}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{sectionTitle || 'Hinos'}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Contador */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          {filteredHymns.length} {filteredHymns.length === 1 ? 'hino' : 'hinos'}
        </Text>
      </View>

      {/* Lista de Hinos */}
      <FlatList
        data={filteredHymns}
        renderItem={renderHymnItem}
        keyExtractor={(item) => item.id || item._id || Math.random().toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Nenhum hino encontrado para sua busca.' : 'Nenhum hino disponível.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#FFCB69',
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  counterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f8f8',
  },
  counterText: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  hymnItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  evenItem: {
    backgroundColor: '#fff',
  },
  oddItem: {
    backgroundColor: '#f9f9f9',
  },
  hymnInfo: {
    marginTop: 8,
  },
  hymnTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  hymnAuthor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  hymnNumber: {
    fontSize: 11,
    color: '#FFCB69',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});