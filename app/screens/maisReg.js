import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { useFonts, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { AuthContext } from '../../src/contexts/AuthContext';
import { useOnboarding } from '../../src/contexts/OnboardingContext';
import api from '../../src/api/api';

export default function MaisReg({ navigateTo }) {
  const { logout, id_grupo, user, updateUser } = useContext(AuthContext);
  const { resetOnboarding } = useOnboarding();
  const [grupoInfo, setGrupoInfo] = useState(null);

  useEffect(() => {
    if (id_grupo) {
      carregarGrupo();
    }
  }, [id_grupo]);

  const carregarGrupo = async () => {
    try {
      const res = await api.get(`/grupo/${id_grupo}`);
      setGrupoInfo(res.data);
    } catch (e) {
      console.log('Erro ao carregar grupo:', e);
    }
  };

  const handleSairDoGrupo = () => {
    Alert.alert(
      'Sair do Grupo',
      'Tem certeza que deseja sair deste grupo? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/grupo/${id_grupo}`, { data: { regenteId: user?.id_user } });
              setGrupoInfo(null);
              await updateUser({ userType: 'Adorador', id_grupo: null });
              Alert.alert('Você saiu do grupo');
            } catch (e) {
              console.log('Erro ao sair do grupo:', e);
              Alert.alert('Erro', 'Não foi possível sair do grupo.');
            }
          },
        },
      ]
    );
  };
  const [fontLoaded] = useFonts({
    Nunito_500Medium,
    Poppins_700Bold, Poppins_600SemiBold
  })

  if (!fontLoaded) {
    return null;
  };

  return (
    <View>
      <View>
        <View>
          <Text style={{paddingLeft: 15, ...styles.h2}}>Mais</Text>

          <View style={{marginTop: 20}}>
            <TouchableOpacity style={styles.item} activeOpacity={0.7}>
              <Text style={styles.txt}>Editar Perfil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.item} activeOpacity={0.7}>
              <Text style={styles.txt}>Redefinir Senha</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.item, id_grupo && styles.itemInativo]}
              activeOpacity={0.7}
              onPress={() => !id_grupo && navigateTo('CriarGrupo')}
            >
              <Text style={styles.txt}>{id_grupo ? 'Você já possui um grupo' : 'Criar Grupo'}</Text>
            </TouchableOpacity>

            {id_grupo && (
              <TouchableOpacity style={[styles.item, styles.itemSair]} activeOpacity={0.7} onPress={handleSairDoGrupo}>
                <Text style={styles.txt}>Sair do Grupo</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigateTo('MudarHinario')} style={styles.item} activeOpacity={0.7}>
              <Text style={styles.txt}>Mudar Hinário</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { logout(); resetOnboarding(); }} style={styles.item} activeOpacity={0.7}>
              <Text style={styles.txt}>Encerrar Sessão</Text>
            </TouchableOpacity>
          </View>

          <View style={{marginTop: 40}}>
            <TouchableOpacity style={styles.item} activeOpacity={0.7}>
              <Text style={styles.txt}>Suporte</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.item} activeOpacity={0.7}>
              <Text style={styles.txt}>Privacidade</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} activeOpacity={0.7}>
              <Text style={styles.txt}>Termos e Condições</Text>
            </TouchableOpacity>            
          </View>
        </View>
      </View>
    </View>
  )
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
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
    lineHeight: 14
  },
  item: {
    padding: 16,
    marginHorizontal: 5,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#FFCB69',
  },
  itemInativo: {
    opacity: 0.5,
  },
  itemSair: {
    backgroundColor: '#E57373',
  },
})