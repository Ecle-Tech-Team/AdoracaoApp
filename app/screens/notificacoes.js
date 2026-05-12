import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useFonts, Nunito_500Medium } from "@expo-google-fonts/nunito";
import {
  Poppins_700Bold,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

import * as Notifications from "expo-notifications";
import { fetchNotificacoes, marcarComoLida } from "../api/api";
import { AuthContext } from "../contexts/AuthContext";
import { registerForPushNotifications } from "../services/notificationService";
import { notifyNotificationsUpdated, subscribeToNotifications } from "../services/notificationEvents";

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    carregarNotificacoes();

    // Registrar para notificações push
    registerForPushNotifications(user?.id_user || null);

    // Se inscrever para atualizações de notificações
    const unsubscribe = subscribeToNotifications(carregarNotificacoes);

    return () => {
      unsubscribe();
    };
  }, []);

  const carregarNotificacoes = async () => {
    try {
      if (!user?.id_user) {
        console.error("Usuário não autenticado");
        return;
      }
      const data = await fetchNotificacoes(user.id_user);
      setNotificacoes(data);
    } catch (e) {
      console.error("Erro ao carregar notificações", e);
    }
  };

  const handlePress = async (item) => {
    if (!item.lida) {
      // Atualizar localmente primeiro para feedback imediato
      const updatedNotificacoes = notificacoes.map(notif =>
        notif.id_notificacao === item.id_notificacao
          ? { ...notif, lida: true }
          : notif
      );
      setNotificacoes(updatedNotificacoes);

      // Notificar que as notificações foram atualizadas
      notifyNotificationsUpdated();

      // Tentar sincronizar com o backend
      try {
        await marcarComoLida(item.id_notificacao, user.id_user);
      } catch (error) {
        console.error('Erro ao marcar notificação como lida no backend:', error);
        // Não mostrar alerta - já atualizamos localmente
      }
    }
  };

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });

  if (!fontLoaded) return null;

  return (
    <View>
      <Text style={{ paddingLeft: 15, ...styles.h2 }}>Notificações</Text>

      <FlatList
        data={notificacoes}
        keyExtractor={(item) => item.id_notificacao.toString()}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, !item.lida && styles.cardNaoLida]}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.mensagem}>{item.mensagem}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noResults}>Nenhuma notificação por aqui 📭</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  h2: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
  },
  card: {
    padding: 18,
    backgroundColor: "#F5F5F5", // Cinza claro para notificações lidas
    borderRadius: 8,
    marginBottom: 12,
  },
  cardNaoLida: {
    backgroundColor: "#FFF9E6", // Amarelo claro para notificações não lidas
    borderLeftWidth: 4,
    borderLeftColor: "#FFCB69",
  },
  titulo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#000",
    marginBottom: 4,
  },
  mensagem: {
    fontFamily: "Nunito_500Medium",
    fontSize: 14,
    color: "#686868",
  },
  noResults: {
    fontFamily: "Nunito_500Medium",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
    color: "#B8AB7D",
  },
});
