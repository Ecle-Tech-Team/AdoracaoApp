import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import HymnCard from '../components/HymnCard';
import { useHymns } from '../../src/hooks/useHymns';
import { AuthContext } from '../../src/contexts/AuthContext';
import { HinarioContext } from '../../src/contexts/HinarioContext';
import { useSection } from '../../src/contexts/SectionContext';
import { fetchHinosByHinario, fetchEnsaiosDoGrupo, fetchEventosDoGrupo, getUserPlaylists } from '../../src/api/api';
import { getRecentlyViewed as loadRecentlyViewed, saveRecentlyViewed } from '../../src/services/recentlyViewed';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { width: screenWidth } = Dimensions.get('window');
const isLargeScreen = screenWidth > 600;

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

const AtividadeCard = ({ item, onPress }) => {
  const isEvento = item.tipo === 'evento';
  const formattedDate = format(new Date(item.data), 'dd/MM - HH:mm', { locale: ptBR });

  return (
    <TouchableOpacity
      style={[
        styles.atividadeCard,
        { backgroundColor: isEvento ? '#FFE2E2' : '#F5FBFF' }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.atividadeHeader}>
        <View style={[styles.tipoBadge, { backgroundColor: isEvento ? '#FF4242' : '#26516E' }]}>
          <Text style={styles.tipoBadgeText}>
            {isEvento ? 'EVENTO' : 'ENSAIO'}
          </Text>
        </View>
        <Text style={[styles.atividadeDate, { color: isEvento ? '#FF4242' : '#26516E' }]}>
          {formattedDate}
        </Text>
      </View>
      <Text style={[styles.atividadeTitle, { color: isEvento ? '#FF4242' : '#26516E' }]}>
        {item.descricao}
      </Text>
      {item.local ? (
        <Text style={[styles.atividadeLocal, { color: isEvento ? '#FF8282' : '#5F8BA9' }]}>
          {item.local}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

export default function DashboardGrupo({ navigateTo }) {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [popularHymns, setPopularHymns] = useState([]);
  const [classicHymns, setClassicHymns] = useState([]);
  const [proximasAtividades, setProximasAtividades] = useState([]);
  const [loadingAtividades, setLoadingAtividades] = useState(true);
  const [loadingSections, setLoadingSections] = useState({
    recentlyViewed: true,
    newReleases: true,
    popular: true,
    classics: true,
  });
  const { user, id_grupo } = useContext(AuthContext);
  const { hinario } = useContext(HinarioContext);
  const { updateSectionData } = useSection();

  const userId = user?.id_user;
  const {
    hymns,
    loading: hymnsLoading,
    getNewReleases,
    getPopularHymns,
  } = useHymns(userId);

  const handleHymnPress = (hymn) => {
    saveRecentlyViewed(hymn);
    if (hymn.tipo_hino === 'GERAL') {
      navigateTo('HinoGeral', hymn, null, 'DashboardGrupo');
    } else {
      navigateTo('Hino', hymn, null, 'DashboardGrupo');
    }
  };

  const handleSeeAllPress = (sectionTitle, hymns) => {
    const filterType = sectionTitle.toLowerCase().replace(/\s+/g, '_');
    updateSectionData(sectionTitle, hymns, filterType);
    navigateTo('HymnsSection', null, null, 'DashboardGrupo');
  };

  const handleAtividadePress = (item) => {
    const isComponente = user?.userType === 'Componente';
    if (item.tipo === 'evento') {
      navigateTo(isComponente ? 'EventosComp' : 'EventosReg');
    } else {
      navigateTo(isComponente ? 'EnsaiosComp' : 'EnsaiosReg');
    }
  };

  // Carregar recentemente vistos
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

  // Carregar novas seções de hinos
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

  // Carregar próximas atividades (eventos + ensaios)
  useEffect(() => {
    let cancelled = false;

    const loadAtividades = async () => {
      if (!id_grupo) {
        setLoadingAtividades(false);
        return;
      }

      try {
        const [eventos, ensaios] = await Promise.all([
          fetchEventosDoGrupo(id_grupo),
          fetchEnsaiosDoGrupo(id_grupo),
        ]);

        if (cancelled) return;

        const agora = new Date();

        const eventosFuturos = (eventos || [])
          .filter(e => new Date(e.data) >= agora)
          .map(e => ({ ...e, tipo: 'evento' }));

        const ensaiosFuturos = (ensaios || [])
          .filter(e => new Date(e.data) >= agora)
          .map(e => ({ ...e, tipo: 'ensaio' }));

        const combinados = [...eventosFuturos, ...ensaiosFuturos]
          .sort((a, b) => new Date(a.data) - new Date(b.data))
          .slice(0, 5);

        setProximasAtividades(combinados);
      } catch (error) {
        console.error('Erro ao carregar próximas atividades:', error);
      } finally {
        if (!cancelled) setLoadingAtividades(false);
      }
    };

    loadAtividades();
    return () => { cancelled = true; };
  }, [id_grupo]);

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });

  if (!fontLoaded || hymnsLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FFCB69" />
        <Text style={styles.loadingText}>
          {hymnsLoading ? 'Carregando hinos...' : 'Carregando...'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Próximas Atividades */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximas Atividades</Text>
          <TouchableOpacity onPress={() => navigateTo(user?.userType === 'Componente' ? 'GrupoComp' : 'GrupoReg')}>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {loadingAtividades ? (
          <ActivityIndicator size="small" color="#FFCB69" />
        ) : proximasAtividades.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma atividade futura agendada.</Text>
        ) : (
          <>
            {(() => {
              const maxVisible = isLargeScreen ? 3 : 2;
              const visible = proximasAtividades.slice(0, maxVisible);
              const remaining = proximasAtividades.length - maxVisible;

              return (
                <>
                  {visible.map((item) => (
                    <AtividadeCard
                      key={`${item.tipo}-${item.id}`}
                      item={item}
                      onPress={() => handleAtividadePress(item)}
                    />
                  ))}
                  {remaining > 0 && (
                    <TouchableOpacity onPress={() => navigateTo(user?.userType === 'Componente' ? 'GrupoComp' : 'GrupoReg')}>
                      <Text style={styles.maisAtividadesText}>
                        +{remaining} {remaining === 1 ? 'atividade' : 'atividades'} nessa semana
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              );
            })()}
          </>
        )}
      </View>

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

      {/* Seção de Clássicos */}
      <Section
        title="Clássicos"
        data={classicHymns}
        onItemPress={handleHymnPress}
        onSeeAllPress={handleSeeAllPress}
        loading={loadingSections.classics}
        hinarioType={hinario}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontFamily: 'Poppins_700Bold',
  },
  seeAllText: {
    color: '#FFCB69',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Poppins_600SemiBold',
  },
  horizontalList: {
    paddingRight: 16,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    paddingLeft: 4,
    fontFamily: 'Nunito_500Medium',
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
  // Cards de atividades
  atividadeCard: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  atividadeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tipoBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  atividadeDate: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  atividadeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Poppins_600SemiBold',
  },
  atividadeLocal: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
  },
  maisAtividadesText: {
    color: '#FFCB69',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    marginTop: 6,
  },
});
