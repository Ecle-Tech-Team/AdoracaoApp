import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useFonts, Nunito_500Medium, Nunito_400Regular } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Feather } from '@expo/vector-icons';

export default function Pronto({ onFinish }) {
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Nunito_400Regular,
    Poppins_700Bold,
  });

  if (!fontLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Feather name="check-circle" color="white" size={80} />

        <Text style={styles.title}>Terminamos!</Text>
        <Text style={styles.description}>
          Comece a usar o aplicativo e adore o Senhor!
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onFinish}>
        <Text style={styles.buttonText}>Começar a usar →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFCB69',
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    color: '#fff',
    marginTop: 24,
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#FFCB69',
  },
});
