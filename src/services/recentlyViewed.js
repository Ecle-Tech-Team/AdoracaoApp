import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@recently_viewed';
const MAX_ITEMS = 20;

/**
 * Salva um hino como visualizado recentemente.
 * @param {Object} hymn - Objeto do hino (deve conter id, titulo, autor, numero, tipo_hino, imagem)
 */
export const saveRecentlyViewed = async (hymn) => {
  if (!hymn) return;

  const hymnId = hymn.id || hymn._id;
  if (!hymnId) return;

  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    let list = stored ? JSON.parse(stored) : [];

    // Remover duplicata se existir
    list = list.filter(item => item.id !== hymnId);

    // Salvar objeto completo (com verses, coro, etc) + viewedAt
    list.unshift({
      ...hymn,
      id: hymnId,
      viewedAt: Date.now(),
    
      titulo: hymn.titulo,
      autor: hymn.autor,
      numero: hymn.numero,
      tipo_hino: hymn.tipo_hino,
      imagem: hymn.imagem || hymn.image,
      viewedAt: Date.now(),
    });

    // Limitar ao máximo
    if (list.length > MAX_ITEMS) {
      list = list.slice(0, MAX_ITEMS);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error('Erro ao salvar hino visualizado:', error);
  }
};

/**
 * Retorna os hinos visualizados recentemente.
 * @param {number} limit - Quantidade máxima de hinos
 * @returns {Promise<Array>} Lista de hinos
 */
export const getRecentlyViewed = async (limit = 6) => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const list = JSON.parse(stored);
    return list.slice(0, limit);
  } catch (error) {
    console.error('Erro ao carregar hinos visualizados:', error);
    return [];
  }
};
