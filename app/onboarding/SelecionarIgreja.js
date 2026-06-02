import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFonts, Nunito_500Medium, Nunito_400Regular } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { MaterialIcons, Feather } from '@expo/vector-icons';

export default function SelecionarIgreja({ value, onChange, onNext, onBack }) {
  const [search, setSearch] = useState('');
  const [igrejas, setIgrejas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_400Regular,
    Poppins_700Bold,
  });

  useEffect(() => {
    (async () => {
      try {
        const { listarIgrejas } = await import('../../src/api/api');
        const data = await listarIgrejas();
        setIgrejas(data);
      } catch (err) {
        console.log('Erro ao carregar igrejas:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!fontLoaded) return null;

  const filtered = igrejas.filter((ig) =>
    ig.toLowerCase().includes(search.toLowerCase())
  );

  const handleNext = () => {
    if (!value) {
      setError('Selecione ou digite sua igreja.');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <MaterialIcons name="chevron-left" color="#FFCB69" size={28} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Qual é a sua igreja?</Text>

        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="Digite ou selecione sua igreja"
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={(text) => {
            onChange(text);
            setError('');
          }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator color="#FFCB69" size="large" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item, index) => String(index)}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.listItem,
                  value === item && styles.listItemSelected,
                ]}
                onPress={() => onChange(item)}
              >
                <Feather name="crosshair" color={value === item ? '#FFCB69' : '#999'} size={18} />
                <Text style={[styles.listItemText, value === item && styles.listItemTextSelected]}>
                  {item}
                </Text>
                {value === item && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma igreja encontrada</Text>
            }
          />
        )}

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Próximo</Text>          
        </TouchableOpacity>
      </View>
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
    marginBottom: 16,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: '#e74c3c',
    marginTop: -12,
    marginBottom: 12,
  },
  list: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 4,
    gap: 12,
  },
  listItemSelected: {
    backgroundColor: '#FFF9ED',
  },
  listItemText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  listItemTextSelected: {
    color: '#FFCB69',
    fontFamily: 'Poppins_700Bold',
  },
  checkIcon: {
    color: '#FFCB69',
    fontSize: 18,
    fontFamily: 'Nunito_500Medium',
  },
  emptyText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
  },
  nextButton: {
    backgroundColor: '#FFCB69',
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 30,
  },
  nextButtonText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#fff',
  },
});
