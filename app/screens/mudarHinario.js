import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, TextInput, Alert } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useFonts, Nunito_500Medium } from "@expo-google-fonts/nunito";
import { Poppins_700Bold, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { fetchFavoritos, removeFavorito } from "../api/api";
import { AuthContext } from "../contexts/AuthContext";
import { HinarioContext } from "../contexts/HinarioContext";

export default function MudarHinario({ navigateTo }) {
  const { hinario, trocarHinario } = useContext(HinarioContext);
  const { user } = useContext(AuthContext);

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigateTo("Mais")}>
          <Text style={styles.backButton}>&#60;</Text>
        </TouchableOpacity>
        <Text style={{ paddingLeft: 15, ...styles.h2 }}>Mudar Hinário</Text>
      </View>

      <View>
        <TouchableOpacity style={styles.searchBar}>
          <Image
            source={require("../../assets/icons/idioma.png")}
            style={styles.idiomaIcon}
          />
          <Text
            style={{
              ...styles.hinoText,
              fontFamily: "Nunito_500Medium",
              color: "#FFCB69",
            }}
          >
            Idioma
          </Text>
          <Text
            style={{
              ...styles.hinoText,
              fontFamily: "Nunito_500Medium",
              color: "#FFCB69"              
            }}
          >
            Português (Brasil){" "}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hinoItem}
          onPress={() => trocarHinario("HARPA")}
        >
          <Text style={styles.hinoText}>Harpa Cristã</Text>
          {hinario === "HARPA" && (
            <Image source={require("../../assets/icons/check-white.png")} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hinoItem}
          onPress={() => trocarHinario("CCB")}
        >
          <Text style={styles.hinoText}>Hinário 5 CCB</Text>
          {hinario === "CCB" && (
            <Image source={require("../../assets/icons/check-white.png")} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hinoItem}
          onPress={() => trocarHinario("CANTOR")}
        >
          <Text style={styles.hinoText}>Cantor Cristão</Text>
          {hinario === "CANTOR" && (
            <Image source={require("../../assets/icons/check-white.png")} />
          )}
        </TouchableOpacity>
      </View>
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
    marginBottom: 15,
  },
  searchBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 18,
    backgroundColor: "#FFFAE1",
    borderWidth: 2,
    borderColor: "#FFCB69",
    fontFamily: "Poppins_600SemiBold",
    marginHorizontal: 5,
    marginBottom: 12,
    borderRadius: 12,
    color: "#BA9D36",
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Nunito_500Medium",
    textAlign: "center",
    marginTop: 50,
    color: "#B8AB7D",
  },
  hinoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    marginHorizontal: 5,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "#FFCB69",
  },
  hinoTextContainer: {
    flex: 1,
    flexDirection: "row",
  },
  hinoText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#ffffff",
  },
  hinoAutor: {
    fontFamily: "Nunito_500Medium",
    color: "#ffffff",
    fontSize: 14,
    marginLeft: 10,
  },
  idiomaIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
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
  titleContainer: {
    paddingVertical: 10,
    paddingLeft: 10,
    display: "flex",
    flexDirection: "row",
  },
});
