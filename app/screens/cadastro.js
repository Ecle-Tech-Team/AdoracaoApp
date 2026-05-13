import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { registerUser } from '../../src/api/api';

export default function Cadastro({ navigateTo }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [typeUser, settypeUser] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_700Bold
  })

  if (!fontLoaded) {
    return null;
  }

  const onChangeDate = (event, selectedDate) => {
  setShowDatePicker(false);
  if (selectedDate) {
    setBirthDate(selectedDate);
  }
};
  
  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    if (!typeUser) {
      Alert.alert("Erro", "Selecione o tipo de usuário");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    const createUser = {
      name,
      email,
      password,
      typeUser,
      birthDate: birthDate
        ? birthDate.toISOString().split('T')[0]
        : null,
    };

    registerUser(createUser)
      .then(response => {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigateTo('Login')
      })
      .catch(error => {
        Alert.alert('Erro', 'Erro ao realizar cadastro. Tente novamente.');
        console.error(error);
      });
  };

  return (
    <View>
      <View style={styles.main}>
        <Image source={require('../../assets/images/icon.png')} style={styles.image}/>
        <View style={styles.mainText}>
          <Text style={styles.h1}>Crie sua conta!</Text>           
          <Text style={{...styles.txt, paddingTop: 5}}>Insira as informações abaixo para criar sua conta!</Text>        
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.h3}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder={'Insira seu Nome...'}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={{ paddingTop: 12 }}>
            <Text style={styles.h3}>Data de nascimento</Text>

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>
                {birthDate
                  ? birthDate.toLocaleDateString('pt-BR')
                  : 'Selecione sua data de nascimento'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={birthDate || new Date()}
                mode="date"
                display="calendar"
                maximumDate={new Date()}
                onChange={onChangeDate}
              />
            )}
          </View>

          <View style={{paddingTop: 12}}>
            <Text style={styles.h3}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder={'Insira seu Email...'}
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
            />
          </View>          

          <View style={{paddingTop: 12}}>
            <Text style={styles.h3}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder={'Insira sua Senha...'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={{paddingTop: 12}}>
            <Text style={styles.h3}>Confirme sua Senha</Text>
            <TextInput              
              style={styles.input}
              placeholder={'Insira sua Senha Novamente...'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <View style={{paddingTop: 12}}>
            <Text style={styles.h3}>Tipo de usuário</Text>
            <Picker     
              selectedValue={typeUser}         
              style={{...styles.input, borderStyle: 'solid'}}
              onValueChange={(itemValue) => settypeUser(itemValue)}
            >
              <Picker.Item label="Selecione o tipo de usuário" value=""/>
              <Picker.Item label="Adorador" value="Adorador" />
              <Picker.Item label="Regente" value="Regente" />
              <Picker.Item label="Cantor" value="Cantor" />
              <Picker.Item label="Músico" value="Musico" />             
            </Picker>            
          </View>

          <TouchableOpacity style={styles.btn} activeOpacity={0.7} onPress={handleRegister}><Text>Cadastrar</Text></TouchableOpacity>

          <View style={{textAlign: 'center', paddingTop: 20}}>
            <Text style={styles.h3}>Ao se cadastrar você estará concordando com os termos de politica e privacidade!</Text>
          </View>

          <View style={{textAlign: 'center', paddingTop: 10}}>
            <Text style={styles.h3}>Já tem conta? <TouchableOpacity onPress={() => navigateTo('Login')}><Text style={styles.span}>Faça Login</Text></TouchableOpacity></Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
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
    fontFamily: 'Poppins_700Bold',
    lineHeight: 40,
    textAlign: 'center'    
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
    lineHeight: 14,
    textAlign: 'center'
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
    fontFamily: 'Poppins_700Bold',    
  }
})