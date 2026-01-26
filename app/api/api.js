import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
  timeout: 10000
});

/* =========================
   AUTH
========================= */

export const registerUser = async () => {
  const response = await api.post('/user');
  return response.data;
};

export const userLogin = async (loginUser) => {
  const response = await api.post('/login', loginUser, {
    headers: { 'Content-Type': 'application/json' }
  });
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

export const removeHinoFromGrupo = async (id_grupo, id_hino) => {
  const response = await api.delete(`/grupo/${id_grupo}/hinos/${id_hino}`);
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
