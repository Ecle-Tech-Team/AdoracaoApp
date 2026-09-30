import React, { createContext, useEffect, useState } from 'react';
import { getCurrentUser, revokeSession } from '../api/api';
import {
  getAccessToken,
  getRefreshToken,
  getSession,
  hydrateSession,
  publishSession,
  saveSession,
  saveUser,
  setOfflineCached,
  subscribeSession,
} from '../services/sessionStore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(getSession);

  useEffect(() => {
    const unsubscribe = subscribeSession(setSession);
    const restore = async () => {
      try {
        const stored = await hydrateSession();
        if (getAccessToken() || getRefreshToken()) {
          await getCurrentUser();
        }
      } catch (error) {
        // An unavailable API must not destroy a locally cached session.
        if (!error.response || error.response.status >= 500) setOfflineCached();
      }
    };
    restore();
    return unsubscribe;
  }, []);

  const login = async (response, { deferPublish = false, skipIdentityRefresh = false } = {}) => {
    const authenticatedUser = await saveSession(response, { notify: !deferPublish });
    if (skipIdentityRefresh) return authenticatedUser;
    try {
      return await getCurrentUser({ notify: !deferPublish });
    } catch (error) {
      if (error.response && error.response.status < 500) throw error;
      setOfflineCached();
      return authenticatedUser;
    }
  };

  const logout = async () => {
    try {
      await revokeSession();
    } catch (error) {
      // revokeSession always clears the device session, even when offline.
      console.warn('Não foi possível revogar a sessão no servidor:', error.message);
    }
  };

  const refreshUser = (options) => getCurrentUser(options);
  const completeLogin = () => publishSession();

  const updateUser = async (updates) => {
    const updated = await saveUser({ ...session.user, ...updates });
    try {
      return await refreshUser();
    } catch (error) {
      if (!error.response || error.response.status >= 500) return updated;
      throw error;
    }
  };

  const saveGrupoId = (id) => updateUser({ id_grupo: id });
  const id_grupo = session.user?.id_grupo ?? null;

  return (
    <AuthContext.Provider value={{
      user: session.user,
      status: session.status,
      isLoading: session.status === 'loading',
      isOfflineCached: session.status === 'offline-cached',
      id_grupo,
      login,
      completeLogin,
      logout,
      refreshUser,
      saveGrupoId,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
