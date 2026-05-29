import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFonts, Nunito_500Medium, Nunito_400Regular } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { MaterialIcons, Feather } from '@expo/vector-icons';

export default function CadastroDataNasc({ value, onChange, onNext, onBack }) {
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState('');

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_400Regular,
    Poppins_700Bold,
  });

  if (!fontLoaded) return null;

  const minAgeDate = new Date();
  minAgeDate.setFullYear(minAgeDate.getFullYear() - 16);

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate);
      // Validate age
      const age = new Date().getFullYear() - selectedDate.getFullYear();
      const monthDiff = new Date().getMonth() - selectedDate.getMonth();
      const actualAge =
        monthDiff < 0 || (monthDiff === 0 && new Date().getDate() < selectedDate.getDate())
          ? age - 1
          : age;
      if (actualAge < 16) {
        setError('Você precisa ter pelo menos 16 anos.');
      } else {
        setError('');
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isValid = value && !error;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <MaterialIcons name="chevron-left" color="#FFCB69" size={28} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Qual sua data de{'\n'}nascimento?</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data de nascimento</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowPicker(true)}
          >
            <Feather name="calendar" color={value ? '#FFCB69' : '#aaa'} size={20} />
            <Text style={[styles.dateText, !value && styles.datePlaceholder]}>
              {value ? formatDate(value) : 'Selecione a data'}
            </Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {showPicker && (
          <DateTimePicker
            value={value || new Date()}
            mode="date"
            display="spinner"
            maximumDate={minAgeDate}
            onChange={handleDateChange}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, (!isValid) && styles.buttonDisabled]}
        onPress={onNext}
        disabled={!isValid}
      >
        <Text style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}>
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FFCB69',
    paddingVertical: 10,
    gap: 10,
  },
  dateText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#1a1a2e',
  },
  datePlaceholder: {
    color: '#aaa',
  },
  error: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: '#e74c3c',
    marginTop: 8,
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
