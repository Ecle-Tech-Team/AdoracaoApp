import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchEnsaiosDoGrupo, removeEnsaio } from '../../src/api/api';
import { AuthContext } from '../../src/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Feather from '@expo/vector-icons/Feather';

export default function EnsaiosReg({ navigateTo }) {
  const { id_grupo } = useContext(AuthContext); 
  const [ensaios, setEnsaios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEnsaio, setSelectedEnsaio] = useState(null);
  const [hinosDisponiveis, setHinosDisponiveis] = useState([]);

  useEffect(() => {
    const loadEnsaios = async () => {
      try {
        const data = await fetchEnsaiosDoGrupo(id_grupo);
        setEnsaios(data);
      } catch (error) {
        console.error('Erro ao carregar ensaios:', error);
      }
    };    

    loadEnsaios();    
  }, [id_grupo]);

  const handleRemoveEnsaio = async (id) => {
    try {
      await removeEnsaio(id);
      Alert.alert('Sucesso', 'Ensaio deletado com sucesso!');
      setEnsaios((prevEnsaios) => prevEnsaios.filter((ensaio) => ensaio.id !== id));
    } catch (error) {
      Alert.alert('Erro', 'Erro ao deletar ensaio.');
      console.error(error);
    }
  }; 
  

  const handleOpenModal = (ensaio) => {
    setSelectedEnsaio(ensaio);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedEnsaio(null);
  };

  const handleEditEnsaio = () => {
    handleCloseModal();
    navigateTo('AdicionarEnsaio', null, null, null, selectedEnsaio);
  };

  const confirmRemoveEnsaio = () => {
    Alert.alert(
      'Confirmar',
      `Deseja remover o ensaio "${selectedEnsaio?.descricao}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            handleRemoveEnsaio(selectedEnsaio?.id);
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

  return (
    <View style={styles.container}>      
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigateTo('GrupoReg')}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>    

        <Text style={{paddingLeft: 15, ...styles.h2}}>Ensaios</Text>

        <TouchableOpacity onPress={() => navigateTo('AdicionarEnsaio')}>
          <Text style={styles.backButton}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={ensaios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const formattedDate = format(new Date(item.data), 'dd/MM - HH:mm', { locale: ptBR });
          return (
            <View style={styles.lista}>
              <View style={styles.ensaioItem}>

                <View style={styles.ensaioContent}>
                  <View style={styles.ensaioTitleView}>
                    <Text style={{...styles.ensaioTitle, fontSize: 18}}>{item.descricao}</Text>
                    <TouchableOpacity onPress={() => handleOpenModal(item)} style={styles.menuButton}>
                      <Text style={styles.menuButtonText}>...</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.ensaioTitle}>{formattedDate}</Text>
                  <Text style={styles.ensaioText}>{item.local}</Text>
                </View>

                
              </View>
            </View>
          );
        }}
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
            <Text style={styles.modalTitle}>{selectedEnsaio?.descricao}</Text>
            <View style={styles.modalDivider} />
            <TouchableOpacity style={styles.modalOption} onPress={handleEditEnsaio}>
              <Feather style={styles.editOptionIcon} name="edit" size={24} />
              <Text style={styles.modalOptionText}>Editar</Text>
            </TouchableOpacity>
            <View style={styles.modalDivider} />
            <TouchableOpacity style={styles.modalOption} onPress={confirmRemoveEnsaio}>
              <Feather style={styles.editOptionIcon} name="trash-2" size={24} />
              <Text style={styles.modalOptionText}>Remover Ensaio</Text>
            </TouchableOpacity>
            <View style={styles.modalDivider} />
            <TouchableOpacity style={styles.modalOption} onPress={handleCloseModal}>
              <Feather style={styles.editOptionIcon} name="corner-left-down" size={24} />
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
  titleContainer:{
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#26516E',
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5
  },
  ensaioTitleView:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ensaioTitle:{
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#26516E',
    marginBottom: 5
  },
  ensaioItem: {
    padding: 12,
    backgroundColor: '#F5FBFF',
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  ensaioText: {
    fontSize: 15,
    fontFamily: 'Nunito_500Medium',
    color: '#5F8BA9',
    marginBottom: 5
  },
  lista: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  ensaioContent: {
    flex: 1,
  },
  menuButton: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#26516E',
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
    tintColor: '#26516E',
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  editOptionIcon: {
    width: 24,
    height: 24,
    marginRight: 14,
    textAlign: 'center',
    color: '#26516E',
  },
});
