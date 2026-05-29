import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useContext } from "react";
import { useFonts, Nunito_500Medium, Nunito_400Regular } from "@expo-google-fonts/nunito";
import { Poppins_700Bold } from "@expo-google-fonts/poppins";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../src/contexts/AuthContext";
import { userLogin } from "../../src/api/api";
import { registerForPushNotifications } from "../../src/services/notificationService";

export default function Login({ navigateTo }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_400Regular,
    Poppins_700Bold,
  });

  if (!fontLoaded) return null;

  const isValid = email.length > 0 && password.length > 0;

  const handleLogin = async () => {
    if (!isValid) return;

    try {
      const response = await userLogin({ email, password });
      const { token, id_user, userType, id_grupo } = response;

      if (token && id_user && userType) {
        try {
          await registerForPushNotifications(id_user);
        } catch (pushError) {
          console.warn("Erro ao registrar push notification:", pushError);
        }

        login({
          token,
          id_user,
          userType,
          id_grupo: id_grupo || null,
        });

        navigateTo("Dashboard");
      } else {
        Alert.alert("Erro", "Token ou tipo de usuário ausente. Verifique as credenciais.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao fazer login. Verifique as credenciais.");
      console.error("Erro de login:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>A paz do Senhor!</Text>
          <Text style={styles.subtitle}>Seja Bem-vindo!</Text>
          <Text style={styles.description}>
            Insira suas informações abaixo para entrar na sua conta!
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Escreva aqui..."
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Escreva aqui..."
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={22}
                color="#BFBFBF"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!isValid}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}>
            Entrar
          </Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Não tem conta? </Text>
          <TouchableOpacity onPress={() => navigateTo("Onboarding")}>
            <Text style={styles.span}>Crie uma Conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 14,
    color: '#BFBFBF',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 36,
    color: '#1a1a2e',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#BFBFBF',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 14,
    color: '#BFBFBF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFAE8',
    borderWidth: 2,
    borderColor: '#FFCB69',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Nunito_500Medium',
    fontSize: 15,
    color: '#1a1a2e',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFAE8',
    borderWidth: 2,
    borderColor: '#FFCB69',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Nunito_500Medium',
    fontSize: 15,
    color: '#1a1a2e',
  },
  eyeButton: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  button: {
    backgroundColor: '#FFCB69',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#fff',
  },
  buttonTextDisabled: {
    color: '#fff',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 14,
    color: '#BFBFBF',
  },
  span: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: '#FFCB69',
  },
});
