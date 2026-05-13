// Serviço simples de eventos para notificações
// Permite que componentes se inscrevam para atualizações quando notificações mudam

const subscribers = new Set();

/**
 * Adiciona um subscriber para eventos de notificação
 * @param {Function} callback - Função a ser chamada quando notificações são atualizadas
 * @returns {Function} Função para remover o subscriber
 */
export function subscribeToNotifications(callback) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

/**
 * Notifica todos os subscribers que as notificações foram atualizadas
 */
export function notifyNotificationsUpdated() {
  subscribers.forEach(callback => {
    try {
      callback();
    } catch (error) {
      console.error('Erro ao notificar subscriber:', error);
    }
  });
}

/**
 * Limpa todos os subscribers (útil para testes ou reset)
 */
export function clearAllSubscribers() {
  subscribers.clear();
}