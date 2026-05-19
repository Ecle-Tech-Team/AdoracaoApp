// hinarioGrupo.js
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Modal, Pressable } from 'react-native';
import React, { useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Nunito_700Bold, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

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

const formatText = (text, style = styles.textLine) => {
  return text.split('<br>').map((line, index) => (
    <Text key={index} style={style}>{line.trim()}</Text>
  ));
};

export default function HinarioGrupo({ selectedHino, navigateTo, previousScreen }) {
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_700Bold,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });

  const [fontSize, setFontSize] = useState(getBaseFontSize());
  const [modalVisible, setModalVisible] = useState(false);

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

  const { titulo, autor, verses } = selectedHino || {};

  const aumentarFonte = () =>
    setFontSize((prev) => Math.min(prev + FONT_STEP, FONT_MAX));
  const diminuirFonte = () =>
    setFontSize((prev) => Math.max(prev - FONT_STEP, FONT_MIN));

  const dynamicStyles = useMemo(() => ({
    textLine: {
      fontSize: fontSize,
      marginBottom: 10,
      fontFamily: "Nunito_500Medium",
      color: "#B8AB7D",
      lineHeight: fontSize + 4,
    },
    title: {
      fontSize: fontSize + 2,
      fontFamily: "Poppins_700Bold",
      color: "#BA9D36",
      marginTop: 15,
    },
    autor: {
      fontSize: fontSize - 1,
      fontFamily: "Poppins_600SemiBold",
      color: "#BA9D36",
      marginBottom: 20,
    },
  }), [fontSize]);

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

  const renderFontModal = () => (
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
        <Pressable style={styles.modalContent}>
          <Text style={styles.modalTitle}>Opções</Text>

          <TouchableOpacity
            style={[styles.modalBtn, styles.modalOptionBtn]}
            onPress={diminuirFonte}
            disabled={fontSize <= FONT_MIN}
          >
            <Text style={styles.modalBtnText}>A- Diminuir fonte</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalBtn, styles.modalOptionBtn]}
            onPress={aumentarFonte}
            disabled={fontSize >= FONT_MAX}
          >
            <Text style={styles.modalBtnText}>A+ Aumentar fonte</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelOptionBtn}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.cancelOptionText}>Fechar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigateTo(previousScreen || 'HinarioComp')}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>

        <Text style={{ paddingLeft: 15, ...styles.h2 }}>Hinário</Text>

        <TouchableOpacity
          style={styles.menuDots}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.menuDotsText}>...</Text>
        </TouchableOpacity>
      </View>

      {renderFontModal()}

      <ScrollView style={styles.box}>
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
    flex: 1
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    flex: 1,
  },
  box: {
    backgroundColor: "#FFFAE1",
    paddingLeft: 20,
    marginTop: 15,
    borderRadius: 15,
    margin: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#BA9D36',
    marginTop: 15
  },
  autor: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#BA9D36',
    marginBottom: 20,   
  },
  backButton: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#FFCB69',
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5
  },
  textLine: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Nunito_500Medium',
    color: '#B8AB7D',
    lineHeight: 17
  },
  coro: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold',
    color: '#BA9D36'
  },
  titleContainer: {
    paddingVertical: 10,
    paddingLeft: 10,
    display: 'flex',
    flexDirection: 'row'
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
    backgroundColor: "#FFFAE1",
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
    color: "#BA9D36",
    marginBottom: 20,
  },
  modalBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalBtnText: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#fff",
  },
  modalOptionBtn: {
    backgroundColor: "#FFCB69",
    width: "100%",
    marginBottom: 10,
  },
  cancelOptionBtn: {
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  cancelOptionText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#B8AB7D",
  },
  menuDots: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginRight: 10,
  },
  menuDotsText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#BA9D36",
    letterSpacing: 2,
  },
});
