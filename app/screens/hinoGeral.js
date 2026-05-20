import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useMemo, useContext } from "react";
import {
  useFonts,
  Nunito_700Bold,
  Nunito_500Medium,
} from "@expo-google-fonts/nunito";
import {
  Poppins_700Bold,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { saveRecentlyViewed } from "../../src/services/recentlyViewed";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from "../../src/contexts/AuthContext";
import {
  getUserPlaylists,
  addHinoToPlaylist,
  createPlaylist,
} from "../../src/api/api";

const FONT_STEP = 2;
const FONT_MIN = 12;
const FONT_MAX = 32;
const FONT_SIZE_KEY = '@hino_font_size';

const screenWidth = Dimensions.get("window").width;
const getBaseFontSize = () => {
  if (screenWidth >= 768) return 20;
  if (screenWidth >= 480) return 18;
  return 16;
};

const formatText = (text, style) => {
  return text.split("<br>").map((line, index) => (
    <Text key={index} style={style}>
      {line.trim()}
    </Text>
  ));
};

export default function HinoGeral({
  selectedHino,
  navigateTo,
  previousScreen,
}) {
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_700Bold,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [fontSize, setFontSize] = useState(getBaseFontSize());
  const [modalVisible, setModalVisible] = useState(false);
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [showCreateFromHino, setShowCreateFromHino] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadFontSize = async () => {
      try {
        const saved = await AsyncStorage.getItem(FONT_SIZE_KEY);
        if (saved !== null) {
          setFontSize(Number(saved));
        }
      } catch (error) {
        console.error('Erro ao carregar tamanho da fonte:', error);
      }
    };
    loadFontSize();
  }, []);

  useEffect(() => {
    const saveFontSize = async () => {
      try {
        await AsyncStorage.setItem(FONT_SIZE_KEY, String(fontSize));
      } catch (error) {
        console.error('Erro ao salvar tamanho da fonte:', error);
      }
    };
    saveFontSize();
  }, [fontSize]);

  useEffect(() => {
    if (selectedHino) {
      saveRecentlyViewed(selectedHino);
    }
  }, [selectedHino]);

  const { titulo, autor, verses } = selectedHino || {};
  const isFromBiblioteca = previousScreen === 'MinhaBiblioteca';

  const dynamicStyles = useMemo(
    () => {
      const c = isFromBiblioteca
        ? { text: "#2E2E2E", title: "#101010", bg: "#EDEDED" }
        : { text: "#5F8BA9", title: "#26516E", bg: "#F1FBFF" };
      return {
      textLine: {
        fontSize: fontSize,
        marginBottom: 10,
        fontFamily: "Nunito_500Medium",
        color: c.text,
        lineHeight: fontSize + 4,
      },
      title: {
        fontSize: fontSize + 2,
        fontFamily: "Poppins_700Bold",
        color: c.title,
        marginTop: 15,
      },
      autor: {
        fontSize: fontSize - 1,
        fontFamily: "Poppins_600SemiBold",
        color: c.title,
        marginBottom: 20,
      },
      containerBg: c.bg,
      menuDotsColor: c.title,
      backBtnBg: c.title,
    }},
    [fontSize, isFromBiblioteca],
  );

  if (!fontLoaded) {
    return null;
  }

  if (!selectedHino) {
    return (
      <View style={styles.container}>
        <Text>Hino não encontrado.</Text>
      </View>
    );
  }

  const aumentarFonte = () =>
    setFontSize((prev) => Math.min(prev + FONT_STEP, FONT_MAX));
  const diminuirFonte = () =>
    setFontSize((prev) => Math.max(prev - FONT_STEP, FONT_MIN));

  // Playlist functions
  const loadPlaylists = async () => {
    if (!user?.id_user) return;
    setLoadingPlaylists(true);
    try {
      const data = await getUserPlaylists(user.id_user);
      setUserPlaylists(data || []);
    } catch (error) {
      console.error("Erro ao carregar playlists:", error);
    } finally {
      setLoadingPlaylists(false);
    }
  };

  const handleOpenPlaylistSelector = () => {
    setModalVisible(false);
    setPlaylistModalVisible(true);
    loadPlaylists();
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await addHinoToPlaylist(
        playlistId,
        user.id_user,
        selectedHino._id,
        selectedHino.tipo_hino
      );
      Alert.alert("Adicionado", "Hino adicionado à playlist!");
    } catch (error) {
      const msg =
        error?.response?.data?.message || error.message;
      if (msg.includes("já está")) {
        Alert.alert("Aviso", "Este hino já está nesta playlist.");
      } else {
        Alert.alert("Erro", "Não foi possível adicionar o hino.");
      }
    }
  };

  const handleCreateFromHino = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      await createPlaylist(user.id_user, newPlaylistName.trim());
      setNewPlaylistName("");
      setShowCreateFromHino(false);
      loadPlaylists();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a playlist.");
    }
  };

  const renderFontModal = () => {
    const c = isFromBiblioteca
      ? { bg: "#EDEDED", text: "#2E2E2E", title: "#101010", btn: "#101010" }
      : { bg: "#F1FBFF", text: "#5F8BA9", title: "#26516E", btn: "#26516E" };

    return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setModalVisible(false)}
      >
        <Pressable style={[styles.modalContent, { backgroundColor: c.bg }]}>
          <Text style={[styles.modalTitle, { color: c.title }]}>Opções</Text>

          <TouchableOpacity
            style={[styles.modalBtn, styles.modalOptionBtn, { backgroundColor: c.btn }]}
            onPress={diminuirFonte}
            disabled={fontSize <= FONT_MIN}
          >
            <Text style={styles.modalBtnText}>A- Diminuir fonte</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalBtn, styles.modalOptionBtn, { backgroundColor: c.btn }]}
            onPress={aumentarFonte}
            disabled={fontSize >= FONT_MAX}
          >
            <Text style={styles.modalBtnText}>A+ Aumentar fonte</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalBtn, styles.modalOptionBtn, { backgroundColor: c.title }]}
            onPress={handleOpenPlaylistSelector}
          >
            <Text style={styles.modalBtnText}>Salvar na playlist</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelOptionBtn}
            onPress={() => setModalVisible(false)}
          >
            <Text style={[styles.cancelOptionText, { color: c.text }]}>Fechar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
    );
  };

  const renderPlaylistSelectorModal = () => (
    <Modal
      transparent
      visible={playlistModalVisible}
      animationType="fade"
      onRequestClose={() => setPlaylistModalVisible(false)}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setPlaylistModalVisible(false)}
      >
        <Pressable style={[styles.modalContent, styles.playlistModalContent]}>
          <Text style={styles.modalTitle}>Salvar na playlist</Text>

          {loadingPlaylists ? (
            <ActivityIndicator size="small" color="#26516E" />
          ) : userPlaylists.length === 0 ? (
            <View style={styles.noPlaylistsContainer}>
              <Text style={styles.noPlaylistsText}>
                Nenhuma playlist encontrada.
              </Text>
            </View>
          ) : (
            <FlatList
              data={userPlaylists}
              keyExtractor={(item) => item.id.toString()}
              style={styles.playlistList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.playlistSelectorItem}
                  onPress={() => handleAddToPlaylist(item.id)}
                >
                  <View style={styles.playlistSelectorInfo}>
                    <Text style={styles.playlistSelectorName}>{item.nome}</Text>
                    <Text style={styles.playlistSelectorCount}>
                      {item.total_hinos || 0} hinos
                    </Text>
                  </View>
                  <Text style={styles.addIcon}>+</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {showCreateFromHino ? (
            <View style={styles.createInline}>
              <TextInput
                style={styles.createInlineInput}
                placeholder="Nome da nova playlist"
                placeholderTextColor="#5F8BA9"
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
              />
              <View style={styles.createInlineButtons}>
                <TouchableOpacity
                  style={styles.cancelSmallBtn}
                  onPress={() => {
                    setShowCreateFromHino(false);
                    setNewPlaylistName("");
                  }}
                >
                  <Text style={styles.cancelSmallText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.confirmSmallBtn,
                    !newPlaylistName.trim() && styles.btnDisabled,
                  ]}
                  onPress={handleCreateFromHino}
                  disabled={!newPlaylistName.trim()}
                >
                  <Text style={styles.confirmSmallText}>Criar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.createPlaylistBtn}
              onPress={() => setShowCreateFromHino(true)}
            >
              <Text style={styles.createPlaylistBtnText}>
                + Criar nova playlist
              </Text>
            </TouchableOpacity>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity
          onPress={() => navigateTo(previousScreen || "Hinario")}
        >
          <Text style={[styles.backButton, { backgroundColor: dynamicStyles.backBtnBg }]}>&#60;</Text>
        </TouchableOpacity>

        <Text style={{ paddingLeft: 15, ...styles.h2 }}>Hinos Cristãos</Text>

        <TouchableOpacity
          style={styles.menuDots}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.menuDotsText, { color: dynamicStyles.menuDotsColor }]}>...</Text>
        </TouchableOpacity>
      </View>

      {renderFontModal()}

      {renderPlaylistSelectorModal()}

      <ScrollView style={[styles.box, { backgroundColor: dynamicStyles.containerBg }]}>
        <Text style={dynamicStyles.title}>{titulo}</Text>
        <Text style={dynamicStyles.autor}>{autor}</Text>

        {Object.entries(verses).map(([key, verse], index) => (
          <View key={index} style={styles.verseContainer}>
            {formatText(verse, dynamicStyles.textLine)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  h2: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    flex: 1,
  },
  box: {
    backgroundColor: "#F1FBFF",
    paddingLeft: 20,
    marginTop: 15,
    borderRadius: 15,
    margin: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: "#26516E",
    marginTop: 15,
  },
  autor: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#26516E",
    marginBottom: 20,
  },
  backButton: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#26516E",
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  textLine: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Nunito_500Medium",
    color: "#5F8BA9",
    lineHeight: 17,
  },
  coro: {
    fontSize: 44,
    fontStyle: "italic",
    marginBottom: 20,
    marginTop: 10,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
  menuDots: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginRight: 10,
  },
  menuDotsText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#26516E",
    letterSpacing: 2,
  },
  titleContainer: {
    paddingVertical: 10,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  coroContainer: {
    marginTop: 10,
  },
  verseContainer: {
    marginBottom: 10,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#F1FBFF",
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 36,
    alignItems: "center",
    width: "75%",
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#26516E",
    marginBottom: 20,
  },
  modalControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  modalBtn: {
    backgroundColor: "#26516E",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  fontBtnDisabled: {
    opacity: 0.4,
  },
  modalBtnText: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#fff",
  },
  modalSizeText: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#26516E",
    minWidth: 36,
    textAlign: "center",
  },
  modalHint: {
    fontSize: 12,
    fontFamily: "Nunito_500Medium",
    color: "#5F8BA9",
    marginTop: 16,
  },
  modalOptionBtn: {
    width: "100%",
    marginBottom: 10,
  },
  playlistOption: {
    backgroundColor: "#1D4A6B",
  },
  cancelOptionBtn: {
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  cancelOptionText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#5F8BA9",
  },
  playlistModalContent: {
    maxHeight: "70%",
  },
  playlistList: {
    width: "100%",
    maxHeight: 220,
  },
  playlistSelectorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#26516E",
    width: "100%",
  },
  playlistSelectorInfo: {
    flex: 1,
    marginRight: 8,
  },
  playlistSelectorName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#26516E",
  },
  playlistSelectorCount: {
    fontFamily: "Nunito_500Medium",
    fontSize: 11,
    color: "#5F8BA9",
    marginTop: 2,
  },
  addIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#26516E",
  },
  noPlaylistsContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  noPlaylistsText: {
    fontFamily: "Nunito_500Medium",
    fontSize: 14,
    color: "#5F8BA9",
    textAlign: "center",
  },
  createPlaylistBtn: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#26516E",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  createPlaylistBtnText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
    color: "#fff",
  },
  createInline: {
    width: "100%",
    marginTop: 12,
  },
  createInlineInput: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#26516E",
    borderRadius: 8,
    padding: 10,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#26516E",
    marginBottom: 8,
  },
  createInlineButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  cancelSmallBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#E87676",
  },
  cancelSmallText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: "#fff",
  },
  confirmSmallBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#26516E",
  },
  confirmSmallText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: "#fff",
  },
  btnDisabled: {
    opacity: 0.4,
  },
});
