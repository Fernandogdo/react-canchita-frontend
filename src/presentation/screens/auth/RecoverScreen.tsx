import React, { useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import {  KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { styles } from '../styles'; // Importa los estilos

import Toast from 'react-native-toast-message';

interface Props extends StackScreenProps<RootStackParams, 'RecoverScreen'> {}

export const RecoverScreen = ({ navigation }: Props) => {
  
  const { sendResetOtp } = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);
  const [form, setForm] = useState({
    email: '',
  });
  const [isFocused, setIsFocused] = useState({
    email: false,
  });

  const onSend = async () => {
    if (form.email.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor ingresa tanto el correo o identificación',
      });
      return;
    }
    setIsPosting(true);
    const wasSuccessful = await sendResetOtp(form.email);
    setIsPosting(false);
    if (!wasSuccessful.transaccion) 
      {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: wasSuccessful.mensaje,
          
        });
      
      }
      
      else{
        Toast.show({
          type: 'success',
          text1: '',
          text2: wasSuccessful.mensaje,
        });
        navigation.navigate('ResetPassScreen', { email: form.email });
        //navigation.navigate('ResetPassScreen');

      }
      
   setIsPosting(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Layout style={styles.containerCentered}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Layout style={[styles.fondoPrincipal,{ paddingBottom: 20}]}>
            <Text style={{ color:'white' }} category="h1">Recuperar contraseña </Text>
            <Text style={{ color:'white' }} category="p2">Ingresa tu correo electrónico   o identificación para recuperar tu contraseña</Text>
          </Layout>

          {/* Inputs */}
          <Layout style={[styles.fondoPrincipal,{ marginTop: 5}]}>
            <Input
              placeholder="Correo electrónico / ID"
              autoCapitalize="none"
              value={form.email}
              onChangeText={email => setForm({ ...form, email })}
              onFocus={() => setIsFocused({ ...isFocused, email: true })}
              onBlur={() => setIsFocused({ ...isFocused, email: false })}
              accessoryLeft={<MyIcon name="email-outline" white />}
              style={[
                styles.input,
                isFocused.email && styles.inputFocused,
              ]}
              textStyle={{ color: styles.input.color }} // Cambia el color del texto interno
            />
          </Layout>


       
         
         

          <Layout
            style={[styles.fondoPrincipal,{
              alignItems: 'flex-end',
              flexDirection: 'row',
              marginTop: 5,
              marginBottom:5
            }]}>
           
            <Text
              style={styles.textButton}
              status="primary"
              category="s1"
              onPress={() => navigation.navigate('RecoverScreen')}>
              {' '}
              No tengo acceso al correo{' '}
            </Text>
          </Layout>
             {/* Space */}
             <Layout style={[styles.fondoPrincipal, { height: 10,  }]} />

           {/* Button */}
           <Layout style={[styles.fondoPrincipal]}>
            <Button
              style={styles.button}
              disabled={isPosting}
              accessoryRight={<MyIcon name="arrow-forward-outline" white />}
              onPress={onSend}>
              Recuperar contraseña
            </Button>
              {/* Space */}
              <Layout style={[styles.fondoPrincipal, { height: 10,  }]} />

            <Button
              style={styles.button}
              disabled={isPosting}
              accessoryLeft={<MyIcon name="arrow-back-outline" white />}
              onPress={() => navigation.goBack()}>
              Regresar
            </Button>
          </Layout>
          <Layout style={[styles.fondoPrincipal, { height: 10,  }]} />

         
        </ScrollView>
      </Layout>
      <Toast />
    </KeyboardAvoidingView>
  );
};
