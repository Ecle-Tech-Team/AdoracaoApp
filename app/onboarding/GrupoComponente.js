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
import { getAllGrupos } from '../../src/api/api';

export default function GrupoComponente({ value, onChange, onNext, onBack }) {
  const [search, setSearch] = useState('');
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_400Regular,
    Poppins_700Bold,
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllGrupos();
        setGrupos(data);
      } catch (err) {
        console.log('Erro ao carregar grupos:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!fontLoaded) return null;

  const filtered = grupos.filter((g) =>
    g.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (grupo) => {
    onChange(grupo.id, grupo.nome);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <MaterialIcons name="chevron-left" color="#FFCB69" size={28} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>
          Qual é o grupo que você{'\n'}faz parte?
        </Text>

        <View style={styles.searchContainer}>
          <Feather name="search" color="#aaa" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar grupo..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
        </View>

        {loading ? (
          <ActivityIndicator color="#FFCB69" size="large" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.listItem,
                  value === item.id && styles.listItemSelected,
                ]}
                onPress={() => handleSelect(item)}
              >
                <Feather name="users"
                  color={value === item.id ? '#FFCB69' : '#999'}
                  size={20}
                />
                <View style={styles.listItemInfo}>
                  <Text
                    style={[
                      styles.listItemText,
                      value === item.id && styles.listItemTextSelected,
                    ]}
                  >
                    {item.nome}
                  </Text>
                  <Text style={styles.listItemLocal}>{item.local}</Text>
                </View>
                {value === item.id && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Nenhum grupo encontrado
              </Text>
            }
          />
        )}
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
  listItemInfo: {
    flex: 1,
  },
  listItemText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  listItemLocal: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: '#999',
    marginTop: 2,
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
  emptyText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 32,
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
