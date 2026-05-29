import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const OnboardingContext = createContext();

const ONBOARDING_KEY = '@onboarding_completed';

export const OnboardingProvider = ({ children }) => {
  const [onboardingComplete, setOnboardingComplete] = useState(null); // null = loading
  const [data, setData] = useState({
    nome: '',
    email: '',
    password: '',
    birthDate: null,
    hinario: null,
    igreja: null,
    igrejaCriada: null,
    userType: null,
    grupo: null,
    grupoCriado: null,
    nomeGrupo: '',
    localGrupo: '',
    tipoGrupo: '',
    aceitouTermos: false,
    emailVerificado: false,
  });

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setOnboardingComplete(value === 'true');
    } catch {
      setOnboardingComplete(false);
    }
  };

  const updateData = (partial) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setOnboardingComplete(true);
    } catch (err) {
      console.error('Erro ao salvar onboarding:', err);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      setData({
        nome: '',
        email: '',
        password: '',
        birthDate: null,
        hinario: null,
        igreja: null,
        igrejaCriada: null,
        userType: null,
        grupo: null,
        grupoCriado: null,
        nomeGrupo: '',
        localGrupo: '',
        tipoGrupo: '',
        aceitouTermos: false,
        emailVerificado: false,
      });
      setOnboardingComplete(false);
    } catch (err) {
      console.error('Erro ao resetar onboarding:', err);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingComplete,
        data,
        updateData,
        completeOnboarding,
        resetOnboarding,
        checkOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
