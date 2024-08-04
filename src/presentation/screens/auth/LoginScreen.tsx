import React, {useState} from 'react';
import {Button, Input, Layout, Text} from '@ui-kitten/components';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
  View,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';
import {useAuthStore} from '../../store/auth/useAuthStore';
import {styles} from '../styles'; // Importa los estilos
import {MyIcon} from '../../components/ui/MyIcon';
import Toast from 'react-native-toast-message';

// import FastImage from 'react-native-fast-image';

interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> {}

export const LoginScreen = ({navigation}: Props) => {
  const {login} = useAuthStore();
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

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Usuario o contraseña incorrectos',
    });
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Layout style={styles.containerCentered}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={localStyles.logoContainer}>
            {/* <FastImage
              source={require('../../../assets/canchita-animation.gif')}
              style={localStyles.gif}
              resizeMode={FastImage.resizeMode.contain}
            /> */}
              <Image
                source={require('../../../assets/canchita-logo.png')} // Cambia el nombre del archivo aquí
                style={localStyles.gif} // Puedes cambiar el estilo si es necesario
                resizeMode="contain"
              />
          </View>
          <Layout style={[styles.fondoPrincipal]}>
            <Text style={localStyles.headerText} category="h1">
              Iniciar Sesión
            </Text>
          </Layout>

          {/* Inputs */}
          <Layout style={[styles.fondoPrincipal, {marginTop: 20}]}>
            <Input
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={email => setForm({...form, email})}
              onFocus={() => setIsFocused({...isFocused, email: true})}
              onBlur={() => setIsFocused({...isFocused, email: false})}
              accessoryLeft={<MyIcon name="email-outline" white />}
              style={[styles.input, isFocused.email && styles.inputFocused]}
              textStyle={{color: styles.input.color}} // Cambia el color del texto interno
            />
            <Input
              placeholder="Contraseña"
              autoCapitalize="none"
              secureTextEntry
              value={form.password}
              onChangeText={password => setForm({...form, password})}
              onFocus={() => setIsFocused({...isFocused, password: true})}
              onBlur={() => setIsFocused({...isFocused, password: false})}
              accessoryLeft={<MyIcon name="lock-outline" white />}
              style={[styles.input, isFocused.password && styles.inputFocused]}
              textStyle={{color: styles.input.color}} // Cambia el color del texto interno
            />
          </Layout>

          <Layout
            style={[
              styles.fondoPrincipal,
              {
                alignItems: 'flex-end', // Cambiado a 'center' para centrar el texto
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 5,
                marginBottom: 5,
              },
            ]}>
            <Text
              style={styles.textButton}
              status="primary"
              category="s1"
              onPress={() => navigation.navigate('RecoverScreen')}>
              {' '}
              ¿Olvidaste tu contraseña?{' '}
            </Text>
          </Layout>

          {/* Space */}
          <Layout style={[styles.fondoPrincipal, {height: 10}]} />

          {/* Button */}
          <Layout style={[styles.fondoPrincipal]}>
            <Button
              style={styles.button}
              disabled={isPosting}
              accessoryRight={<MyIcon name="arrow-forward-outline" white />}
              onPress={onLogin}>
              Iniciar sesión
            </Button>
          </Layout>
          <Layout style={[styles.fondoPrincipal, {height: 10}]} />

          <Layout
            style={[
              styles.fondoPrincipal,
              {
                alignItems: 'flex-end',
                flexDirection: 'row',
                justifyContent: 'center',
              },
            ]}>
            <Text style={{color: 'white'}}>¿No tienes cuenta?</Text>
            <Text
              style={styles.textButton}
              status="primary"
              category="s1"
              onPress={() => navigation.navigate('RoleScreen')}>
              {' '}
              Registrate{' '}
            </Text>
          </Layout>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
};

const localStyles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gif: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  headerText: {
    color: 'white',
    textAlign: 'center',
  },
});
