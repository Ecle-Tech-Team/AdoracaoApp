import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import React, { useState, useRef, useEffect, useContext } from 'react';
import HymnCard from '../components/HymnCard';
import { useHymns } from '../hooks/useHymns';
import { AuthContext } from '../contexts/AuthContext';
import { useSection } from '../contexts/SectionContext';

const { width: screenWidth } = Dimensions.get('window');

// Dados de exemplo para banners do carrossel
const bannerData = [
  { id: '1', title: 'Novo Hinário', description: 'Lançamento especial', image: 'https://picsum.photos/400/200?random=1' },
  { id: '2', title: 'Hinos em Destaque', description: 'Os mais ouvidos esta semana', image: 'https://picsum.photos/400/200?random=2' },
  { id: '3', title: 'Adoração ao Vivo', description: 'Gravações especiais', image: 'https://picsum.photos/400/200?random=3' },
  { id: '4', title: 'Clássicos Renovados', description: 'Novos arranjos', image: 'https://picsum.photos/400/200?random=4' },
];

// Componente do banner do carrossel
const BannerItem = ({ item }) => (
  <View style={styles.bannerContainer}>
    <Image source={{ uri: item.image }} style={styles.bannerImage} />
    <View style={styles.bannerOverlay}>
      <Text style={styles.bannerTitle}>{item.title}</Text>
      <Text style={styles.bannerDescription}>{item.description}</Text>
    </View>
  </View>
);


// Componente da seção
const Section = ({ title, data, onItemPress, onSeeAllPress, loading }) => {
  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <ActivityIndicator size="small" color="#FFCB69" />
      </View>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => onSeeAllPress(title, data)}>
          <Text style={styles.seeAllText}>Ver todos</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <HymnCard
            hymn={item}
            onPress={() => onItemPress(item)}
            size="medium"
          />
        )}
        keyExtractor={item => item.id || item._id || Math.random().toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );
};

export default function Dashboard({ navigateTo }) {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [popularHymns, setPopularHymns] = useState([]);
  const [loadingSections, setLoadingSections] = useState({
    recentlyViewed: true,
    newReleases: true,
    popular: true,
  });
  const { user } = useContext(AuthContext);
  const { updateSectionData } = useSection();

  const flatListRef = useRef(null);

  // Usar o hook de hinos (substitua 'userId' pelo ID real do usuário logado)
  const userId = user.id_user; 
  const {
    hymns,
    loading: hymnsLoading,
    getRecentlyViewed,
    getNewReleases,
    getPopularHymns
  } = useHymns(userId);

  const handleBannerScroll = (event) => {
    const slideSize = screenWidth;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setActiveBannerIndex(index);
  };

  const handleHymnPress = (hymn) => {
    // Determinar qual tela de hino usar baseado no tipo
    if (hymn.tipo_hino === 'GERAL') {
      navigateTo('HinoGeral', hymn, null, 'Dashboard');
    } else {
      navigateTo('Hino', hymn, null, 'Dashboard');
    }
  };

  const handleSeeAllPress = (sectionTitle, hymns) => {
    // Salvar os dados da seção no contexto
    const filterType = sectionTitle.toLowerCase().replace(/\s+/g, '_');
    updateSectionData(sectionTitle, hymns, filterType);

    // Navegar para a tela HymnsSection
    navigateTo('HymnsSection', null, null, 'Dashboard');
  };

  // Carregar dados para as seções
  useEffect(() => {
    const loadSectionData = async () => {
      if (!hymnsLoading && hymns.length > 0) {
        try {
          // Carregar hinos recentemente vistos
          const recent = await getRecentlyViewed(6);
          setRecentlyViewed(recent);
          setLoadingSections(prev => ({ ...prev, recentlyViewed: false }));

          // Carregar novos lançamentos
          const newReleasesData = await getNewReleases(6);
          setNewReleases(newReleasesData);
          setLoadingSections(prev => ({ ...prev, newReleases: false }));

          // Carregar hinos populares
          const popular = await getPopularHymns(6);
          setPopularHymns(popular);
          setLoadingSections(prev => ({ ...prev, popular: false }));
        } catch (error) {
          console.error('Erro ao carregar dados das seções:', error);
        }
      }
    };

    loadSectionData();
  }, [hymns, hymnsLoading]);

  // Mostrar loading geral enquanto carrega hinos
  if (hymnsLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FFCB69" />
        <Text style={styles.loadingText}>Carregando hinos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Carrossel */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={bannerData}
          renderItem={({ item }) => <BannerItem item={item} />}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleBannerScroll}
          scrollEventThrottle={16}
        />

        {/* Indicadores do carrossel */}
        <View style={styles.indicatorContainer}>
          {bannerData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                activeBannerIndex === index && styles.activeIndicator
              ]}
            />
          ))}
        </View>
      </View>

      {/* Seção de Hinos Recentemente Vistos */}
      <Section
        title="Recentemente Vistos"
        data={recentlyViewed}
        onItemPress={handleHymnPress}
        onSeeAllPress={handleSeeAllPress}
        loading={loadingSections.recentlyViewed}
      />

      {/* Seção de Novos Lançamentos */}
      <Section
        title="Novos Lançamentos"
        data={newReleases}
        onItemPress={handleHymnPress}
        onSeeAllPress={handleSeeAllPress}
        loading={loadingSections.newReleases}
      />

      {/* Seção de Hinos Populares */}
      <Section
        title="Hinos Populares"
        data={popularHymns}
        onItemPress={handleHymnPress}
        onSeeAllPress={handleSeeAllPress}
        loading={loadingSections.popular}
      />

      {/* Espaço extra no final */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  carouselContainer: {
    height: 220,
    marginBottom: 24,
  },
  bannerContainer: {
    width: screenWidth,
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
  },
  bannerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerDescription: {
    color: 'white',
    fontSize: 14,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#FFCB69',
    width: 12,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#FFCB69',
    fontSize: 14,
    fontWeight: '700',
  },
  horizontalList: {
    paddingRight: 16,
  },
  hymnCard: {
    width: 150,
    marginRight: 16,
  },
  hymnImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  hymnTitle: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  hymnAuthor: {
    color: '#B3B3B3',
    fontSize: 12,
  },
  bottomSpacing: {
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
});