import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const PROFILE_KEY = '@auth_profile';
const REFRESH_KEY = 'auth_refresh_token';
const LEGACY_KEYS = ['userToken', 'userId', 'userType', 'grupoId', 'userChurchId'];

let accessToken = null;
let accessExpiresAt = null;
let refreshToken = null;
let user = null;
let status = 'loading';
const listeners = new Set();
const secureGet = () => Platform.OS === 'web' ? null : SecureStore.getItemAsync(REFRESH_KEY);
const secureSet = (value) => Platform.OS === 'web' ? Promise.resolve() : SecureStore.setItemAsync(REFRESH_KEY, value);
const secureDelete = () => Platform.OS === 'web' ? Promise.resolve() : SecureStore.deleteItemAsync(REFRESH_KEY);

const emit = () => listeners.forEach((listener) => listener(getSession()));

export const getSession = () => ({ user, status });
export const getAccessToken = () => accessToken;
export const shouldRefreshAccessToken = () => Boolean(refreshToken && (!accessToken || (accessExpiresAt && Date.now() >= accessExpiresAt - 30000)));
export const getRefreshToken = () => refreshToken;
export const subscribeSession = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const normalizeUser = (source, fallback = null) => {
  if (!source && !fallback) return null;
  const value = source || {};
  const previous = fallback || {};
  const id_user = value.id_user ?? value.id_usuario ?? value.idUser ?? value.userId ?? value.id ?? previous.id_user;
  const userType = value.userType ?? value.typeUser ?? value.tipo_usuario ?? value.tipoUsuario ?? value.role ?? previous.userType;
  const groupKey = ['id_grupo', 'grupoId', 'groupId'].find((key) => Object.prototype.hasOwnProperty.call(value, key));
  const id_grupo = groupKey ? value[groupKey] : previous.id_grupo ?? null;
  const churchKey = ['id_igreja', 'userChurchId'].find((key) => Object.prototype.hasOwnProperty.call(value, key));
  const id_igreja = churchKey ? value[churchKey] : previous.id_igreja ?? null;
  if (!id_user || !userType) return null;
  const { token, accessToken, refreshToken, password, ...safeValue } = value;
  const { token: oldToken, accessToken: oldAccess, refreshToken: oldRefresh, password: oldPassword, ...safePrevious } = previous;
  return { ...safePrevious, ...safeValue, id_user: Number(id_user), userType,
    id_grupo: id_grupo ? Number(id_grupo) : null, id_igreja: id_igreja ? Number(id_igreja) : null };
};

export const userFromResponse = (data, fallback = null) => {
  const candidate = data?.user || data?.usuario || data;
  const topLevel = normalizeUser(data, fallback);
  return normalizeUser(candidate, topLevel || fallback);
};

export const hydrateSession = async () => {
  const entries = await AsyncStorage.multiGet([PROFILE_KEY, ...LEGACY_KEYS]);
  const stored = Object.fromEntries(entries);
  let cached = null;
  try {
    cached = stored[PROFILE_KEY] ? normalizeUser(JSON.parse(stored[PROFILE_KEY])) : null;
  } catch {
    cached = null;
  }
  const restoredUser = cached || normalizeUser({
    id_user: stored.userId,
    userType: stored.userType,
    id_grupo: stored.grupoId,
    id_igreja: stored.userChurchId,
  });
  accessToken = stored.userToken || null;
  accessExpiresAt = null;
  refreshToken = await secureGet();

  const hasLegacySession = LEGACY_KEYS.some((key) => stored[key] !== null);
  // Upgrade the former scattered profile keys on first launch. Access tokens
  // deliberately remain memory-only after this process has started.
  if (restoredUser && hasLegacySession) {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(restoredUser));
    await AsyncStorage.multiRemove(LEGACY_KEYS);
  }
  user = accessToken || refreshToken ? restoredUser : null;
  status = user && (accessToken || refreshToken) ? 'offline-cached' : 'unauthenticated';
  emit();
  return { user, accessToken, refreshToken };
};

export const saveSession = async (data, { notify = true } = {}) => {
  const nextToken = data?.accessToken || data?.token;
  const nextUser = userFromResponse(data, user);
  if (!nextToken || !nextUser) throw new Error('Resposta de sessão incompleta');
  const nextRefresh = data.refreshToken || refreshToken;
  if (nextRefresh) await secureSet(nextRefresh);
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(nextUser));
  await AsyncStorage.multiRemove(LEGACY_KEYS);
  accessToken = nextToken;
  accessExpiresAt = Number(data.expiresIn) > 0 ? Date.now() + Number(data.expiresIn) * 1000 : null;
  refreshToken = nextRefresh || null;
  user = nextUser;
  status = 'authenticated';
  if (notify) emit();
  return nextUser;
};

export const saveUser = async (data, { notify = true } = {}) => {
  const nextUser = userFromResponse(data, user);
  if (!nextUser) throw new Error('Resposta de usuário incompleta');
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(nextUser));
  user = nextUser;
  status = 'authenticated';
  if (notify) emit();
  return nextUser;
};

// Used by onboarding after its dependent setup has completed.
export const publishSession = () => emit();

export const setOfflineCached = () => {
  if (user && (accessToken || refreshToken)) {
    status = 'offline-cached';
    emit();
  }
};

export const setAuthenticated = () => {
  if (user && status === 'offline-cached') {
    status = 'authenticated';
    emit();
  }
};

export const clearSession = async () => {
  // Clear memory before asynchronous storage work so requests cannot reuse this session.
  accessToken = null;
  accessExpiresAt = null;
  refreshToken = null;
  user = null;
  status = 'unauthenticated';
  emit();
  await secureDelete();
  await AsyncStorage.multiRemove([PROFILE_KEY, ...LEGACY_KEYS]);
};
