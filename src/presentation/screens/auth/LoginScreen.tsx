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

interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> {}

export const LoginScreen = ({ navigation }: Props) => {
  
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
          <Layout style={[styles.fondoPincipal,{ paddingBottom: 20}]}>
            <Text style={{ color:'white' }} category="h1">Inicio de sesión </Text>
            <Text style={{ color:'white' }} category="p2">Inicia sesión mediante correo y contraseña</Text>
          </Layout>

          {/* Inputs */}
          <Layout style={[styles.fondoPincipal,{ marginTop: 20}]}>
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
            <Input
              placeholder="Contraseña"
              autoCapitalize="none"
              secureTextEntry
              value={form.password}
              onChangeText={password => setForm({ ...form, password })}
              onFocus={() => setIsFocused({ ...isFocused, password: true })}
              onBlur={() => setIsFocused({ ...isFocused, password: false })}
              accessoryLeft={<MyIcon name="lock-outline" white />}
              style={[
                styles.input,
                isFocused.password && styles.inputFocused,
              ]}
              textStyle={{ color: styles.input.color }} // Cambia el color del texto interno
            />
          </Layout>


       
         
         

          <Layout
            style={[styles.fondoPincipal,{
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
              Olvidaste tu contraseña?{' '}
            </Text>
          </Layout>
             {/* Space */}
             <Layout style={[styles.fondoPincipal, { height: 10,  }]} />

           {/* Button */}
           <Layout style={[styles.fondoPincipal]}>
            <Button
              style={styles.button}
              disabled={isPosting}
              accessoryRight={<MyIcon name="arrow-forward-outline" white />}
              onPress={onLogin}>
              Iniciar sesión
            </Button>
            
          </Layout>
          <Layout style={[styles.fondoPincipal, { height: 10,  }]} />

          <Layout
            style={[styles.fondoPincipal,{
              alignItems: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'center',
            }]}>
            <Text style={{color:'white'}}>¿No tienes cuenta?</Text>
            <Text
              style={styles.textButton}
              status="primary"
              category="s1"
              onPress={() => navigation.navigate('RoleScreen')}>
              {' '}
              crea una{' '}
            </Text>
          </Layout>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
};
