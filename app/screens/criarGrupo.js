import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
//import { Picker } from '@react-native-picker/picker';
import React, { useState, useContext } from 'react';
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

export default function CriarGrupo({ navigateTo}) {
    const { user, saveGrupoId } = useContext(AuthContext); 
    const regenteId = user?.id_user;        
      
    const [groupName, setGroupName] = useState('');
    const [groupLocal, setGroupLocal] = useState('');
    const [groupType, setGroupType] = useState('Louvor');

    const [fontLoaded] = useFonts({
        Nunito_500Medium,
        Poppins_700Bold
      })
    
      if (!fontLoaded) {
        return null;
      }
  
    const handleCreateGroup = async () => {
      try {
        const response = await axios.post('https://api.adoracaoapp.com.br/grupo', {
          name: groupName,
          local: groupLocal,
          typeGroup: 'Louvor',
          regenteId, 
        });

        const newGrupoId = response.data.grupoId;
        console.log("Novo grupoId recebido:", newGrupoId);
        saveGrupoId(newGrupoId);  
        console.log('saveGrupoId:', saveGrupoId);

        Alert.alert('Sucesso', response.data.message);
        setGroupName('');
        setGroupLocal('');
        setGroupType('Louvor');
        
        navigateTo('GrupoReg')
        console.log('navigateTo:', navigateTo);
      } catch (error) {
        if (error.response && error.response.status === 400) {
            Alert.alert('Aviso', error.response.data.message);
        } else {
            Alert.alert('Erro', 'Erro ao criar grupo');
            console.error(error);
        }
      
      }
    };
  
    return (
      <View>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={() => navigateTo('MaisReg')}>
            <Text style={styles.backButton}>&#60;</Text>
          </TouchableOpacity>    

          <Text style={{paddingLeft: 15, ...styles.h2}}>Criar Grupo</Text>
        </View>          
        
        <View style={styles.form}>
            <TextInput
                placeholder="Nome do grupo"
                value={groupName}
                onChangeText={setGroupName}
                style={styles.input}
            />
            <TextInput
                placeholder="Local"
                value={groupLocal}
                onChangeText={setGroupLocal}
                style={styles.input}
            />
            {/* <Picker                
                selectedValue={groupType}
                onValueChange={(itemValue) => setGroupType(itemValue)}
                style={{...styles.input, fontSize: 13, borderStyle: 'solid'}}
            >
                <Picker.Item label="Selecione o tipo de grupo" value=""/>
                <Picker.Item label="Louvor" value="Louvor" />
                <Picker.Item label="Musical" value="Musical" />
            </Picker> */}
            <TouchableOpacity onPress={handleCreateGroup} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Salvar Grupo</Text>
            </TouchableOpacity>
        </View>
       
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    h2: {
        fontSize: 24,
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
    item: {
      padding: 14,
      marginHorizontal: 5,
      marginBottom: 16,
      borderRadius: 10,
      backgroundColor: '#FFCB69',
      alignItems: 'center',
    },
    itemText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    form: {
      marginTop: 20,
      padding: 10,
    },
    input: {
      backgroundColor: '#FFFAE8',
      padding: 12,
      paddingVertical: 14,
      borderWidth: 2,
      borderRadius: 12,
      borderColor: '#FFCB69',
      color: '#000',
      marginBottom: 15,
      fontFamily: 'Nunito_500Medium',
    },
    submitButton: {
      backgroundColor: '#FFCB69',
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontFamily: 'Poppins_700Bold'
    },
    titleContainer:{
        paddingVertical: 10,
        paddingLeft: 10,
        display: 'flex',
        flexDirection: 'row'
    },
    backButton: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#FFCB69',
        paddingTop: 3,
        paddingBottom: 5,
        paddingHorizontal: 14,
        borderRadius: 5
      },
  });
  