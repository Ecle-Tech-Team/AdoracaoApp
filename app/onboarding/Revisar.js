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
import { MaterialIcons, Feather } from '@expo/vector-icons';

export default function Revisar({
  data,
  onConfirm,
  onBack,
  onEditNome,
  onEditEmail,
  onEditSenha,
  onEditDataNasc,
  onEditHinario,
  onEditIgreja,
  onEditTipoUsuario,
  onEditGrupo,
}) {
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_400Regular,
    Poppins_700Bold,
  });

  if (!fontLoaded) return null;

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fields = [
    {
      label: 'Nome',
      value: data.nome,
      icon: 'user',
      onEdit: onEditNome,
    },
    {
      label: 'E-mail',
      value: data.email,
      icon: 'mail',
      onEdit: onEditEmail,
    },
    {
      label: 'Senha',
      value: data.password ? '••••••••' : '',
      icon: 'lock',
      onEdit: onEditSenha,
    },
    {
      label: 'Data de Nascimento',
      value: formatDate(data.birthDate || data.dataNasc),
      icon: 'calendar',
      onEdit: onEditDataNasc,
    },
    {
      label: 'Hinário',
      value: data.hinario,
      icon: 'book',
      onEdit: onEditHinario,
    },
    {
      label: 'Igreja',
      value: data.igreja,
      icon: 'crosshair',
      onEdit: onEditIgreja,
    },
    {
      label: 'Tipo de Usuário',
      value: data.userType ? data.userType.charAt(0).toUpperCase() + data.userType.slice(1) : '',
      icon: 'users',
      onEdit: onEditTipoUsuario,
    },
    {
      label: 'Grupo',
      value: data.grupo || data.nomeGrupo,
      icon: 'mic',
      onEdit: onEditGrupo,
    },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <MaterialIcons name="chevron-left" color="#FFCB69" size={28} />
      </TouchableOpacity>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Revise seus dados</Text>
        <Text style={styles.subtitle}>
          Confira se tudo está correto antes de finalizar
        </Text>

        <View style={styles.card}>
          {fields.map((field, index) => {
            if (!field.value) return null;
            return (
              <View key={field.label}>
                <View style={styles.fieldRow}>
                  <Feather name={field.icon} color="#FFCB69" size={18} />
                  <View style={styles.fieldContent}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <Text style={styles.fieldValue}>{field.value}</Text>
                  </View>
                  {field.onEdit && (
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={field.onEdit}
                    >
                      <Feather name="edit-2" color="#FFCB69" size={16} />
                    </TouchableOpacity>
                  )}
                </View>
                {index < fields.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmButtonText}>Confirmar e Finalizar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
  confirmButton: {
    backgroundColor: '#FFCB69',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 40,
  },
  confirmButtonText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#fff',
  },
});
