import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_PREFIX = '@recent_addresses';
const MAX_ITEMS = 10;

const getStorageKey = (id_grupo) => `${STORAGE_KEY_PREFIX}_${id_grupo}`;

/**
 * Salva um endereço como recente (escopo por grupo).
 * @param {string} address - Endereço
 * @param {string} id_grupo - ID do grupo
 */
export const saveRecentAddress = async (address, id_grupo) => {
  if (!address || !address.trim() || !id_grupo) return;

  try {
    const key = getStorageKey(id_grupo);
    const stored = await AsyncStorage.getItem(key);
    let list = stored ? JSON.parse(stored) : [];

    list = list.filter(item => item !== address);

    list.unshift(address);

    if (list.length > MAX_ITEMS) {
      list = list.slice(0, MAX_ITEMS);
    }

    await AsyncStorage.setItem(key, JSON.stringify(list));
  } catch (error) {
    console.error('Erro ao salvar endereço recente:', error);
  }
};

/**
 * Retorna os endereços recentes de um grupo.
 * @param {string} id_grupo - ID do grupo
 * @param {number} limit - Quantidade máxima
 * @returns {Promise<Array>} Lista de endereços
 */
export const getRecentAddresses = async (id_grupo, limit = 10) => {
  if (!id_grupo) return [];

  try {
    const key = getStorageKey(id_grupo);
    const stored = await AsyncStorage.getItem(key);
    if (!stored) return [];

    const list = JSON.parse(stored);
    return list.slice(0, limit);
  } catch (error) {
    console.error('Erro ao carregar endereços recentes:', error);
    return [];
  }
};
