import axios from 'axios';
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveSession,
  saveUser,
  setAuthenticated,
  setOfflineCached,
  shouldRefreshAccessToken,
} from '../services/sessionStore';

// Usa EXPO_PUBLIC_API_URL quando definida (eas.json / .env).
// O fallback é o backend local acessível via Tailscale (dev PC + celular na mesma tailnet).
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333',
  timeout: 10000
});

const authApi = axios.create({ baseURL: api.defaults.baseURL, timeout: api.defaults.timeout });
let refreshPromise = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const token = getRefreshToken();
      if (!token) throw new Error('Sessão sem token de atualização');
      try {
        const response = await authApi.post('/auth/refresh', { refreshToken: token, clientType: 'mobile' });
        if (getRefreshToken() !== token) throw new Error('Sessão alterada durante a atualização');
        await saveSession(response.data);
        return getAccessToken();
      } catch (error) {
        if ([400, 401, 403].includes(error.response?.status) && getRefreshToken() === token) {
          await clearSession();
        } else if (!error.response || error.response.status >= 500) {
          setOfflineCached();
        }
        throw error;
      }
    })().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
};

api.interceptors.request.use(async (config) => {
  if (shouldRefreshAccessToken()) await refreshAccessToken();
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    setAuthenticated();
    return response;
  },
  async (error) => {
    const request = error.config;
    if (!error.response) setOfflineCached();
    if (error.response?.status === 401 && request && request._authRetried) {
      if (request.url === '/auth/me') await clearSession();
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && request && !request._authRetried) {
      request._authRetried = true;
      const currentToken = getAccessToken();
      if (currentToken && request.headers.Authorization !== `Bearer ${currentToken}`) {
        request.headers.Authorization = `Bearer ${currentToken}`;
        return api(request);
      }
      if (getRefreshToken()) {
        const token = await refreshAccessToken();
        request.headers.Authorization = `Bearer ${token}`;
        return api(request);
      }
      if (getAccessToken()) await clearSession();
    }
    return Promise.reject(error);
  }
);

export const getCurrentUser = async (options) => {
  const response = await api.get('/auth/me');
  return saveUser(response.data, options);
};

export const revokeSession = async () => {
  const refreshToken = getRefreshToken();
  try {
    let token = getAccessToken();
    if (refreshToken && shouldRefreshAccessToken()) token = await refreshAccessToken();
    if (token) {
      await authApi.post('/auth/logout', undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } finally {
    await clearSession();
  }
};

/* =========================
  AUTH
========================= */

export const registerUser = async (userData) => {
  const response = await api.post('/user', userData);
  return response.data;
};

export const userLogin = async (loginUser) => {
  const response = await authApi.post('/login', { ...loginUser, clientType: 'mobile' });
  return response.data;
};

/* =========================
  HINÁRIOS (HARPA / CCB)
========================= */

/**
 * Busca todos os hinos de um hinário específico
 * Ex: harpa | ccb
 */
export const fetchHinosByHinario = async (hinario) => {
  try {
    const response = await api.get(`/hinos/${hinario}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar hinos do hinário ${hinario}:`, error);
    throw error;
  }
};

/**
 * Busca hino por número dentro de um hinário
 */
export const fetchHinoByNumero = async (hinario, numero) => {
  try {
    const response = await api.get(`/hinos/${hinario}/numero/${numero}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar hino por número:', error);
    throw error;
  }
};

/**
 * Busca hino por ID dentro de um hinário
 */
export const fetchHinoById = async (hinario, id) => {
  try {
    const response = await api.get(`/hinos/${hinario}/id/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar hino por ID:', error);
    throw error;
  }
};

/* =========================
  HINÁRIO GERAL (LEGADO)
========================= */

export const fetchHinosGeral = async () => {
  try {
    const response = await api.get('/hinario');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter hinário geral:', error);
    throw error;
  }
};

export const fetchHinoGeralById = async (id) => {
  try {
    const response = await api.get(`/hinario/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter hino geral por ID:', error);
    throw error;
  }
};

/* =========================
  GRUPOS / HINOS
========================= */

export const fetchHinarioGrupo = async (id_grupo) => {
  const response = await api.get(`/grupo/${id_grupo}/hinos`);
  return response.data;
};

export const fetchGrupo = async (id_grupo) => {
  const response = await api.get(`/grupo/${id_grupo}`);
  return response.data;
};

export const removeHinoFromGrupo = async (id_grupo, id_hino) => {
  const response = await api.delete(`/grupo/${id_grupo}/hinos/${id_hino}`);
  return response.data;
};

export const updateHinoTag = async (id_grupo, hinoId, tag) => {
  const response = await api.put(`/grupo/${id_grupo}/hinos/${hinoId}/tag`, { tag });
  return response.data;
};

/* =========================
  USUÁRIOS / COMPONENTES
========================= */

export const fetchUsuariosParaComponentes = async () => {
  const response = await api.get('/user/componentes');
  return response.data;
};

export const fetchComponentes = async (id_grupo) => {
  const response = await api.get(`/user/grupo/${id_grupo}/componentes`);
  return response.data;
};

// The API derives the authenticated member's current group and resets the
// role; no client-supplied group ID is accepted for a self-leave operation.
export const removeComponentFromGrupo = async (idUser) => {
  const response = await api.put(`/user/removeComponente/${idUser}`);
  return response.data;
};

/* =========================
  ENSAIOS
========================= */

export const fetchEnsaiosDoGrupo = async (id_grupo) => {
  const response = await api.get(`/ensaios/${id_grupo}`);
  return response.data;
};

export const createEnsaio = async (id_grupo, data, descricao, local, hinoIds = []) => {
  const response = await api.post(`/ensaios/${id_grupo}`, {
    data,
    descricao,
    local,
    hinoIds
  });
  return response.data;
};

export const removeEnsaio = async (id) => {
  const response = await api.delete(`/ensaios/${id}`);
  return response.data;
};

export const updateEnsaio = async (id, data, descricao, local, hinoIds = []) => {
  const response = await api.put(`/ensaios/${id}`, {
    data,
    descricao,
    local,
    hinoIds
  });
  return response.data;
};

/* =========================
  EVENTOS
========================= */

export const fetchEventosDoGrupo = async (id_grupo) => {
  const response = await api.get(`/eventos/${id_grupo}`);
  return response.data;
};

export const createEvento = async (id_grupo, data, descricao, local, hinoIds = []) => {
  const response = await api.post(`/eventos/${id_grupo}`, {
    data,
    descricao,
    local,
    hinoIds
  });
  return response.data;
};

export const removeEvento = async (id) => {
  const response = await api.delete(`/eventos/${id}`);
  return response.data;
};

export const updateEvento = async (id, data, descricao, local, hinoIds = []) => {
  const response = await api.put(`/eventos/${id}`, {
    data,
    descricao,
    local,
    hinoIds
  });
  return response.data;
};

/* =========================
  FAVORITOS
========================= */

export const addFavorito = async (id_user, hinoId, tipo_hino) => {
  const response = await api.post(`/favoritos/${id_user}`, {
    hinoId,
    tipo_hino
  });
  return response.data;
};

export const fetchFavoritos = async (id_user) => {
  const response = await api.get(`/favoritos/${id_user}`);
  return response.data;
};

export const removeFavorito = async (id_user, hinoId) => {
  const response = await api.delete(`/favoritos/${id_user}/${hinoId}`);
  return response.data;
};

/* =========================
   NOTIFICAÇÕES
========================= */

/**
 * Busca notificações do usuário logado
 */
export const fetchNotificacoes = async (id_user) => {
  try {
    const response = await api.get(`/notificacoes/${id_user}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    throw error;
  }
};

/**
 * Marca uma notificação como lida
 */
export const marcarComoLida = async (id_notificacao, id_user) => {
  try {
    const response = await api.put(
      `/notificacoes/${id_notificacao}/lida`,
      { id_user }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Marca todas as notificações como lidas
 */
export const marcarTodasComoLidas = async () => {
  try {
    const response = await api.put('/notificacoes/lidas');
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao marcar todas as notificações como lidas:',
      error
    );
    throw error;
  }
};

/**
 * Remove uma notificação
 */
export const removerNotificacao = async (id_notificacao) => {
  try {
    const response = await api.delete(
      `/notificacoes/${id_notificacao}`
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao remover notificação:', error);
    throw error;
  }
};

/* =========================
   PUSH NOTIFICATIONS
========================= */

/**
 * Registra o token do Expo Push no backend
 */
export const registerPushToken = async (token, id_user = null) => {
  try {
    const data = { token };
    // Sempre enviar id_user, mesmo se for null
    data.id_user = id_user;

    // O backend exige id_user (400 se null). No login o id chega dentro de "usuario".
    const response = await api.post('/push-token', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar token push:', error.response?.data || error.message);
    throw error;
  }
};

/* =========================
   PLAYLISTS
========================= */

export const createPlaylist = async (userId, nome, descricao) => {
  const response = await api.post('/playlists', { userId, nome, descricao });
  return response.data;
};

export const getUserPlaylists = async (userId) => {
  const response = await api.get(`/playlists/${userId}`);
  return response.data;
};

export const getPlaylistById = async (userId, playlistId) => {
  const response = await api.get(`/playlists/${userId}/${playlistId}`);
  return response.data;
};

export const updatePlaylist = async (playlistId, userId, nome, descricao) => {
  const response = await api.put(`/playlists/${playlistId}`, { userId, nome, descricao });
  return response.data;
};

export const deletePlaylist = async (userId, playlistId) => {
  const response = await api.delete(`/playlists/${userId}/${playlistId}`);
  return response.data;
};

export const addHinoToPlaylist = async (playlistId, userId, hinoId, tipoHino) => {
  const response = await api.post(`/playlists/${playlistId}/hinos`, { userId, hinoId, tipoHino });
  return response.data;
};

export const removeHinoFromPlaylist = async (userId, playlistId, hinoId, tipoHino) => {
  const response = await api.delete(`/playlists/${userId}/${playlistId}/hinos/${hinoId}/${tipoHino}`);
  return response.data;
};

export const getPlaylistHinos = async (userId, playlistId) => {
  const response = await api.get(`/playlists/${userId}/${playlistId}`);
  return response.data;
};

export const getAllGrupos = async () => {
  const response = await api.get('/grupo');
  return response.data;
};

export const createGrupo = async (name, local, typeGroup, regenteId) => {
  const response = await api.post('/grupo', { name, local, typeGroup, regenteId });
  return response.data;
};

export const checkEmailExists = async (email) => {
  const response = await api.get(`/user/check-email/${encodeURIComponent(email)}`);
  return response.data;
};

export const listarIgrejas = async () => {
  const response = await api.get('/user/igrejas');
  return response.data;
};

export { api };
export default api;
