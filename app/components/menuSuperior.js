import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useFonts, Nunito_600SemiBold } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../src/contexts/AuthContext';
import { fetchNotificacoes } from '../../src/api/api';
import { subscribeToNotifications } from '../../src/services/notificationEvents';

export default function MenuSuperior({ navigateTo }) {
    const [fontLoaded] = useFonts({
        Nunito_600SemiBold,
        Poppins_700Bold
      });

    const { user } = useContext(AuthContext);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user?.id_user) {
            loadUnreadCount();

            // Se inscrever para atualizações de notificações
            const unsubscribe = subscribeToNotifications(loadUnreadCount);

            return () => {
                unsubscribe();
            };
        }
    }, [user]);

    const loadUnreadCount = async () => {
        try {
            const notificacoes = await fetchNotificacoes(user.id_user);
            const unread = notificacoes.filter(n => !n.lida).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Erro ao carregar contagem de notificações não lidas:', error);
        }
    };

    const handleNotificationPress = () => {
        navigateTo('Notificacoes');
    };

    if (!fontLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <TouchableOpacity onPress={() => navigateTo('Perfil')} style={styles.profile}>
                    <FontAwesome name="user-circle" size={40} color="#FFCB69" />
                </TouchableOpacity>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={handleNotificationPress} style={styles.actionButton}>
                        <MaterialIcons name="notifications" size={38} color="#FFCB69" />
                        {unreadCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    main:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profile: {
        padding: 8,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 8,
        marginLeft: 12,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
})