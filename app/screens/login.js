import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useContext } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { AuthContext } from '../contexts/AuthContext'; 
import { userLogin } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigateTo }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_700Bold
  })

  if (!fontLoaded) {
    return null;
  }

  const handleLogin = () => {
    const loginUser = {
      email,
      password
    };
    
    userLogin(loginUser)
    .then(response => {      
      const { token, id_user, userType, id_grupo } = response;    
      if (token && id_user && userType) {
        login({ token, id_user: id_user.toString(), userType, id_grupo: id_grupo || null });
        navigateTo('Dashboard'); 
      } else {
        Alert.alert('Erro', 'Token ou tipo de usuário ausente. Verifique as credenciais.');
      }
    })
    .catch(error => {
      Alert.alert('Erro', 'Erro ao fazer login. Verifique as credenciais.');
      console.error('Erro de login:', error);
    });
  };


  return (
    <View>
      <View style={styles.main}>
        <Image source={require('../../assets/images/icon.png')} style={styles.image}/>
        <View style={styles.mainText}>
          <Text style={styles.h3}>A paz do Senhor!</Text>
          <Text style={styles.h1}>Seja Bem-vindo!</Text>           
          <Text style={styles.txt}>Insira suas informações abaixo para entrar na sua conta!</Text>        
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.h3}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder={'Insira seu Email...'}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={{paddingTop: 15}}>
            <Text style={styles.h3}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder={'Insira sua Senha...'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.btn} activeOpacity={0.7} onPress={handleLogin}><Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_500Medium' }}>Entrar</Text></TouchableOpacity>
          
          <View style={{textAlign: 'center', paddingTop: 10}}>
            <Text style={styles.h3}>Não tem conta? <TouchableOpacity style={styles.span} onPress={() => navigateTo('Cadastro')}><Text>Crie uma Conta</Text></TouchableOpacity></Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    paddingTop: 100,
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  image: {
    width: 150,
    height: 150,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  h1: {
    fontSize: 36,
    fontFamily: 'Poppins_700Bold'    
  },
  h3: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    color: '#BFBFBF',    
  },
  txt: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    color: '#BFBFBF',
    lineHeight: 14
  },
  form: {
    paddingTop: 20
  },
  input: {
    backgroundColor: '#FFFAE8',
    padding: 12,
    paddingVertical: 14,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#FFCB69',
    color: '#000',
    fontFamily: 'Nunito_500Medium',
  },
  btn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFCB69',
    color: '#FFFFFF',
    fontFamily: 'Nunito_500Medium',
    borderRadius: 12    
  },
  span: {
    color: '#FFCB69',
    fontFamily: 'Poppins_700Bold'    
  },
  cad:{
    textAlign: 'center', 
    paddingTop: 10,
    display: 'flex',
    flexDirection: 'row'
  }
})