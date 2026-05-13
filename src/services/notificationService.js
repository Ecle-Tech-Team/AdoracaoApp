import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { registerPushToken } from "../api/api";
import { notifyNotificationsUpdated } from "./notificationEvents";

// Configurar o handler de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Registra o dispositivo para receber notificações push
 * @param {number|null} userId - ID do usuário para associar ao token (opcional)
 * @returns {Promise<string|null>} Token do dispositivo ou null em caso de erro
 */
export async function registerForPushNotifications(userId = null) {
  try {
    // Verificar se é um dispositivo físico
    if (!Device.isDevice) {
      console.log("Push notifications só funcionam em dispositivos físicos");
      return null;
    }

    // Verificar permissões existentes
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Solicitar permissão se não foi concedida
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Se a permissão foi negada
    if (finalStatus !== "granted") {
      console.log("Permissão para notificações negada");
      return null;
    }

    // Obter token do dispositivo
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    //console.log("Expo Push Token obtido:", token);

    // Configurar canal de notificação para Android
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FFCB69",
      });
    }

    // Registrar token no backend (se houver userId, associar ao token)
    try {
      await registerPushToken(token, userId);
      //.log("Token registrado no backend com sucesso");
    } catch (error) {
      console.error("Erro ao registrar token no backend. O endpoint pode não estar implementado:", error.message);
      // Não lançar erro - o app pode funcionar sem registro de token
    }

    return token;
  } catch (error) {
    console.error("Erro ao registrar para notificações push:", error);
    return null;
  }
}

/**
 * Configura o listener para notificações recebidas
 * @returns {Function} Função para remover o listener
 */
export function setupNotificationListener() {
  const subscription = Notifications.addNotificationReceivedListener(() => {
    // Notificar que uma nova notificação chegou
    notifyNotificationsUpdated();
  });

  return () => subscription.remove();
}

/**
 * Agenda uma notificação local
 * @param {Object} options - Opções da notificação
 * @param {string} options.title - Título da notificação
 * @param {string} options.body - Corpo da notificação
 * @param {Object} options.data - Dados adicionais
 * @param {number} options.seconds - Segundos até a notificação (padrão: 5)
 */
export async function scheduleLocalNotification({
  title,
  body,
  data = {},
  seconds = 5,
}) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: "default",
      },
      trigger: {
        seconds,
      },
    });
    console.log("Notificação local agendada");
  } catch (error) {
    console.error("Erro ao agendar notificação local:", error);
  }
}

/**
 * Limpa todas as notificações agendadas
 */
export async function cancelAllScheduledNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("Todas as notificações agendadas foram canceladas");
  } catch (error) {
    console.error("Erro ao cancelar notificações agendadas:", error);
  }
}

/**
 * Obtém o número de notificações não lidas (badge)
 */
export async function getBadgeCount() {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    console.error("Erro ao obter contador de badge:", error);
    return 0;
  }
}

/**
 * Define o número de notificações não lidas (badge)
 * @param {number} count - Número para o badge
 */
export async function setBadgeCount(count) {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error("Erro ao definir contador de badge:", error);
  }
}