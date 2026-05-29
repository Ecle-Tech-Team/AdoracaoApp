import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import { useFonts, Nunito_500Medium, Nunito_400Regular } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';

const IGREJAS_SUGESTAO = [
  'Igreja Evangélica Assembleia de Deus',
  'Igreja Batista',
  'Igreja Presbiteriana',
  'Igreja Católica',
  'Igreja do Evangelho Quadrangular',
  'Igreja Universal do Reino de Deus',
  'Igreja Adventista do Sétimo Dia',
  'Igreja Luterana',
  'Igreja Metodista',
  'Igreja Congregacional',
  'Comunidade Cristã',
  'Ministério Internacional',
];

export default function SelecionarIgreja({ value, onChange, onCreateChurch, onNext, onBack }) {
  const [search, setSearch] = useState('');
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_400Regular,
    Poppins_700Bold,
  });

  if (!fontLoaded) return null;

  const filtered = IGREJAS_SUGESTAO.filter((igreja) =>
    igreja.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <MaterialIcons name="chevron-left" color="#FFCB69" size={28} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>
          Qual igreja você está{' '}
          congregando?
        </Text>

        <View style={styles.searchContainer}>
          <Feather name="search" color="#aaa" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar igreja..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item}
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
              <FontAwesome
                name="bank"
                color={value === item ? '#FFCB69' : '#999'}
                size={20}
              />
              <Text
                style={[
                  styles.listItemText,
                  value === item && styles.listItemTextSelected,
                ]}
              >
                {item}
              </Text>
              {value === item && (
                <Text style={styles.checkIcon}>✓</Text>
              )}
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity style={styles.createButton} onPress={onCreateChurch}>
          <Feather name="plus" color="#FFCB69" size={20} />
          <Text style={styles.createButtonText}>
            Sua igreja não está aqui? Criar igreja
          </Text>
        </TouchableOpacity>
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
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: '#1a1a2e',
    marginBottom: 24,
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: '#1a1a2e',
    paddingVertical: 12,
  },
  list: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 4,
    gap: 12,
  },
  listItemSelected: {
    backgroundColor: '#FFFAE8',
  },
  listItemText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  listItemTextSelected: {
    color: '#FFCB69',
    fontFamily: 'Nunito_500Medium',
  },
  checkIcon: {
    color: '#FFCB69',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 8,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  createButtonText: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 14,
    color: '#FFCB69',
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
