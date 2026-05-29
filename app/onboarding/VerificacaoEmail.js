import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useFonts, Nunito_500Medium, Nunito_400Regular } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { sendVerificationCode, verifyEmailCode } from '../../src/services/emailService';

export default function VerificacaoEmail({ email, onVerified, onBack }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(true);
  const inputsRef = useRef([]);

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_400Regular,
    Poppins_700Bold,
  });

  useEffect(() => {
    sendCode();
  }, []);

  const sendCode = async () => {
    setSending(true);
    try {
      await sendVerificationCode(email);
    } catch (err) {
      console.log('Erro ao enviar código:', err?.message, err?.response?.data);
    }
    setSending(false);
  };

  if (!fontLoaded) return null;

  const handleCodeChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError('');

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newCode.every((d) => d !== '') && index === 5) {
      verifyCode(newCode);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const verifyCode = async (codeArray) => {
    const entered = codeArray.join('');
    setVerifying(true);
    setError('');

    try {
      await verifyEmailCode(email, entered);
      onVerified();
    } catch (err) {
      const message =
        err?.response?.data?.message || 'Código inválido. Tente novamente.';
      setError(message);
      setCode(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    }
    setVerifying(false);
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await sendCode();
    } catch {
      // fallback
    }
    setResending(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <MaterialIcons name="chevron-left" color="#FFCB69" size={28} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="mail" color="#FFCB69" size={48} />
        </View>

        <Text style={styles.title}>Verifique seu e-mail</Text>
        <Text style={styles.description}>
          Enviamos um código de verificação para{' '}
          <Text style={styles.email}>{email}</Text>
        </Text>
        <Text style={styles.instruction}>
          Digite o código de 6 dígitos enviado para seu e-mail.
        </Text>

        {sending ? (
          <View style={styles.sendingContainer}>
            <ActivityIndicator color="#FFCB69" size="large" />
            <Text style={styles.sendingText}>Enviando código...</Text>
          </View>
        ) : (
          <>
            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputsRef.current[index] = ref)}
                  style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  editable={!verifying}
                />
              ))}
            </View>

            {verifying && (
              <ActivityIndicator color="#FFCB69" size="small" style={{ marginBottom: 16 }} />
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResend}
              disabled={resending}
            >
              {resending ? (
                <ActivityIndicator color="#FFCB69" size="small" />
              ) : (
                <Text style={styles.resendText}>Reenviar código</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFAE8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: '#1a1a2e',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  email: {
    fontFamily: 'Nunito_500Medium',
    color: '#1a1a2e',
  },
  instruction: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginBottom: 32,
  },
  sendingContainer: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  sendingText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#999',
  },
  codeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  codeInput: {
    width: 46,
    height: 56,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: '#1a1a2e',
  },
  codeInputFilled: {
    borderColor: '#FFCB69',
  },
  error: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: '#e74c3c',
    marginBottom: 16,
  },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  resendText: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 14,
    color: '#FFCB69',
    textDecorationLine: 'underline',
  },
});
