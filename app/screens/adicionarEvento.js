import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useFonts, Nunito_500Medium } from "@expo-google-fonts/nunito";
import {
  Poppins_700Bold,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { createEvento, fetchHinarioGrupo, updateEvento } from "../../src/api/api";
import { AuthContext } from "../../src/contexts/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { saveRecentAddress, getRecentAddresses } from "../../src/services/recentAddresses";

export default function AdicionarEvento({ navigateTo, editData }) {
  const { id_grupo } = useContext(AuthContext);
  const [hinosDisponiveis, setHinosDisponiveis] = useState([]);
  const [hinosFiltrados, setHinosFiltrados] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [dataHora, setDataHora] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");

  const [hinosSelecionados, setHinosSelecionados] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [recentAddresses, setRecentAddresses] = useState([]);
  const [showAddresses, setShowAddresses] = useState(false);

  useEffect(() => {
    const loadHinos = async () => {
      try {
        const hinos = await fetchHinarioGrupo(id_grupo);
        setHinosDisponiveis(hinos);
        setHinosFiltrados(hinos);
      } catch (error) {
        console.error("Erro ao carregar hinos:", error);
      }
    };
    loadHinos();
  }, [id_grupo]);

  useEffect(() => {
    const loadAddresses = async () => {
      const addresses = await getRecentAddresses(id_grupo, 5);
      setRecentAddresses(addresses);
    };
    loadAddresses();
  }, [id_grupo]);

  useEffect(() => {
    if (editData) {
      setDescricao(editData.descricao || "");
      setLocal(editData.local || "");
      setDataHora(editData.data ? (() => {
        const parts = editData.data.split(/[- :T]/);
        return new Date(parts[0], parts[1] - 1, parts[2], parts[3] || 0, parts[4] || 0);
      })() : null);
    }
  }, [editData]);

  const handleSubmit = async () => {
    if (!dataHora || !descricao || !local) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    try {
      const hinoIds = hinosSelecionados.length > 0 ? hinosSelecionados : null;
      const formatDate = formatDateTimeSQL(dataHora);

      if (editData) {
        await updateEvento(editData.id, formatDate, descricao, local, hinoIds);
        Alert.alert("Sucesso", "Evento atualizado com sucesso!");
        navigateTo("EventosReg");
      } else {
        await createEvento(id_grupo, formatDate, descricao, local, hinoIds);
        Alert.alert("Sucesso", "Evento criado com sucesso!");
        saveRecentAddress(local, id_grupo);
        setDataHora("");
        setDescricao("");
        setLocal("");
        setHinosSelecionados([]);
      }
    } catch (error) {
      Alert.alert("Erro", editData ? "Erro ao atualizar evento." : "Erro ao criar evento.");
    }
  };

  const toggleHinoSelection = (hinoId) => {
    const hinoIdInt = parseInt(hinoId, 10);
    setHinosSelecionados((prev) =>
      prev.includes(hinoIdInt)
        ? prev.filter((id) => id !== hinoIdInt)
        : [...prev, hinoIdInt],
    );
  };

  const formatDateTimeBR = (date) => {
    return (
      date.toLocaleDateString("pt-BR") +
      " " +
      date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const formatDateTimeSQL = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    return (
      date.getFullYear() + "-" +
      pad(date.getMonth() + 1) + "-" +
      pad(date.getDate()) + " " +
      pad(date.getHours()) + ":" +
      pad(date.getMinutes()) + ":00"
    );
  };

  const onChangeDateTime = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    if (pickerMode === "date") {
      setDataHora(selectedDate);
      setPickerMode("time");
    } else {
      const finalDate = new Date(dataHora);
      finalDate.setHours(selectedDate.getHours());
      finalDate.setMinutes(selectedDate.getMinutes());

      setDataHora(finalDate);
      setShowPicker(false);
      setPickerMode("date");
    }
  };

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });

  if (!fontLoaded) {
    return null;
  }

  return (
    <View>
      <View>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={() => navigateTo("EventosReg")}>
            <Text style={styles.backButton}>&#60;</Text>
          </TouchableOpacity>

          <Text style={{ paddingLeft: 15, ...styles.h2 }}>
            {editData ? "Editar Evento" : "Adicionar Evento"}
          </Text>
        </View>

        <View style={styles.container}>
          <View>
            <Text style={styles.h3}>Descrição</Text>
            <TextInput
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.h3}>Data</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowPicker(true)}
              >
              <Text style={{ color: dataHora ? "#000" : "#999" }}>
                {dataHora ? formatDateTimeBR(dataHora) : "Selecione data e hora"}
              </Text>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={dataHora || new Date()}
              mode={pickerMode}
              display="default"
              onChange={onChangeDateTime}
            />
          )}

          <View>
            <Text style={styles.h3}>Local</Text>
            <TextInput
              placeholder="Local"
              value={local}
              onChangeText={setLocal}
              onFocus={() => recentAddresses.length > 0 && setShowAddresses(true)}
              onBlur={() => setTimeout(() => setShowAddresses(false), 150)}
              style={styles.input}
            />
          </View>

          {showAddresses && recentAddresses.length > 0 && (
            <View style={styles.addressDropdown}>
              {recentAddresses.slice(0, 5).map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.addressItem,
                    index < Math.min(recentAddresses.length, 5) - 1 && styles.addressItemBorder,
                  ]}
                  onPress={() => {
                    setLocal(item);
                    setShowAddresses(false);
                  }}
                >
                  <Text style={styles.addressItemIcon}>&#9906;</Text>
                  <Text style={styles.addressItemText} numberOfLines={1}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>{editData ? "Salvar Alterações" : "Criar Evento"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  h2: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    marginBottom: 15,
  },
  h3: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    fontWeight: "900",
    marginBottom: 10,
    color: '#000',    
  },
  titleContainer: {
    paddingVertical: 10,
    paddingLeft: 10,
    display: "flex",
    flexDirection: "row",
  },
  backButton: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#FF4242",
    paddingTop: 3,
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  container: {
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 10,
    marginTop: 10,
  },
  searchBar: {
    padding: 13,
    backgroundColor: "#F1FBFF",
    borderWidth: 2,
    borderColor: "#26516E",
    fontFamily: "Nunito_500Medium",
    marginHorizontal: 5,
    marginBottom: 12,
    borderRadius: 12,
    color: "#26516E",
  },
  hinoItem: {
    padding: 10,
    backgroundColor: "#F1FBFF",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedHino: {
    backgroundColor: "#26516E",
  },
  hinoText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#26516E",
  },
  input: {
    backgroundColor: "#FFE2E2",
    padding: 12,
    paddingVertical: 14,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: "#FF4242",
    color: "#000",
    marginBottom: 15,
    fontFamily: "Nunito_500Medium",
  },
  submitButton: {
    backgroundColor: "#FF4242",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins_700Bold",
  },
  addressDropdown: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginTop: -10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  addressItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  addressItemIcon: {
    fontSize: 14,
    color: "#FF4242",
    marginRight: 12,
  },
  addressItemText: {
    fontSize: 15,
    fontFamily: "Nunito_500Medium",
    color: "#333",
    flex: 1,
  },
});
