import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import { useFonts, Nunito_500Medium, Nunito_400Regular } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { MaterialIcons } from '@expo/vector-icons';

export default function Revisar({ data, onConfirm, onBack }) {
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_400Regular,
    Poppins_700Bold,
  });

  if (!fontLoaded) return null;

  const formatDate = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const maskPassword = (pwd) => {
    if (!pwd) return '—';
    return '•'.repeat(Math.min(pwd.length, 12));
  };

  const items = [
    { label: 'Nome', value: data.nome || '—' },
    { label: 'E-mail', value: data.email || '—' },
    { label: 'Data de nascimento', value: formatDate(data.birthDate) },
    { label: 'Senha', value: maskPassword(data.password) },
    { label: 'Igreja', value: data.igreja || data.igrejaCriada || '—' },
    { label: 'Grupo', value: data.grupo || data.nomeGrupo || '—' },
    { label: 'Hinário', value: data.hinario || '—' },
    { label: 'Tipo de usuário', value: getUserTypeLabel(data.userType) },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <MaterialIcons name="chevron-left" color="#FFCB69" size={28} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Estamos quase lá!</Text>
        <Text style={styles.subtitle}>
          Revise suas informações antes de finalizar.
        </Text>

        <ScrollView style={styles.reviewScroll} showsVerticalScrollIndicator={false}>
          {items.map((item, index) => (
            <View key={index} style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>{item.label}</Text>
              <Text style={styles.reviewValue}>{item.value}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.button} onPress={onConfirm}>
        <Text style={styles.buttonText}>Confirmar →</Text>
      </TouchableOpacity>
    </View>
  );
}

function getUserTypeLabel(key) {
  const labels = {
    cantor: 'Apenas canto',
    componente: 'Faço parte de um grupo de louvor',
    regente: 'Lidero um grupo de louvor',
    midia: 'Faço parte da mídia da igreja',
  };
  return labels[key] || key || '—';
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
    marginBottom: 24,
  },
  reviewScroll: {
    flex: 1,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reviewLabel: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 14,
    color: '#888',
  },
  reviewValue: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 14,
    color: '#1a1a2e',
    maxWidth: '55%',
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#FFCB69',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#fff',
  },
});
