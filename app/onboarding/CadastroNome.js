import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React from 'react';
import { useFonts, Nunito_500Medium, Nunito_400Regular } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { MaterialIcons } from '@expo/vector-icons';

export default function CadastroNome({ value, onChange, onNext, onBack }) {
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_400Regular,
    Poppins_700Bold,
  });

  if (!fontLoaded) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <MaterialIcons name="chevron-left" color="#FFCB69" size={28} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Qual é o seu nome?</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Escreva aqui..."
            placeholderTextColor="#aaa"
            value={value}
            onChangeText={onChange}
            autoFocus
          />
        </View>

        <Text style={styles.disclaimer}>
          Ao continuar, você concorda com nossos{' '}
          <Text style={styles.disclaimerLink}>Termos de Uso</Text> e{' '}
          <Text style={styles.disclaimerLink}>Política de Privacidade</Text>.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !value.trim() && styles.buttonDisabled]}
        onPress={onNext}
        disabled={!value.trim()}
      >
        <Text style={[styles.buttonText, !value.trim() && styles.buttonTextDisabled]}>
          Próximo
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
    justifyContent: 'space-between',
    paddingBottom: 40,
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
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#1a1a2e',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFCB69',
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#1a1a2e',
    paddingVertical: 8,
  },
  disclaimer: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: '#999',
    lineHeight: 18,
    marginTop: 8,
  },
  disclaimerLink: {
    color: '#FFCB69',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#FFCB69',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#f0ebd0',
  },
  buttonText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#fff',
  },
  buttonTextDisabled: {
    color: '#d4cca0',
  },
});
