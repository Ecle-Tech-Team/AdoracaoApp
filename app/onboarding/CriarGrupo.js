import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useFonts, Nunito_500Medium, Nunito_400Regular } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { MaterialIcons, Feather } from '@expo/vector-icons';

const TIPOS_GRUPO = [
  { label: 'Grupo de Louvor', value: 'Grupo de Louvor' },
  { label: 'Ministério de Música', value: 'Ministério de Música' },
  { label: 'Coral', value: 'Coral' },
  { label: 'Bandinha', value: 'Bandinha' },
  { label: 'Orquestra', value: 'Orquestra' },
  { label: 'Grupo de Jovens', value: 'Grupo de Jovens' },
];

export default function CriarGrupo({ data, igrejas, onChange, onNext, onBack }) {
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_400Regular,
    Poppins_700Bold,
  });

  if (!fontLoaded) return null;

  const nome = data.nomeGrupo || '';
  const local = data.localGrupo || '';
  const tipo = data.tipoGrupo || '';
  const igreja = data.igrejaGrupo || '';

  const isValid = nome.trim() && tipo;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <MaterialIcons name="chevron-left" color="#FFCB69" size={28} />
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Criar Grupo</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome do Grupo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Grupo Jovem"
            placeholderTextColor="#aaa"
            value={nome}
            onChangeText={(text) => onChange({ nomeGrupo: text })}
            autoFocus
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Local</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Sala 2"
            placeholderTextColor="#aaa"
            value={local}
            onChangeText={(text) => onChange({ localGrupo: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo do Grupo *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={tipo}
              onValueChange={(itemValue) => onChange({ tipoGrupo: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Selecione um tipo..." value="" color="#999" />
              {TIPOS_GRUPO.map((t) => (
                <Picker.Item key={t.value} label={t.label} value={t.value} />
              ))}
            </Picker>
          </View>
        </View>

        {igrejas && igrejas.length > 0 && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Igreja (opcional)</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={igreja}
                onValueChange={(itemValue) => onChange({ igrejaGrupo: itemValue })}
                style={styles.picker}
              >
                <Picker.Item label="Nenhuma" value="" color="#999" />
                {igrejas.map((ig, index) => (
                  <Picker.Item key={index} label={ig} value={ig} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
          onPress={isValid ? onNext : null}
          disabled={!isValid}
        >
          <Text style={[styles.nextButtonText, !isValid && styles.nextButtonTextDisabled]}>
            Continuar
          </Text>          
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  backButton: {
    paddingHorizontal: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#1a1a1a',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#FFCB69',
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
    marginBottom: 40,
  },
  nextButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  nextButtonText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#fff',
  },
  nextButtonTextDisabled: {
    color: '#999',
  },
});
