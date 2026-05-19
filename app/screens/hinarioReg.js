import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Alert, Modal } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchHinarioGrupo, removeHinoFromGrupo, updateHinoTag } from '../../src/api/api';
import { AuthContext } from '../../src/contexts/AuthContext';

const TAGS = ['Ceia', 'Missões', 'Família', 'Batismo', 'Natal', 'Páscoa'];

export default function HinarioReg({ navigateTo }) {
  const { id_grupo } = useContext(AuthContext);
  const [hinosGrupo, setHinosGrupo] = useState([]);
  const [filteredHinos, setFilteredHinos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [selectedHino, setSelectedHino] = useState(null);

  useEffect(() => {
    const getHinario = async () => {
      try {
        const data = await fetchHinarioGrupo(id_grupo);
        const safeData = Array.isArray(data) ? data : [];
        setHinosGrupo(safeData);
        setFilteredHinos(safeData);
      } catch (error) {
        console.error('Erro ao obter hinos:', error);
        setHinosGrupo([]);
        setFilteredHinos([]);
      }
    };

    if (id_grupo) {
      getHinario();
    }
  }, [id_grupo]);

  const handleRemoveHino = async (id_hino) => {
    try {
      await removeHinoFromGrupo(id_grupo, id_hino);
      Alert.alert('Sucesso', 'Hino removido do grupo com sucesso!');

      const updated = hinosGrupo.filter(hino => hino._id !== id_hino);
      setHinosGrupo(updated);
      setFilteredHinos(updated);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao remover hino do grupo.');
      console.error(error);
    }
  };

  const handleOpenModal = (hino) => {
    setSelectedHino(hino);
    setModalVisible(true);
  };

  const handleOpenTagModal = () => {
    setModalVisible(false);
    setTagModalVisible(true);
  };

  const handleSelectTag = async (tag) => {
    try {
      await updateHinoTag(id_grupo, selectedHino._id, tag);

      const updated = hinosGrupo.map(hino =>
        hino._id === selectedHino._id ? { ...hino, tag } : hino
      );
      setHinosGrupo(updated);
      setFilteredHinos(updated);
      setTagModalVisible(false);
      setSelectedHino(null);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar tag do hino.');
      console.error(error);
    }
  };

  const handleRemoveTag = async () => {
    try {
      await updateHinoTag(id_grupo, selectedHino._id, null);

      const updated = hinosGrupo.map(hino =>
        hino._id === selectedHino._id ? { ...hino, tag: null } : hino
      );
      setHinosGrupo(updated);
      setFilteredHinos(updated);
      setTagModalVisible(false);
      setSelectedHino(null);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao remover tag do hino.');
      console.error(error);
    }
  };

  const removeAccents = (str) => {
    return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
  };

  useEffect(() => {
    const filtered = hinosGrupo.filter(hino =>
      removeAccents(hino?.titulo?.toLowerCase() || '')
        .includes(removeAccents(searchText.toLowerCase()))
    );

    setFilteredHinos(filtered);
  }, [searchText, hinosGrupo]);

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_700Bold,
    Poppins_600SemiBold
  })

  if (!fontLoaded) {
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigateTo('GrupoReg')}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>

        <Text style={{paddingLeft: 15, ...styles.h2}}>Hinário</Text>

        <TouchableOpacity onPress={() => navigateTo('AdicionarHino')}>
          <Text style={{...styles.backButton, ...styles.btn}}>+</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="&#x1F50D; Buscar hino..."
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />

      <View style={styles.listContainer}>
        {filteredHinos.length > 0 ? (
          filteredHinos.map((hino) => (
            <View key={hino.numero || hino._id} style={styles.hinoItemWrapper}>
              <TouchableOpacity
                style={styles.hinoItem}
                onPress={() => navigateTo('HinarioGrupo', hino)}
                activeOpacity={0.7}
              >
                <View style={styles.hinoTextContainer}>
                  <Text style={styles.hinoTitle}>{hino.titulo}</Text>
                  <View style={styles.hinoMetaRow}>
                    <Text style={styles.hinoAutor}>{hino.autor}</Text>
                    {hino.tag ? (
                      <View style={styles.tagBadge}>
                        <Text style={styles.tagBadgeText}>{hino.tag}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                <TouchableOpacity onPress={() => handleOpenModal(hino)} style={styles.menuButton}>
                  <Text style={styles.menuButtonText}>...</Text>
                </TouchableOpacity>
              </TouchableOpacity>

            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum hino encontrado.</Text>
        )}
      </View>

      {/* Modal de opções */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedHino?.titulo}</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleOpenTagModal}
            >
              <Text style={styles.modalOptionIcon}>🏷️</Text>
              <Text style={styles.modalOptionText}>
                {selectedHino?.tag ? `Alterar Categoria (${selectedHino.tag})` : 'Adicionar Categoria'}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                setSelectedHino(null);
              }}
            >
              <Text style={styles.modalOptionIcon}>📋</Text>
              <Text style={styles.modalOptionText}>Ver Detalhes</Text>
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            <TouchableOpacity
              style={[styles.modalOption, styles.modalOptionRemove]}
              onPress={() => {
                setModalVisible(false);
                Alert.alert(
                  'Remover Hino',
                  `Tem certeza que deseja remover "${selectedHino?.titulo}" do grupo?`,
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Remover',
                      style: 'destructive',
                      onPress: () => handleRemoveHino(selectedHino._id)
                    },
                  ]
                );
              }}
            >
              <Text style={styles.modalOptionIcon}>🗑️</Text>
              <Text style={[styles.modalOptionText, { color: '#FF4242' }]}>Remover do Grupo</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de seleção de tag */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={tagModalVisible}
        onRequestClose={() => setTagModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTagModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Categoria</Text>

            {TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagOption,
                  selectedHino?.tag === tag && styles.tagOptionSelected
                ]}
                onPress={() => handleSelectTag(tag)}
              >
                <Text style={[
                  styles.tagOptionText,
                  selectedHino?.tag === tag && styles.tagOptionTextSelected
                ]}>{tag}</Text>
                {selectedHino?.tag === tag && (
                  <Text style={styles.tagCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            {selectedHino?.tag && (
              <>
                <View style={styles.modalDivider} />
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleRemoveTag}
                >
                  <Text style={[styles.modalOptionText, { color: '#FF4242' }]}>Remover Categoria</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 15
  },
  searchBar: {
    padding: 18,
    backgroundColor: '#FFFAE1',
    borderWidth: 2,
    borderColor: '#FFCB69',
    fontFamily: 'Poppins_600SemiBold',
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 12,
    color: '#BA9D36'
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  hinoItemWrapper: {
    marginBottom: 12,
    position: 'relative',
  },
  hinoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 10,
    backgroundColor: '#FFFAE1',
  },
  hinoTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  hinoTitle: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#BA9D36',
    fontSize: 16,
  },
  hinoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hinoAutor: {
    fontFamily: 'Nunito_500Medium',
    color: '#A68B2E',
    fontSize: 13,
  },
  tagBadge: {
    backgroundColor: '#FFCB69',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  tagBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Poppins_600SemiBold',
  },
  titleContainer: {
    paddingVertical: 10,
    paddingLeft: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  backButton: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#FFCB69',
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5
  },
  btn: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    left: 195
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    paddingLeft: 10,
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#A68B2E',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: '80%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  modalOptionRemove: {
    borderRadius: 10,
  },
  modalOptionIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  modalOptionText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 8,
  },
  // Tag selection modal
  tagOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: '#FFFAE1',
  },
  tagOptionSelected: {
    backgroundColor: '#FFCB69',
  },
  tagOptionText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#BA9D36',
  },
  tagOptionTextSelected: {
    color: '#fff',
  },
  tagCheck: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
})
