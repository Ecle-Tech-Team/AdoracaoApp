import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useFonts, Nunito_500Medium, Nunito_400Regular } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { MaterialIcons } from '@expo/vector-icons';

const HINARIOS = ['Harpa Cristã', 'Hinário CCB 5', 'Cantor Cristão'];

export default function SelecionarHinario({ value, onChange, onNext, onBack }) {
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_400Regular,
    Poppins_700Bold,
  });

  if (!fontLoaded) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <MaterialIcons name="chevron-left" color="#FFCB69" size={28} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Selecione seu hinário</Text>
        <Text style={styles.subtitle}>
          Escolha o hinário que você utiliza em sua igreja.
        </Text>

        <View style={styles.optionsContainer}>
          {HINARIOS.map((hinario) => (
            <TouchableOpacity
              key={hinario}
              style={[
                styles.option,
                value === hinario && styles.optionSelected,
              ]}
              onPress={() => onChange(hinario)}
            >
              <Text
                style={[
                  styles.optionText,
                  value === hinario && styles.optionTextSelected,
                ]}
              >
                {hinario}
              </Text>
              {value === hinario && (
                <View style={styles.checkCircle}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, !value && styles.buttonDisabled]}
        onPress={onNext}
        disabled={!value}
      >
        <Text style={[styles.buttonText, !value && styles.buttonTextDisabled]}>
          Próximo
        </Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  optionSelected: {
    borderColor: '#FFCB69',
    backgroundColor: '#FFFAE8',
  },
  optionText: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#FFCB69',
    fontFamily: 'Poppins_700Bold',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFCB69',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
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
