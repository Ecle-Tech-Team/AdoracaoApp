import api from '../api/api';

export const fetchIgrejas = async (search = '') =>
  (await api.get('/igrejas', { params: { search } })).data;

export const fetchIgrejaById = async (id) =>
  (await api.get(`/igrejas/${encodeURIComponent(id)}`)).data;

export const createIgreja = async (data) =>
  (await api.post('/igrejas', data)).data;
