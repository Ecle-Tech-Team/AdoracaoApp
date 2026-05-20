import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.adoracaoapp.com.br',
  timeout: 10000
});

/* =========================
  AUTH
========================= */

export const registerUser = async (userData) => {
  const response = await api.post('/user', userData);
  return response.data;
};

export const userLogin = async (loginUser) => {

  try {
    const response = await axios.post(
      'https://api.adoracaoapp.com.br/login', 
      loginUser,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );    
    return response.data; 
  } catch (error) {
    throw error;
  }

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