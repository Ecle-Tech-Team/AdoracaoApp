import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useFonts, Nunito_600SemiBold } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { UserCircle, Heart, Bell } from 'lucide-react';

export default function MenuSuperiorGrupo({ navigateTo }) {
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
                <TouchableOpacity onPress={() => navigateTo('Favoritos')} style={styles.actionButton}>
                    <Heart size={28} color="#FFCB69" fill="#FFCB69" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigateTo('Notificacao')} style={styles.actionButton}>
                    <Bell size={28} fill='#FFCB69' color="#FFCB69" />
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
        marginTop: 20,
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