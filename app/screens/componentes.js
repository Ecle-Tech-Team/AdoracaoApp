import { StyleSheet, Text, View, Image, TextInput, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchComponentes } from '../../src/api/api';
import { AuthContext } from '../../src/contexts/AuthContext';
import Feather from '@expo/vector-icons/Feather';

export default function Componentes({ navigateTo }) {
  const { id_grupo } = useContext(AuthContext);
  const [componentes, setComponentes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComponente, setSelectedComponente] = useState(null);

  useEffect(() => {
    const loadComponentes = async () => {
      try {
        const data = await fetchComponentes(id_grupo);
        setComponentes(data);
      } catch (error) {
        console.error('Erro ao carregar usuários para componentes:', error);
      }
    };

    loadComponentes();
  }, [id_grupo]);

  const handleRemove = async (id_usuario) => {
    try {
      const response = await fetch(`https://api.adoracaoapp.com.br/user/removeComponente/${id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo_usuario: 'Adorador',
          id_grupo: null,
        }),
      });

      if (response.ok) {
        setComponentes(prevState => prevState.filter(comp => comp.id_usuario !== id_usuario));
      } else {
        console.error('Erro ao remover componente');
      }
    } catch (error) {
      console.error('Erro ao remover componente:', error);
    }
  };

  const handleOpenModal = (componente) => {
    setSelectedComponente(componente);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedComponente(null);
  };

  const confirmRemoveComponente = () => {
    Alert.alert(
      'Confirmar',
      `Deseja remover o componente "${selectedComponente?.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            handleRemove(selectedComponente?.id_usuario);
            handleCloseModal();
          },
        },
      ]
    );
  };

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_700Bold,
    Poppins_600SemiBold
  });

  if (!fontLoaded) {
    return null;
  }

  const filteredComponentes = searchText
    ? componentes.filter(c => c.nome.toLowerCase().includes(searchText.toLowerCase()))
    : componentes;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigateTo('GrupoReg')}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>

        <Text style={{ paddingLeft: 15, ...styles.h2 }}>Componentes</Text>

        <TouchableOpacity onPress={() => navigateTo('AdicionarComp')}>
          <Text style={styles.backButton}>+</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Buscar componente..."
        placeholderTextColor="#64A95F"
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />

      <FlatList
        data={filteredComponentes}
        keyExtractor={(item) => item.id_usuario.toString()}
        renderItem={({ item }) => (
          <View style={styles.lista}>
            <View style={styles.componenteItem}>
              <View style={styles.componenteTitleView}>
                <Text style={{ ...styles.componenteTitle, fontSize: 18 }}>{item.nome}</Text>
                <TouchableOpacity onPress={() => handleOpenModal(item)} style={styles.menuButton}>
                  <Text style={styles.menuButtonText}>...</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.componenteText}>{item.tipo_usuario}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleCloseModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedComponente?.nome}</Text>
            <View style={styles.modalDivider} />
            <TouchableOpacity style={styles.modalOption} onPress={confirmRemoveComponente}>
              <Feather style={styles.modalOptionIcon} name="trash-2" size={24} />
              <Text style={styles.modalOptionText}>Remover Componente</Text>
            </TouchableOpacity>
            <View style={styles.modalDivider} />
            <TouchableOpacity style={styles.modalOption} onPress={handleCloseModal}>
              <Feather style={styles.modalOptionIcon} name="corner-left-down" size={24} />
              <Text style={styles.modalOptionText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    flex: 1,
  },
  titleContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#64A95F',
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  searchBar: {
    padding: 16,
    backgroundColor: '#E2FFE3',
    borderWidth: 2,
    borderColor: '#64A95F',
    fontFamily: 'Poppins_600SemiBold',
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 12,
    color: '#64A95F',
  },
  componenteTitleView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  componenteTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#64A95F',
    marginBottom: 5,
  },
  componenteItem: {
    padding: 12,
    backgroundColor: '#E2FFE3',
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  componenteText: {
    fontSize: 15,
    fontFamily: 'Nunito_500Medium',
    color: '#64A95F',
    marginBottom: 5,
  },
  lista: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  menuButton: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#64A95F',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    width: '80%',
    paddingVertical: 20,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
    marginVertical: 3,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
  },
  modalOptionIcon: {
    width: 24,
    height: 24,
    marginRight: 14,
    color: '#64A95F',
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
});
