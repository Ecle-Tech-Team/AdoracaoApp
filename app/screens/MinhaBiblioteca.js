import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { AuthContext } from '../../src/contexts/AuthContext';
import {
  getUserPlaylists,
  createPlaylist,
  deletePlaylist,
  updatePlaylist,
  getPlaylistById,
  removeHinoFromPlaylist,
} from '../../src/api/api';

export default function MinhaBiblioteca({ navigateTo }) {
  const { user } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistHinos, setPlaylistHinos] = useState([]);
  const [loadingHinos, setLoadingHinos] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editId, setEditId] = useState(null);

  const [menuTarget, setMenuTarget] = useState(null);       // 'playlist' | 'hino'
  const [menuItem, setMenuItem] = useState(null);            // the playlist or hino object
  const [menuVisible, setMenuVisible] = useState(false);

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const data = await getUserPlaylists(user.id_user);
      setPlaylists(data || []);
    } catch (error) {
      console.error('Erro ao carregar playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await createPlaylist(user.id_user, newName.trim(), newDesc.trim());
      setNewName('');
      setNewDesc('');
      setShowCreateModal(false);
      loadPlaylists();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a playlist.');
    }
  };

  const handleDelete = (playlist) => {
    Alert.alert(
      'Excluir playlist',
      `Tem certeza que deseja excluir "${playlist.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlaylist(user.id_user, playlist.id);
              loadPlaylists();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a playlist.');
            }
          },
        },
      ]
    );
  };

  const handleOpenDetail = async (playlist) => {
    setSelectedPlaylist(playlist);
    setLoadingHinos(true);
    setShowDetailModal(true);
    try {
      const data = await getPlaylistById(user.id_user, playlist.id);
      setPlaylistHinos(data.hinos || []);
    } catch (error) {
      console.error('Erro ao carregar hinos da playlist:', error);
      setPlaylistHinos([]);
    } finally {
      setLoadingHinos(false);
    }
  };

  const handleRemoveHino = (hino) => {
    Alert.alert(
      'Remover hino',
      `Remover "${hino.titulo}" desta playlist?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeHinoFromPlaylist(user.id_user, selectedPlaylist.id, hino._id, hino.tipo_hino);
              setPlaylistHinos(prev => prev.filter(h => h._id !== hino._id));
              loadPlaylists();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover o hino.');
            }
          },
        },
      ]
    );
  };

  const handleHinoPress = (hino) => {
    setShowDetailModal(false);
    if (hino.tipo_hino === 'GERAL') {
      navigateTo('HinoGeral', hino, null, 'MinhaBiblioteca');
    } else {
      navigateTo('Hino', hino, null, 'MinhaBiblioteca');
    }
  };

  const handleOpenEdit = (playlist) => {
    setEditId(playlist.id);
    setEditName(playlist.nome);
    setEditDesc(playlist.descricao || '');
    setShowEditModal(true);
  };

  const handleEdit = async () => {
    if (!editName.trim()) return;
    try {
      await updatePlaylist(editId, user.id_user, editName.trim(), editDesc.trim());
      setShowEditModal(false);
      loadPlaylists();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a playlist.');
    }
  };

  if (!fontLoaded) return null;

  const renderPlaylistItem = ({ item }) => (
    <TouchableOpacity
      style={styles.playlistCard}
      onPress={() => handleOpenDetail(item)}
      activeOpacity={0.7}
    >
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{item.nome}</Text>
        {item.descricao ? (
          <Text style={styles.playlistDesc}>{item.descricao}</Text>
        ) : null}
        <Text style={styles.playlistCount}>
          {item.total_hinos || 0} hino{(item.total_hinos || 0) !== 1 ? 's' : ''}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.menuDotsPlaylist}
        onPress={() => {
          setMenuTarget('playlist');
          setMenuItem(item);
          setMenuVisible(true);
        }}
      >
        <Text style={styles.menuDotsPlaylistText}>...</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHinoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.hinoItem}
      onPress={() => handleHinoPress(item)}
    >
      <View style={styles.hinoInfo}>
        <Text style={styles.hinoTitle}>
          {item.tipo_hino !== 'GERAL' ? `${item.numero} - ${item.titulo}` : item.titulo}
        </Text>
        <Text style={styles.hinoType}>{item.tipo_hino}</Text>
      </View>
      <TouchableOpacity
        style={styles.menuDotsHino}
        onPress={() => {
          setMenuTarget('hino');
          setMenuItem(item);
          setMenuVisible(true);
        }}
      >
        <Text style={styles.menuDotsHinoText}>...</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.h2}>Minha Biblioteca</Text>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de playlists */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#101010" />
        </View>
      ) : playlists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma playlist criada.</Text>
          <Text style={styles.emptySubtext}>
            Toque em "+ Nova" para criar sua primeira playlist.
          </Text>
        </View>
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPlaylistItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Modal Criar Playlist */}
      <Modal
        transparent
        visible={showCreateModal}
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCreateModal(false)}
        >
          <Pressable style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Playlist</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome da playlist"
              placeholderTextColor="#2E2E2E"
              value={newName}
              onChangeText={setNewName}
            />

            <TextInput
              style={[styles.input, styles.inputDesc]}
              placeholder="Descrição (opcional)"
              placeholderTextColor="#2E2E2E"
              value={newDesc}
              onChangeText={setNewDesc}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setShowCreateModal(false);
                  setNewName('');
                  setNewDesc('');
                }}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, !newName.trim() && styles.btnDisabled]}
                onPress={handleCreate}
                disabled={!newName.trim()}
              >
                <Text style={styles.confirmBtnText}>Criar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal Editar Playlist */}
      <Modal
        transparent
        visible={showEditModal}
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowEditModal(false)}
        >
          <Pressable style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Playlist</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome da playlist"
              placeholderTextColor="#2E2E2E"
              value={editName}
              onChangeText={setEditName}
            />

            <TextInput
              style={[styles.input, styles.inputDesc]}
              placeholder="Descrição (opcional)"
              placeholderTextColor="#2E2E2E"
              value={editDesc}
              onChangeText={setEditDesc}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, !editName.trim() && styles.btnDisabled]}
                onPress={handleEdit}
                disabled={!editName.trim()}
              >
                <Text style={styles.confirmBtnText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal de ações "..." */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <Pressable style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {menuTarget === 'playlist' ? 'Opções da Playlist' : 'Opções do Hino'}
            </Text>

            {menuTarget === 'playlist' && menuItem && (
              <>
                <TouchableOpacity
                  style={[styles.modalMenuBtn, { backgroundColor: '#101010' }]}
                  onPress={() => {
                    setMenuVisible(false);
                    handleOpenEdit(menuItem);
                  }}
                >
                  <Text style={styles.modalMenuBtnText}>Editar playlist</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalMenuBtn, { backgroundColor: '#E87676' }]}
                  onPress={() => {
                    setMenuVisible(false);
                    handleDelete(menuItem);
                  }}
                >
                  <Text style={styles.modalMenuBtnText}>Excluir playlist</Text>
                </TouchableOpacity>
              </>
            )}

            {menuTarget === 'hino' && menuItem && (
              <TouchableOpacity
                style={[styles.modalMenuBtn, { backgroundColor: '#E87676' }]}
                onPress={() => {
                  setMenuVisible(false);
                  handleRemoveHino(menuItem);
                }}
              >
                <Text style={styles.modalMenuBtnText}>Remover hino</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancelOptionBtn}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.cancelOptionText}>Cancelar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal Detalhes da Playlist */}
      <Modal
        transparent
        visible={showDetailModal}
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.detailOverlay}>
          <View style={styles.detailContainer}>
            <View style={styles.detailHeader}>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <Text style={styles.backButton}>&#60;</Text>
              </TouchableOpacity>
              <View style={styles.detailTitleArea}>
                <Text style={styles.detailTitle}>
                  {selectedPlaylist?.nome || 'Playlist'}
                </Text>
                {selectedPlaylist?.descricao ? (
                  <Text style={styles.detailDesc}>{selectedPlaylist.descricao}</Text>
                ) : null}
              </View>
              <View>
                <TouchableOpacity
                  style={styles.createBtn}
                  onPress={() => navigateTo('Pesquisa')}
                >
                  <Text style={styles.createBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {loadingHinos ? (
              <View style={styles.emptyContainer}>
                <ActivityIndicator size="large" color="#101010" />
              </View>
            ) : playlistHinos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum hino nesta playlist.</Text>
              </View>
            ) : (
              <FlatList
                data={playlistHinos}
                keyExtractor={(item) => item._id || Math.random().toString()}
                renderItem={renderHinoItem}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#000',
  },
  createBtn: {
    backgroundColor: '#101010',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  playlistCard: {
    backgroundColor: '#EDEDED',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playlistInfo: {
    flex: 1,
    marginRight: 12,
  },
  playlistName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#2E2E2E',
    marginBottom: 2,
  },
  playlistDesc: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 13,
    color: '#2E2E2E',
    marginBottom: 4,
  },
  playlistCount: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 12,
    color: '#2E2E2E',
  },
  playlistActions: {
    gap: 6,
  },
  editBtn: {
    backgroundColor: '#101010',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  editBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: '#fff',
  },
  deleteBtn: {
    backgroundColor: '#E87676',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#2E2E2E',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 14,
    color: '#2E2E2E',
    textAlign: 'center',
  },
  // Modal padrão
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#EDEDED',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 24,
    width: '80%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#2E2E2E',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#101010',
    borderRadius: 10,
    padding: 14,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#2E2E2E',
    marginBottom: 12,
  },
  inputDesc: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#E87676',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: '#fff',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#101010',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  confirmBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: '#fff',
  },
  // Detail modal (full screen style)
  detailOverlay: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailContainer: {
    flex: 1,
    paddingTop: 50,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  backButton: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#101010',
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5,
    marginRight: 12,
  },
  detailTitleArea: {
    flex: 1,
  },
  detailTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: '#000',
  },
  detailDesc: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 13,
    color: '#2E2E2E',
    marginTop: 2,
  },
  hinoItem: {
    backgroundColor: '#EDEDED',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hinoInfo: {
    flex: 1,
    marginRight: 10,
  },
  hinoTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#2E2E2E',
  },
  hinoType: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 11,
    color: '#2E2E2E',
    marginTop: 2,
  },
  removeBtn: {
    backgroundColor: '#E87676',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: '#fff',
  },
  menuDotsPlaylist: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  menuDotsPlaylistText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#101010',
    letterSpacing: 2,
  },
  menuDotsHino: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  menuDotsHinoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E2E2E',
    letterSpacing: 2,
  },
  modalMenuBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalMenuBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: '#fff',
  },
  cancelOptionBtn: {
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  cancelOptionText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#2E2E2E',
  },
});
