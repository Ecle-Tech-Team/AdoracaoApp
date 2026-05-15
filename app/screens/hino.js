import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
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

const FONT_STEP = 2;
const FONT_MIN = 12;
const FONT_MAX = 32;

const screenWidth = Dimensions.get("window").width;
const getBaseFontSize = () => {
  if (screenWidth >= 768) return 20;
  if (screenWidth >= 480) return 18;
  return 16;
};

const formatText = (text, style) => {
  if (!text) return null;

  return text.split("<br>").map((line, index) => (
    <Text key={index} style={style}>
      {line.trim()}
    </Text>
  ));
};

const TITULO_POR_TIPO = {
  HARPA: "Harpa Cristã",
  CCB: "Hinário 5 CCB",
  CANTOR: "Cantor Cristão",
  GERAL: "Hinos Cristãos",
};

export default function Hino({ selectedHino, navigateTo, previousScreen }) {
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_700Bold,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });

  const [fontSize, setFontSize] = useState(getBaseFontSize());
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (selectedHino) {
      saveRecentlyViewed(selectedHino);
    }
  }, [selectedHino]);

  const dynamicStyles = useMemo(
    () => ({
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
      },
      coro: {
        fontSize: fontSize,
        marginBottom: 3,
        marginTop: 3,
        color: "#BA9D36",
        fontFamily: "Poppins_700Bold",
      },
    }),
    [fontSize],
  );

  if (!fontLoaded) return null;

  if (!selectedHino) {
    return (
      <View style={styles.container}>
        <Text>Hino não encontrado.</Text>
      </View>
    );
  }

  const { numero, titulo, coro, autor, tipo_hino } = selectedHino;
  const verses = selectedHino.verses || selectedHino.versos;

  const isHinario = !!numero;
  const tituloPrincipal = TITULO_POR_TIPO[tipo_hino] || "Hinos Cristãos";

  const aumentarFonte = () =>
    setFontSize((prev) => Math.min(prev + FONT_STEP, FONT_MAX));
  const diminuirFonte = () =>
    setFontSize((prev) => Math.max(prev - FONT_STEP, FONT_MIN));

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
          <Text style={styles.modalTitle}>Tamanho da Fonte</Text>

          <View style={styles.modalControls}>
            <TouchableOpacity
              style={[
                styles.modalBtn,
                fontSize <= FONT_MIN && styles.fontBtnDisabled,
              ]}
              onPress={diminuirFonte}
              disabled={fontSize <= FONT_MIN}
            >
              <Text style={styles.modalBtnText}>A-</Text>
            </TouchableOpacity>

            <Text style={styles.modalSizeText}>{fontSize}</Text>

            <TouchableOpacity
              style={[
                styles.modalBtn,
                fontSize >= FONT_MAX && styles.fontBtnDisabled,
              ]}
              onPress={aumentarFonte}
              disabled={fontSize >= FONT_MAX}
            >
              <Text style={styles.modalBtnText}>A+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.modalHint}>
            Arraste para o lado para ajustar
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigateTo(previousScreen || "Harpa")}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>

        <Text style={{ paddingLeft: 15, ...styles.h2 }}>{tituloPrincipal}</Text>

        <TouchableOpacity
          style={styles.menuDots}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.menuDotsText}>...</Text>
        </TouchableOpacity>
      </View>

      {renderFontModal()}

      {/* CONTEÚDO */}
      <ScrollView style={styles.box}>
        {/* TÍTULO */}
        <Text style={dynamicStyles.title}>
          {isHinario ? `${numero} - ${titulo}` : titulo}
        </Text>

        {/* AUTOR */}
        {autor && <Text style={dynamicStyles.autor}>{autor}</Text>}

        {/* VERSOS */}
        {verses &&
          Object.entries(verses).map(([key, verse], index) => (
            <View key={index} style={styles.verseContainer}>
              {formatText(verse, dynamicStyles.textLine)}

              {index === 0 && coro && (
                <View style={styles.coroContainer}>
                  {formatText(coro, dynamicStyles.coro)}
                </View>
              )}
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
    backgroundColor: "#FFFAE1",
    paddingLeft: 20,
    marginTop: 15,
    borderRadius: 15,
    margin: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: "#BA9D36",
    marginTop: 15,
  },
  autor: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#BA9D36",
  },
  backButton: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#FFCB69",
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  textLine: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Nunito_500Medium",
    color: "#B8AB7D",
    lineHeight: 17,
  },
  coro: {
    fontSize: 15,
    marginBottom: 3,
    marginTop: 3,
    color: "#BA9D36",
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
    color: "#BA9D36",
    letterSpacing: 2,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 10,
  },
  coroContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  verseContainer: {
    paddingTop: 20,
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
  modalControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  modalBtn: {
    backgroundColor: "#FFCB69",
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
    color: "#BA9D36",
    minWidth: 36,
    textAlign: "center",
  },
  modalHint: {
    fontSize: 12,
    fontFamily: "Nunito_500Medium",
    color: "#B8AB7D",
    marginTop: 16,
  },
});
