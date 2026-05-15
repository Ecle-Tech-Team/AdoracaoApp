import { View, StyleSheet } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { AuthProvider, AuthContext } from '../src/contexts/AuthContext';
import { HinarioProvider } from "../src/contexts/HinarioContext";
import { SectionProvider } from "../src/contexts/SectionContext";
import { registerForPushNotifications, setupNotificationListener } from '../src/services/notificationService';
import Login from './screens/login';
import Cadastro from './screens/cadastro';
import Dashboard from './screens/dashboard';
import DashboardCantor from './screens/dashboardCantor';
import DashboardGrupo from './screens/dashboardGrupo';
import Adoracao from './screens/adoracao';
import Harpa from './screens/harpa';
import Hino from './screens/hino';
import Hinario from './screens/hinario';
import HinoGeral from './screens/hinoGeral';
import HymnsSection from './screens/HymnsSection';
import Pesquisa from './screens/pesquisa';
import Favoritos from './screens/favoritos';
import Mais from './screens/mais';
import MaisReg from './screens/maisReg';
import MaisComp from './screens/maisComp';
import CriarGrupo from './screens/criarGrupo';
import EnsaiosReg from './screens/ensaiosReg';
import EnsaiosComp from './screens/ensaiosComp';
import EventosCantor from './screens/eventosCantor';
import EventosReg from './screens/eventosReg';
import EventosComp from './screens/eventosComp';
import GrupoReg from './screens/grupoReg';
import GrupoComp from './screens/grupoComp';
import HinarioReg from './screens/hinarioReg';
import AdicionarHino from './screens/adicionarHino';
import MudarHinario from './screens/mudarHinario';
import HinarioComp from './screens/hinarioComp';
import hinarioGrupo from './screens/hinoComp';
import Componentes from './screens/componentes';
import AdicionarComp from './screens/adicionarComp';
import Notificacoes from './screens/notificacoes';
import MenuInferiorAdorador from './components/MenuInferior';
import MenuInferiorReg from './components/MenuInferiorReg';
import MenuInferiorComp from './components/MenuInferiorComp';
import MenuSuperiorAdorador from './components/MenuSuperior';
import MenuSuperiorGrupo from './components/MenuSuperiorGrupo';
import AdicionarEnsaio from './screens/adicionarEnsaio';
import AdicionarEvento from './screens/adicionarEvento';

const userScreens = {
  Adorador: {
    dashboard: Dashboard,
    menuSuperior: MenuSuperiorAdorador,
    menuInferior: MenuInferiorAdorador,
    screens: [Adoracao, Harpa, Hino, Hinario, HinoGeral, Pesquisa, Favoritos, Mais, Notificacoes, MudarHinario, HymnsSection],
  },
  Músico: {
    dashboard: Dashboard,
    menuSuperior: MenuSuperiorAdorador,
    menuInferior: MenuInferiorAdorador,
    screens: [Adoracao, Harpa, Hino, Hinario, HinoGeral, Pesquisa, Favoritos, Mais, Notificacoes, MudarHinario, HymnsSection],
  },
  Cantor: {
    dashboard: DashboardCantor,
    MenuSuperior: MenuSuperiorAdorador,
    menuInferior: MenuInferiorAdorador,
    screens: [EventosCantor, Harpa, Hino, Hinario, HinoGeral, Pesquisa, Favoritos, Mais, Notificacoes, MudarHinario, HymnsSection],
  },
  Regente: {
    dashboard: DashboardGrupo,
    menuSuperior: MenuSuperiorGrupo,
    menuInferior: MenuInferiorReg,
    screens: [Adoracao, Harpa, Hino, Hinario, HinoGeral, EnsaiosReg,AdicionarEnsaio, EventosReg, AdicionarEvento, GrupoReg, HinarioReg, hinarioGrupo, AdicionarHino, Componentes, AdicionarComp, Adoracao, Pesquisa, Favoritos, MaisReg, CriarGrupo, Notificacoes, MudarHinario, HymnsSection],
  },
  Componente: {
    dashboard: DashboardGrupo,
    menuSuperior: MenuSuperiorGrupo,
    menuInferior: MenuInferiorComp,
    screens: [EnsaiosComp, EventosComp, GrupoComp, HinarioComp, hinarioGrupo, Adoracao, Harpa, Hino, Hinario, HinoGeral, Pesquisa, Favoritos, MaisComp, Notificacoes, MudarHinario, HymnsSection],
  },
};

function Page() {
  const { user } = useContext(AuthContext);
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [previousScreen, setPreviousScreen] = useState(null);
  const [selectedHino, setSelectedHino] = useState(null);
  const [selectedHinoGeral, setSelectedHinoGeral] = useState(null);

  const navigateTo = (screen, item = null, hinoGeral = null, previousScreenParam = null) => {
    setSelectedHino(item);
    setSelectedHinoGeral(hinoGeral);
    setPreviousScreen(previousScreenParam || currentScreen);
    setCurrentScreen(screen);
  };

  const handleLogin = async (userToken, userType) => {
    try {
      await AsyncStorage.setItem('userToken', userToken);
      await AsyncStorage.setItem('userType', userType);
      setCurrentScreen('Dashboard');
    } catch (error) {
      console.error('Erro ao salvar token de login:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userType');
      setCurrentScreen('Login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const userType = user?.userType;
  const { dashboard: DashboardComponent, menuInferior: MenuInferiorComponent, menuSuperior: MenuSuperiorComponent } = userScreens[userType] || {};

  let ScreenComponent;

  if (!user) {
    ScreenComponent = currentScreen === "Cadastro" ? Cadastro : Login;
  } else if (currentScreen === 'Dashboard') {
    ScreenComponent = DashboardComponent;
  } else if (currentScreen === 'HinoGeral' || (currentScreen === 'Hino' && selectedHino?.tipo_hino === 'GERAL')) {
    ScreenComponent = HinoGeral;
  } else {
    ScreenComponent = userScreens[userType]?.screens.find(screen => screen.name === currentScreen) || DashboardComponent;
  }
  
  return (
    <View style={styles.container}>
      {user && MenuSuperiorComponent && <MenuSuperiorComponent navigateTo={navigateTo} />}
      <View style={styles.content}>
        <ScreenComponent
          navigateTo={navigateTo}
          selectedHino={selectedHino}
          previousScreen={previousScreen}
          selectedHinoGeral={selectedHinoGeral}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </View>
      {user && MenuInferiorComponent && <MenuInferiorComponent navigateTo={navigateTo} />}
    </View>
  );
}

function AppWrapper() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Configurar handler de notificações
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Configurar listener para notificações recebidas
    const removeListener = setupNotificationListener();

    // Configurar notificações quando o app inicia e o usuário está disponível
    if (user?.id_user) {
      registerForPushNotifications(user.id_user);
    }

    return () => {
      removeListener();
    };
  }, [user]);

  return <Page />;
}

export default function App() {
  return (
    <AuthProvider>
      <HinarioProvider>
        <SectionProvider>
          <AppWrapper />
        </SectionProvider>
      </HinarioProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
