import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useFonts, Nunito_500Medium, Nunito_400Regular } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { MaterialIcons } from '@expo/vector-icons';

const TIPOS_GRUPO = [
  'Grupo de Louvor',
  'Ministério de Música',
  'Coral',
  'Bandinha',
  'Orquestra',
  'Grupo de Jovens',
];

export default function CriarGrupo({ data, onChange, onNext, onBack }) {
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_400Regular,
    Poppins_700Bold,
  });

  if (!fontLoaded) return null;

  const isValid = data.nomeGrupo.trim() && data.localGrupo.trim() && data.tipoGrupo;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <MaterialIcons name="chevron-left" color="#FFCB69" size={28} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Criar Grupo</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome do Grupo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Grupo Jovem"
            placeholderTextColor="#aaa"
            value={data.nomeGrupo}
            onChangeText={(text) => onChange({ nomeGrupo: text })}
            autoFocus
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Local</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Igreja Central"
            placeholderTextColor="#aaa"
            value={data.localGrupo}
            onChangeText={(text) => onChange({ localGrupo: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo de grupo</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={data.tipoGrupo}
              onValueChange={(itemValue) =>
                onChange({ tipoGrupo: itemValue })
              }
              style={styles.picker}
            >
              <Picker.Item label="Selecione..." value="" color="#aaa" />
              {TIPOS_GRUPO.map((tipo) => (
                <Picker.Item key={tipo} label={tipo} value={tipo} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={() => onNext(data)}
        disabled={!isValid}
      >
        <Text style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}>
          Criar Grupo →
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
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
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
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#FFCB69',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#1a1a2e',
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
