import api from '../api/api';

/**
 * Envia código de verificação para o e-mail
 * @param {string} email
 */
export const sendVerificationCode = async (email) => {
  const response = await api.post('/email/send-code', { email });
  return response.data;
};

/**
 * Verifica o código informado
 * @param {string} email
 * @param {string} code - código de 6 dígitos
 */
export const verifyEmailCode = async (email, code) => {
  const response = await api.post('/email/verify-code', { email, code });
  return response.data;
};
