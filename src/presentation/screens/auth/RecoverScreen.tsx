import React, { useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { styles } from '../styles'; // Importa los estilos
import { API_URL, STAGE } from '@env';

interface Props extends StackScreenProps<RootStackParams, 'RecoverScreen'> {}

export const RecoverScreen = ({ navigation }: Props) => {
  
  const { login } = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false,
  });

  const onLogin = async () => {
    if (form.email.length === 0 || form.password.length === 0) {
         Alert.alert('Error', 'Usuario o contraseña incorrectos');
      return;
    }
    setIsPosting(true);
    const wasSuccessful = await login(form.email, form.password);
    setIsPosting(false);

    if (wasSuccessful) return;

    Alert.alert('Error', 'Usuario o contraseña incorrectos');
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
            <Text style={{ color:'white' }} category="p2">Ingresa tu correo electrónico para recuperar tu contraseña</Text>
          </Layout>

          {/* Inputs */}
          <Layout style={[styles.fondoPrincipal,{ marginTop: 5}]}>
            <Input
              placeholder="Correo electrónico"
              keyboardType="email-address"
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
              onPress={onLogin}>
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
    </KeyboardAvoidingView>
  );
};
