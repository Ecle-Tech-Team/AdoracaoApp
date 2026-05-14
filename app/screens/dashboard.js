import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import React, { useState, useRef, useEffect, useContext } from 'react';
import HymnCard from '../components/HymnCard';
import { useHymns } from '../../src/hooks/useHymns';
import { AuthContext } from '../../src/contexts/AuthContext';
import { HinarioContext } from '../../src/contexts/HinarioContext';
import { useSection } from '../../src/contexts/SectionContext';
import { fetchHinosByHinario } from '../../src/api/api';
import { getRecentlyViewed as loadRecentlyViewed, saveRecentlyViewed } from '../../src/services/recentlyViewed';

const { width: screenWidth } = Dimensions.get('window');

// Imagens padrão para cada hinário
const HINARIO_IMAGES = {
  HARPA: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop',
  CCB: 'https://images.unsplash.com/photo-1461784121038-f088ca1e7714?w=400&h=300&fit=crop',
  GERAL: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
};

const HINARIO_INFO = {
  HARPA: { label: 'Harpa Cristã', image: HINARIO_IMAGES.HARPA, cor: '#8B4513' },
  CCB: { label: 'CCB', image: HINARIO_IMAGES.CCB, cor: '#2E5090' },
  GERAL: { label: 'Hinos Gerais', image: HINARIO_IMAGES.GERAL, cor: '#6B8E23' },
};

const bannerData = [
  { id: '1', title: 'Novo Hinário', description: 'Lançamento especial', image: 'https://picsum.photos/400/200?random=1' },
  { id: '2', title: 'Hinos em Destaque', description: 'Os mais ouvidos esta semana', image: 'https://picsum.photos/400/200?random=2' },
  { id: '3', title: 'Adoração ao Vivo', description: 'Gravações especiais', image: 'https://picsum.photos/400/200?random=3' },
  { id: '4', title: 'Clássicos Renovados', description: 'Novos arranjos', image: 'https://picsum.photos/400/200?random=4' },
];

const BannerItem = ({ item }) => (
  <View style={styles.bannerContainer}>
    <Image source={{ uri: item.image }} style={styles.bannerImage} />
    <View style={styles.bannerOverlay}>
      <Text style={styles.bannerTitle}>{item.title}</Text>
      <Text style={styles.bannerDescription}>{item.description}</Text>
    </View>
  </View>
);

const Section = ({ title, data, onItemPress, onSeeAllPress, loading, hinarioType }) => {
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
            hinarioType={hinarioType}
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

// Card de hinário com imagem padrão
const HinarioCard = ({ hinarioKey, info, onPress }) => (
  <TouchableOpacity
    style={styles.hinarioCard}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Image source={{ uri: info.image }} style={styles.hinarioCardImage} />
    <View style={[styles.hinarioCardOverlay, { backgroundColor: info.cor + 'CC' }]}>
      <Text style={styles.hinarioCardLabel}>{info.label}</Text>
    </View>
  </TouchableOpacity>
);

export default function Dashboard({ navigateTo }) {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [popularHymns, setPopularHymns] = useState([]);
  const [classicHymns, setClassicHymns] = useState([]);
  const [loadingSections, setLoadingSections] = useState({
    recentlyViewed: true,
    newReleases: true,
    popular: true,
    classics: true,
  });
  const { user } = useContext(AuthContext);
  const { hinario } = useContext(HinarioContext);
  const { updateSectionData } = useSection();

  const flatListRef = useRef(null);

  const userId = user.id_user;
  const {
    hymns,
    loading: hymnsLoading,
    getRecentlyViewed,
    getNewReleases,
    getPopularHymns,
    fetchHymnsByHinario: fetchHymnsByHinarioHook,
  } = useHymns(userId);

  const handleBannerScroll = (event) => {
    const slideSize = screenWidth;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setActiveBannerIndex(index);
  };

  const handleHymnPress = (hymn) => {
    saveRecentlyViewed(hymn);
    if (hymn.tipo_hino === 'GERAL') {
      navigateTo('HinoGeral', hymn, null, 'Dashboard');
    } else {
      navigateTo('Hino', hymn, null, 'Dashboard');
    }
  };

  const handleSeeAllPress = (sectionTitle, hymns) => {
    const filterType = sectionTitle.toLowerCase().replace(/\s+/g, '_');
    updateSectionData(sectionTitle, hymns, filterType);
    navigateTo('HymnsSection', null, null, 'Dashboard');
  };

  // Navegar para tela do hinário específico
  const handleHinarioPress = (tipo) => {
    if (tipo === 'GERAL') {
      navigateTo('HinoGeral', null, null, 'Dashboard');
    } else {
      navigateTo('Harpa', { tipo_hino: tipo }, null, 'Dashboard');
    }
  };

  // Carregar recentemente vistos (não depende dos hinos da API)
  useEffect(() => {
    let cancelled = false;

    const loadRecent = async () => {
      try {
        const recent = await loadRecentlyViewed(6);
        if (cancelled) return;
        setRecentlyViewed(recent);
        setLoadingSections(prev => ({ ...prev, recentlyViewed: false }));
      } catch (error) {
        console.error('Erro ao carregar recentemente vistos:', error);
        setLoadingSections(prev => ({ ...prev, recentlyViewed: false }));
      }
    };

    loadRecent();
    return () => { cancelled = true; };
  }, []);

  // Carregar novas seções (depende dos hinos carregados)
  useEffect(() => {
    let cancelled = false;

    const loadSectionData = async () => {
      if (!hymnsLoading && hymns.length > 0) {
        try {
          const [newReleasesData, popular] = await Promise.all([
            getNewReleases(6),
            getPopularHymns(6),
          ]);
          if (cancelled) return;
          setNewReleases(newReleasesData);
          setPopularHymns(popular);
          setLoadingSections(prev => ({
            ...prev,
            newReleases: false,
            popular: false,
          }));
        } catch (error) {
          console.error('Erro ao carregar dados das seções:', error);
        }
      }
    };

    loadSectionData();
    return () => { cancelled = true; };
  }, [hymns, hymnsLoading]);

  // Carregar clássicos baseado no hinário selecionado
  useEffect(() => {
    let cancelled = false;

    const loadClassics = async () => {
      if (hymnsLoading) return;

      try {
        let classics = [];
        if (hinario === 'HARPA') {
          const data = await fetchHinosByHinario('harpa');
          if (!cancelled) classics = (data || []).slice(0, 6);
        } else if (hinario === 'CCB') {
          const data = await fetchHinosByHinario('ccb');
          if (!cancelled) classics = (data || []).slice(0, 6);
        } else {
          if (!cancelled) classics = hymns.filter(h => h.tipo_hino === 'GERAL' || !h.tipo_hino).slice(0, 6);
        }
        if (!cancelled) {
          setClassicHymns(classics);
          setLoadingSections(prev => ({ ...prev, classics: false }));
        }
      } catch (error) {
        console.error('Erro ao carregar clássicos:', error);
        if (!cancelled) {
          setLoadingSections(prev => ({ ...prev, classics: false }));
        }
      }
    };

    loadClassics();
    return () => { cancelled = true; };
  }, [hinario, hymns, hymnsLoading]);

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

      {/* Cards de Hinários
      <View style={styles.hinarioCardsRow}>
        <HinarioCard hinarioKey="HARPA" info={HINARIO_INFO.HARPA} onPress={() => handleHinarioPress('HARPA')} />
        <HinarioCard hinarioKey="CCB" info={HINARIO_INFO.CCB} onPress={() => handleHinarioPress('CCB')} />
        <HinarioCard hinarioKey="GERAL" info={HINARIO_INFO.GERAL} onPress={() => handleHinarioPress('GERAL')} />
      </View> */}

      {/* Seção de Hinos Recentemente Vistos */}
      <Section
        title="Recentemente Vistos"
        data={recentlyViewed}
        onItemPress={handleHymnPress}
        onSeeAllPress={handleSeeAllPress}
        loading={loadingSections.recentlyViewed}
        hinarioType="GERAL"
      />

      {/* Seção de Novos Lançamentos */}
      <Section
        title="Novos Lançamentos"
        data={newReleases}
        onItemPress={handleHymnPress}
        onSeeAllPress={handleSeeAllPress}
        loading={loadingSections.newReleases}
        hinarioType="GERAL"
      />

      {/* Seção de Hinos Populares */}
      <Section
        title="Hinos Populares"
        data={popularHymns}
        onItemPress={handleHymnPress}
        onSeeAllPress={handleSeeAllPress}
        loading={loadingSections.popular}
        hinarioType="GERAL"
      />

      {/* Seção de Clássicos - baseada no hinário selecionado */}
      <Section
        title="Clássicos"
        data={classicHymns}
        onItemPress={handleHymnPress}
        onSeeAllPress={handleSeeAllPress}
        loading={loadingSections.classics}
        hinarioType={hinario}
      />

      {/* Fim das seções */}
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
  // Cards de hinário
  hinarioCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  hinarioCard: {
    width: (screenWidth - 48) / 3,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  hinarioCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  hinarioCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  hinarioCardLabel: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
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
