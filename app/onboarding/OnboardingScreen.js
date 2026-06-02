import { View, StyleSheet, Animated, Dimensions, Alert } from 'react-native';
import React, { useState, useRef, useCallback, useContext } from 'react';
import * as Notifications from 'expo-notifications';
import { useOnboarding } from '../../src/contexts/OnboardingContext';
import { AuthContext } from '../../src/contexts/AuthContext';
import { HinarioContext } from '../../src/contexts/HinarioContext';
import api, { registerUser, userLogin, createGrupo, getAllGrupos, checkEmailExists, listarIgrejas } from '../../src/api/api';
import Welcome from './Welcome';
import CadastroNome from './CadastroNome';
import CadastroEmail from './CadastroEmail';
import VerificacaoEmail from './VerificacaoEmail';
import VerificacaoSucesso from './VerificacaoSucesso';
import CadastroSenha from './CadastroSenha';
import CadastroDataNasc from './CadastroDataNasc';
import TermosCondicoes from './TermosCondicoes';
import SelecionarHinario from './SelecionarHinario';
import SelecionarIgreja from './SelecionarIgreja';
import TipoUsuario from './TipoUsuario';
import GrupoComponente from './GrupoComponente';
import GrupoRegente from './GrupoRegente';
import CriarGrupo from './CriarGrupo';
import Notificacoes from './Notificacoes';
import Revisar from './Revisar';
import Pronto from './Pronto';

const { width } = Dimensions.get('window');

const STEPS = {
  WELCOME: 0,
  NOME: 1,
  EMAIL: 2,
  VERIFICACAO: 3,
  VERIFICADO: 4,
  SENHA: 5,
  DATA_NASC: 6,
  TERMOS: 7,
  HINARIO: 8,
  IGREJA: 9,
  TIPO_USUARIO: 10,
  GRUPO_COMPONENTE: 11,
  GRUPO_REGENTE: 12,
  CRIAR_GRUPO: 13,
  NOTIFICACOES: 14,
  REVISAR: 15,
  PRONTO: 16,
};

export default function OnboardingScreen({ onComplete, navigateTo }) {
  const { data, updateData, completeOnboarding } = useOnboarding();
  const { login } = useContext(AuthContext);
  const { trocarHinario } = useContext(HinarioContext);
  const [step, setStep] = useState(STEPS.WELCOME);
  const [emailError, setEmailError] = useState('');
  const [igrejas, setIgrejas] = useState([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    (async () => {
      try {
        const data = await listarIgrejas();
        setIgrejas(data);
      } catch (err) {
        console.log('Erro ao carregar igrejas:', err);
      }
    })();
  }, []);

  const animateTo = useCallback(
    (nextStep) => {
      Animated.timing(slideAnim, {
        toValue: nextStep > step ? 1 : -1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setStep(nextStep);
        slideAnim.setValue(0);
      });
    },
    [step, slideAnim]
  );

  const goNext = (nextStep) => {
    // Se está em modo revisão e não está indo para REVISAR ou PRONTO,
    // redireciona de volta ao REVISAR.
    // Exceto para steps de grupo, que precisam ser percorridos em sequência
    // antes de voltar ao REVISAR.
    if (
      isReviewing &&
      nextStep !== STEPS.REVISAR &&
      nextStep !== STEPS.PRONTO &&
      step !== STEPS.REVISAR &&
      ![STEPS.VERIFICACAO, STEPS.VERIFICADO, STEPS.TIPO_USUARIO, STEPS.GRUPO_COMPONENTE, STEPS.GRUPO_REGENTE, STEPS.CRIAR_GRUPO].includes(nextStep)
    ) {
      animateTo(STEPS.REVISAR);
      return;
    }
    animateTo(nextStep);
  };
  const goBack = (prevStep) => animateTo(prevStep);

  // Step handlers
  const handleWelcomeNext = () => goNext(STEPS.NOME);

  const handleNomeNext = () => goNext(STEPS.EMAIL);

  const handleEmailNext = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setEmailError('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      const result = await checkEmailExists(data.email);
      if (result.exists) {
        setEmailError('Este email já está cadastrado no sistema.');
        return;
      }
    } catch (err) {
      console.log('Erro ao verificar email:', err);
    }

    setEmailError('');
    goNext(STEPS.VERIFICACAO);
  };

  const handleEmailVerified = () => {
    updateData({ emailVerificado: true });
    goNext(STEPS.VERIFICADO);
  };

  const handleVerificadoNext = () => goNext(STEPS.SENHA);

  const handleSenhaNext = () => goNext(STEPS.DATA_NASC);

  const handleDataNascNext = () => goNext(STEPS.TERMOS);

  const handleTermosAccept = () => {
    updateData({ aceitouTermos: true });
    goNext(STEPS.HINARIO);
  };

  const handleTermosDecline = () => {
    // Não faz nada — só "Sim" prossegue
  };

  const handleHinarioNext = () => goNext(STEPS.IGREJA);

  const handleIgrejaNext = () => goNext(STEPS.TIPO_USUARIO);

  const handleCreateChurch = () => {
    // Could navigate to a church creation screen
    // For now, just go to tipo_usuario
    goNext(STEPS.TIPO_USUARIO);
  };

  const handleTipoUsuarioNext = () => {
    const userType = (data.userType || '').toLowerCase();
    if (userType === 'regente') {
      goNext(STEPS.GRUPO_REGENTE);
    } else if (userType === 'componente') {
      goNext(STEPS.GRUPO_COMPONENTE);
    } else {
      // cantor or midia — skip grupo selection
      goNext(STEPS.NOTIFICACOES);
    }
  };

  const handleGrupoComponenteNext = () => {
    goNext(STEPS.NOTIFICACOES);
  };
  const handleGrupoRegenteNext = () => {
    goNext(STEPS.NOTIFICACOES);
  };

  const handleCreateGroup = () => goNext(STEPS.CRIAR_GRUPO);
  const handleCriarGrupoNext = () => {
    goNext(STEPS.NOTIFICACOES);
  };

  const handleNotificacoesNext = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de notificação negada.');
      }
    } catch (e) {
      console.log('Erro ao pedir permissão de notificação:', e.message);
    }
    goNext(STEPS.REVISAR);
  };

  const handleNotificacoesSkip = async () => {
    try {
      await Notifications.requestPermissionsAsync();
    } catch (e) {
      // ignora
    }
    goNext(STEPS.REVISAR);
  };

  const handleConfirm = async () => {
    try {
      // Mapeia o nome do hinário para a chave usada no app
      const hinarioMap = {
        'Harpa Cristã': 'HARPA',
        'Hinário CCB 5': 'CCB',
        'Cantor Cristão': 'CANTOR',
      };

      // Capitaliza tipo de usuário (ex: "componente" -> "Componente") pra combinar com o ENUM do MySQL
      const userTypeCapitalized = data.userType
        ? data.userType.charAt(0).toUpperCase() + data.userType.slice(1)
        : 'Componente';

      // Converte data para formato MySQL (YYYY-MM-DD)
      const birthDateISO = data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : null;

      const payload = {
        name: data.nome,
        email: data.email,
        password: data.password,
        birthDate: birthDateISO,
        typeUser: userTypeCapitalized,
        hinario: hinarioMap[data.hinario] || 'HARPA',
        igreja: data.igreja || data.igrejaCriada || '',
        grupo: data.grupo || data.nomeGrupo || '',
      };

      await registerUser(payload);

      // Salva preferência de hinário no contexto
      if (hinarioMap[data.hinario]) {
        await trocarHinario(hinarioMap[data.hinario]);
      }

      // Se é regente com dados de criação de grupo, cria o grupo via API
      if (userTypeCapitalized === 'Regente' && data.nomeGrupo && (data.localGrupo || data.igrejaGrupo) && data.tipoGrupo) {
        try {
          // O regenteId será preenchido após o login automático (handleFinish),
          // então guardamos os dados para criar depois
          updateData({ pendenteCriarGrupo: true });
        } catch (groupErr) {
          console.log('Erro ao criar grupo:', groupErr);
        }
      }

      goNext(STEPS.PRONTO);
    } catch (err) {
      console.log('Erro no cadastro:', err?.response?.data || err.message);
      Alert.alert(
        'Erro ao cadastrar',
        err?.response?.data?.error || 'Não foi possível concluir o cadastro. Tente novamente.'
      );
    }
  };

  const handleFinish = async () => {
    try {
      // Faz login automático via API
      const loginResponse = await userLogin({ email: data.email, password: data.password });
      const { token, id_user, userType, id_grupo } = loginResponse;
      let grupoId = id_grupo;

      // Se tem grupo pendente pra criar (regente), cria agora com o id_user
      if (data.pendenteCriarGrupo) {
        try {
          const tipoGrupo = data.tipoGrupo === 'Louvor' ? 'Louvor' : 'Musical';
          const local = data.localGrupo || data.igrejaGrupo || '';
          const grupoCriado = await createGrupo(data.nomeGrupo, local, tipoGrupo, id_user);
          grupoId = grupoCriado?.grupoId || grupoCriado?.id_grupo || grupoCriado?.id || null;
        } catch (groupErr) {
          console.log('Erro ao criar grupo após login:', groupErr);
        }
      }

      await login({ token, id_user, userType, id_grupo: grupoId });

      // Se um grupo foi criado/capturado após o login, atualiza o id_grupo no backend
      if (grupoId && !id_grupo) {
        try {
          await api.put(`/user/${id_user}/grupo`, { id_grupo: grupoId });
        } catch (updateErr) {
          console.log('Erro ao vincular usuário ao grupo:', updateErr);
        }
      }

      await completeOnboarding();
      if (onComplete) onComplete();
    } catch (err) {
      console.log('Erro no login automático:', err?.response?.data || err.message);
      Alert.alert('Erro', 'Não foi possível fazer login automático.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case STEPS.WELCOME:
        return <Welcome onNext={handleWelcomeNext} navigateTo={navigateTo} />;
      case STEPS.NOME:
        return (
          <CadastroNome
            value={data.nome}
            onChange={(v) => updateData({ nome: v })}
            onNext={handleNomeNext}
            onBack={() => goBack(STEPS.WELCOME)}
          />
        );
      case STEPS.EMAIL:
        return (
          <CadastroEmail
            value={data.email}
            error={emailError}
            onChange={(v) => {
              updateData({ email: v, emailVerificado: false });
              setEmailError('');
            }}
            onNext={handleEmailNext}
            onBack={() => goBack(STEPS.NOME)}
          />
        );
      case STEPS.VERIFICACAO:
        return (
          <VerificacaoEmail
            email={data.email}
            onVerified={handleEmailVerified}
            onBack={() => goBack(STEPS.EMAIL)}
          />
        );
      case STEPS.VERIFICADO:
        return (
          <VerificacaoSucesso onNext={handleVerificadoNext} />
        );
      case STEPS.SENHA:
        return (
          <CadastroSenha
            value={data.password}
            onChange={(v) => updateData({ password: v })}
            onNext={handleSenhaNext}
            onBack={() => goBack(STEPS.VERIFICADO)}
          />
        );
      case STEPS.DATA_NASC:
        return (
          <CadastroDataNasc
            value={data.birthDate}
            onChange={(v) => updateData({ birthDate: v })}
            onNext={handleDataNascNext}
            onBack={() => goBack(STEPS.SENHA)}
          />
        );
      case STEPS.TERMOS:
        return (
          <TermosCondicoes
            onAccept={handleTermosAccept}
            onDecline={handleTermosDecline}
            onBack={() => goBack(STEPS.DATA_NASC)}
          />
        );
      case STEPS.HINARIO:
        return (
          <SelecionarHinario
            value={data.hinario}
            onChange={(v) => updateData({ hinario: v })}
            onNext={handleHinarioNext}
            onBack={() => goBack(STEPS.TERMOS)}
          />
        );
      case STEPS.IGREJA:
        return (
          <SelecionarIgreja
            value={data.igreja}
            onChange={(v) => updateData({ igreja: v })}
            onCreateChurch={handleCreateChurch}
            onNext={handleIgrejaNext}
            onBack={() => goBack(STEPS.HINARIO)}
          />
        );
      case STEPS.TIPO_USUARIO:
        return (
          <TipoUsuario
            value={data.userType}
            onChange={(v) => updateData({ userType: v })}
            onNext={handleTipoUsuarioNext}
            onBack={() => goBack(STEPS.IGREJA)}
          />
        );
      case STEPS.GRUPO_COMPONENTE:
        return (
          <GrupoComponente
            value={data.grupoId}
            onChange={(id, nome) => updateData({ grupoId: id, grupo: nome })}
            onNext={handleGrupoComponenteNext}
            onBack={() => goBack(STEPS.TIPO_USUARIO)}
          />
        );
      case STEPS.GRUPO_REGENTE:
        return (
          <GrupoRegente
            value={data.grupoId}
            onChange={(id, nome) => updateData({ grupoId: id, grupo: nome })}
            onCreateGroup={handleCreateGroup}
            onNext={handleGrupoRegenteNext}
            onBack={() => goBack(STEPS.TIPO_USUARIO)}
          />
        );
      case STEPS.CRIAR_GRUPO:
        return (
          <CriarGrupo
            data={data}
            igrejas={igrejas}
            onChange={updateData}
            onNext={handleCriarGrupoNext}
            onBack={() => goBack(STEPS.GRUPO_REGENTE)}
          />
        );
      case STEPS.NOTIFICACOES:
        return (
          <Notificacoes
            onNext={handleNotificacoesNext}
            onSkip={handleNotificacoesSkip}
            onBack={() => {
              if (data.userType === 'regente') {
                goBack(data.nomeGrupo ? STEPS.CRIAR_GRUPO : STEPS.GRUPO_REGENTE);
              } else if (data.userType === 'componente') {
                goBack(STEPS.GRUPO_COMPONENTE);
              } else {
                goBack(STEPS.TIPO_USUARIO);
              }
            }}
          />
        );
      case STEPS.REVISAR:
        // Ativa modo revisão ao chegar na tela de revisão
        if (!isReviewing) setIsReviewing(true);
        return (
          <Revisar
            data={data}
            onConfirm={handleConfirm}
            onBack={() => {
              setIsReviewing(false);
              goBack(STEPS.NOTIFICACOES);
            }}
            onEditNome={() => goBack(STEPS.NOME)}
            onEditEmail={() => goBack(STEPS.EMAIL)}
            onEditSenha={() => goBack(STEPS.SENHA)}
            onEditDataNasc={() => goBack(STEPS.DATA_NASC)}
            onEditHinario={() => goBack(STEPS.HINARIO)}
            onEditIgreja={() => goBack(STEPS.IGREJA)}
            onEditTipoUsuario={() => goBack(STEPS.TIPO_USUARIO)}
            onEditGrupo={() => {
              if (data.userType === 'regente') {
                if (data.nomeGrupo) {
                  goBack(STEPS.CRIAR_GRUPO);
                } else {
                  goBack(STEPS.GRUPO_REGENTE);
                }
              } else {
                goBack(STEPS.GRUPO_COMPONENTE);
              }
            }}
          />
        );
      case STEPS.PRONTO:
        return <Pronto onFinish={handleFinish} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.stepContainer,
          {
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-width, 0, width],
                }),
              },
            ],
            opacity: slideAnim.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: [0, 1, 0],
            }),
          },
        ]}
      >
        {renderStep()}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stepContainer: {
    flex: 1,
  },
});
