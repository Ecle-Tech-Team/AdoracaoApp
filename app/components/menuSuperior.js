import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useFonts, Nunito_600SemiBold } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { UserCircle, Bell } from 'lucide-react';

export default function MenuSuperior({ navigateTo }) {
    const [fontLoaded] = useFonts({
        Nunito_600SemiBold,
        Poppins_700Bold
      })
    
      if (!fontLoaded) {
        return null;
      }
  return (
    <View style={styles.container}>
        <View style={styles.main}>
            <TouchableOpacity onPress={() => navigateTo('Perfil')} style={styles.profile}>
                <UserCircle size={40} color="#FFCB69" />
            </TouchableOpacity>

            <View style={styles.actions}>
                <TouchableOpacity onPress={() => navigateTo('Notificacao')} style={styles.actionButton}>
                    <Bell size={28} color="#FFCB69" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
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
    },
})