import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { fetchEventosDoGrupo, removeEvento } from '../../src/api/api';
import { AuthContext } from '../../src/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Feather from '@expo/vector-icons/Feather';

export default function EventosReg({ navigateTo }) {
  const { id_grupo } = useContext(AuthContext); 
  const [eventos, setEventos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);

  useEffect(() => {
    const loadEventos = async () => {
      try {
        const data = await fetchEventosDoGrupo(id_grupo);
        setEventos(data);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      }
    };    

    loadEventos();    
  }, [id_grupo]);

  const handleRemoveEventos = async (id) => {
    try {
      await removeEvento(id);
      Alert.alert('Sucesso', 'Evento deletado com sucesso!');
      setEventos((prevEventos) => prevEventos.filter((evento) => evento.id !== id));
    } catch (error) {
      Alert.alert('Erro', 'Erro ao deletar evento.');
      console.error(error);
    }
  }; 

  const handleOpenModal = (evento) => {
    setSelectedEvento(evento);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedEvento(null);
  };

  const handleEditEvento = () => {
    handleCloseModal();
    navigateTo('AdicionarEvento', null, null, null, selectedEvento);
  };

  const confirmRemoveEvento = () => {
    Alert.alert(
      'Confirmar',
      `Deseja remover o evento "${selectedEvento?.descricao}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            handleRemoveEventos(selectedEvento?.id);
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

        <Text style={{paddingLeft: 15, ...styles.h2}}>Eventos</Text>

        <TouchableOpacity onPress={() => navigateTo('AdicionarEvento')}>
          <Text style={styles.backButton}>+</Text>
        </TouchableOpacity>        
      </View>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const formattedDate = format(new Date(item.data), 'dd/MM - HH:mm', { locale: ptBR });
          return (
            <View style={styles.lista}>
              <View style={styles.eventoItem}>

                <View style={styles.eventoContent}>
                  <View style={styles.eventoTitleView}>
                    <Text style={{...styles.eventoTitle, fontSize: 18}}>{item.descricao}</Text>
                    <TouchableOpacity onPress={() => handleOpenModal(item)} style={styles.menuButton}>
                      <Text style={styles.menuButtonText}>...</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.eventoTitle}>{formattedDate}</Text>
                  <Text style={styles.eventoText}>{item.local}</Text>
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
            <Text style={styles.modalTitle}>{selectedEvento?.descricao}</Text>
            <View style={styles.modalDivider} />
            <TouchableOpacity style={styles.modalOption} onPress={handleEditEvento}>
              <Feather style={styles.editOptionIcon} name="edit" size={24} />
              <Text style={styles.modalOptionText}>Editar</Text>
            </TouchableOpacity>
            <View style={styles.modalDivider} />
            <TouchableOpacity style={styles.modalOption} onPress={confirmRemoveEvento}>
              <Feather style={styles.editOptionIcon} name="trash-2" size={24} />
              <Text style={styles.modalOptionText}>Remover Evento</Text>
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
  )
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
    backgroundColor: '#FF4242',
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5
  },
  eventoTitleView:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventoTitle:{
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FF4242',
    marginBottom: 5
  },
  eventoItem: {
    padding: 12,    
    backgroundColor: '#FFE2E2',
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  eventoText: {
    fontSize: 15,
    fontFamily: 'Nunito_500Medium',
    color: '#FF8282',
    marginBottom: 5
  },
  lista: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  eventoContent: {
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
    color: '#FF4242',
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
    tintColor: '#FF4242',
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
    color: '#FF4242',
  },
})