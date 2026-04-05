import { useState, useEffect } from 'react';
import { fetchHinosGeral, fetchHinosByHinario, fetchFavoritos } from '../api/api.js';

// Hook para gerenciar hinos
export const useHymns = (userId = null) => {
  const [hymns, setHymns] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar todos os hinos
  const fetchAllHymns = async () => {
    try {
      setLoading(true);
      const data = await fetchHinosGeral();
      setHymns(data);
      setError(null);
      return data;
    } catch (err) {
      console.error('Erro ao buscar hinos:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Buscar hinos por hinário
  const fetchHymnsByHinario = async (hinario) => {
    try {
      setLoading(true);
      const data = await fetchHinosByHinario(hinario);
      setHymns(data);
      setError(null);
      return data;
    } catch (err) {
      console.error(`Erro ao buscar hinos do hinário ${hinario}:`, err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Buscar favoritos do usuário
  const fetchUserFavorites = async (userId) => {
    if (!userId) return [];

    try {
      setLoading(true);
      const data = await fetchFavoritos(userId);
      setFavorites(data);
      setError(null);
      return data;
    } catch (err) {
      console.error('Erro ao buscar favoritos:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Filtrar hinos por critérios
  const filterHymns = (criteria = {}) => {
    let filtered = [...hymns];

    // Filtrar por hinário
    if (criteria.hinario) {
      filtered = filtered.filter(hymn => hymn.hinario === criteria.hinario);
    }

    // Filtrar por favoritos
    if (criteria.favoritesOnly && userId) {
      const favoriteIds = favorites.map(fav => fav.hinoId || fav.id);
      filtered = filtered.filter(hymn => favoriteIds.includes(hymn.id));
    }

    // Filtrar por título/autor (busca)
    if (criteria.search) {
      const searchTerm = criteria.search.toLowerCase();
      filtered = filtered.filter(hymn =>
        (hymn.titulo && hymn.titulo.toLowerCase().includes(searchTerm)) ||
        (hymn.autor && hymn.autor.toLowerCase().includes(searchTerm)) ||
        (hymn.numero && hymn.numero.toString().includes(searchTerm))
      );
    }

    // Limitar quantidade
    if (criteria.limit) {
      filtered = filtered.slice(0, criteria.limit);
    }

    // Ordenar
    if (criteria.sortBy) {
      switch (criteria.sortBy) {
        case 'number':
          filtered.sort((a, b) => (a.numero || 0) - (b.numero || 0));
          break;
        case 'title':
          filtered.sort((a, b) => (a.titulo || '').localeCompare(b.titulo || ''));
          break;
        case 'recent':
          // Ordenar por data de criação/modificação se disponível
          filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
        default:
          break;
      }
    }

    return filtered;
  };

  // Buscar hinos recentemente vistos (simulado - você pode implementar com AsyncStorage)
  const getRecentlyViewed = async (limit = 6) => {
    // Aqui você pode integrar com AsyncStorage para obter hinos visualizados recentemente
    // Por enquanto, retornamos os primeiros hinos como exemplo
    return filterHymns({ limit, sortBy: 'recent' });
  };

  // Buscar novos lançamentos (simulado - você pode implementar com data de criação)
  const getNewReleases = async (limit = 6) => {
    // Aqui você pode filtrar por data de criação recente
    // Por enquanto, retornamos alguns hinos aleatórios
    const shuffled = [...hymns].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  };

  // Buscar hinos populares (simulado)
  const getPopularHymns = async (limit = 6) => {
    // Aqui você pode integrar com estatísticas de visualização
    // Por enquanto, retornamos alguns hinos aleatórios
    const shuffled = [...hymns].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  };

  // Inicializar com todos os hinos
  useEffect(() => {
    fetchAllHymns();

    // Buscar favoritos se userId fornecido
    if (userId) {
      fetchUserFavorites(userId);
    }
  }, [userId]);

  return {
    hymns,
    favorites,
    loading,
    error,
    fetchAllHymns,
    fetchHymnsByHinario,
    fetchUserFavorites,
    filterHymns,
    getRecentlyViewed,
    getNewReleases,
    getPopularHymns,
  };
};