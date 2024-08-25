import React, { useState } from 'react';
import { Button, Input, Layout, Text, Icon } from '@ui-kitten/components';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
  View,
  TouchableOpacity
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { styles } from '../styles'; // Importa los estilos
import { MyIcon } from '../../components/ui/MyIcon';
import Toast from 'react-native-toast-message';
import { usePermissionStore } from '../../store/permissions/usePermissionStore';

interface Props extends StackScreenProps<RootStackParams, 'ResetPassScreen'> { }

export const ResetPassScreen = ({ route, navigation }: Props) => {
  const { resetPassword } = useAuthStore();
  const { locationStatus } = usePermissionStore();  // Importa el estado de permisos
  const { sendResetOtp } = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);
  const validatePassword = (password: string) => {
    return (
      /[A-Z]/.test(password) && /[a-z]/.test(password) && password.length >= 8
    );
  };
  const [form, setForm] = useState({
    otp: '',
    password: '',
    confirmPassword: '',

  });
  const [isFocused, setIsFocused] = useState({
    otp: false,
    password: false,
    confirmPassword: false,
  });
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordConfirmVisibility = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // Estado para mostrar/ocultar
  const renderEyeIcon = (props) => (
    <TouchableOpacity onPress={togglePasswordVisibility}>
      <MyIcon
        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
        white
      />
    </TouchableOpacity>
  );
  const renderEyeIconConfirm = (props) => (
    <TouchableOpacity onPress={togglePasswordConfirmVisibility}>
      <MyIcon
        name={showPasswordConfirm ? 'eye-off-outline' : 'eye-outline'}
        white
      />
    </TouchableOpacity>
  );
  const { email } = route.params; // Obtén el email pasado como parámetro
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '', // Error para el campo de confirmar contraseña
  });
  const onSend = async () => {
    setIsPosting(true);
    const wasSuccessful = await sendResetOtp(email);
    setIsPosting(false);
    if (!wasSuccessful.transaccion) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: wasSuccessful.mensaje,

      });
      // navigation.navigate('ResetPassScreen', { email: form.email });

    }

    else {
      Toast.show({
        type: 'success',
        text1: '',
        text2: wasSuccessful.mensaje,
      });
      // navigation.navigate('ResetPassScreen', { email: form.email });
      //navigation.navigate('ResetPassScreen');

    }


  };
  const onReset = async () => {
    let valid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      type_identification: '',
      identification_number: '',
      password: '',
      confirmPassword: '', // Inicializar error de confirmar contraseña
    };
    if (form.otp.length === 0 || form.password.length === 0 ||form.confirmPassword.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor ingresar todos los datos',
      });
      return;
    }
    if (!validatePassword(form.password)) {
      newErrors.password =
        'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números';
      valid = false;
    }
  
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      valid = false;
    }

    setErrors(newErrors);
  
    if (!valid) {
      Toast.show({
        type: 'error',
        text1: 'Errores en el formulario',
        text2: 'Por favor, revisa los campos resaltados',
      });
      return;
    }
    const response = await resetPassword(email, form.otp, form.password);
    setIsPosting(true);

    if (response.transaccion) {
      // const { user } = response;
      Toast.show({
        type: 'success',
        text1: '',
        text2: response.mensaje,
      });
      console.log('resultado:', response.transaccion);
      // Navegar después de 1 segundo (1000 ms)
  setTimeout(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    })// Cambia 'NombreDeLaPantalla' por el nombre de la pantalla a la que deseas navegar
  }, 1000); 
    }
    else{
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.mensaje,
      });
    }

    setIsPosting(false);
  };



  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Layout style={styles.containerCentered}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Layout style={[styles.fondoPrincipal]}>
            <Text style={localStyles.headerText} category="h1">
              Restablecer contraseña
            </Text>
          </Layout>

          {/* Inputs */}
          <Layout style={[styles.fondoPrincipal, { marginTop: 20 }]}>
            <Input
              placeholder="Ingrese el OTP"
              autoCapitalize="none"
              value={form.otp}
              onChangeText={otp => setForm({...form, otp})}
              onFocus={() => setIsFocused({ ...isFocused, otp: true })}
              onBlur={() => setIsFocused({ ...isFocused, otp: false })}
              accessoryLeft={<MyIcon name="lock-outline" white />}
              style={[styles.input, isFocused.otp && styles.inputFocused]}
              textStyle={{ color: styles.input.color }}
              keyboardType="numeric" // Add this line
              maxLength={6}
            />
            <Input
              placeholder="Contraseña"
              autoCapitalize="none"
              secureTextEntry={!showPassword} // Cambia según el estado
              value={form.password}
              onChangeText={password => setForm({ ...form, password })}
              onFocus={() => setIsFocused({ ...isFocused, password: true })}
              onBlur={() => setIsFocused({ ...isFocused, password: false })}
              accessoryLeft={<MyIcon name="lock-outline" white />}
              style={[styles.input, isFocused.password && styles.inputFocused]}
              textStyle={{ color: styles.input.color }}
              accessoryRight={renderEyeIcon} // Agrega el icono a la derecha
              status={errors.password ? 'danger' : 'basic'}
            />
            <Input
              placeholder="Confirmar contraseña"
              autoCapitalize="none"
              secureTextEntry={!showPasswordConfirm}
              value={form.confirmPassword}
              onChangeText={confirmPassword => setForm({ ...form, confirmPassword })}
              onFocus={() => setIsFocused({ ...isFocused, confirmPassword: true })}
              onBlur={() => setIsFocused({ ...isFocused, confirmPassword: false })}
              accessoryLeft={<MyIcon name="lock-outline" white />}
              style={[styles.input, isFocused.confirmPassword && styles.inputFocused]}
              textStyle={{ color: styles.input.color }}
              accessoryRight={renderEyeIconConfirm} // Agrega el icono a la derecha
              status={errors.confirmPassword ? 'danger' : 'basic'}
            />
          </Layout>

          <Layout
            style={[
              styles.fondoPrincipal,
              {
                alignItems: 'flex-end',
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
              onPress={() => onSend(email)}>
              Volver a enviar el código
            </Text>
          </Layout>

          {/* Space */}
          <Layout style={[styles.fondoPrincipal, { height: 10 }]} />

          {/* Button */}
          <Layout style={[styles.fondoPrincipal]}>
            <Button
              style={styles.button}
              disabled={isPosting}
              onPress={onReset}>
              Restablecer contraseña
            </Button>
          </Layout>
          <Layout style={[styles.fondoPrincipal, { height: 10 }]} />

          <Layout
            style={[
              styles.fondoPrincipal,
              {
                alignItems: 'flex-end',
                flexDirection: 'row',
                justifyContent: 'center',
              },
            ]}>
            <Text style={{ color: 'white' }}>¿No tienes cuenta? </Text>
            <Text
              style={styles.textButton}
              status="primary"
              category="s1"
              onPress={() => navigation.navigate('RoleScreen')}>
              Registrate
            </Text>
          </Layout>
        </ScrollView>
      </Layout>
      <Toast />
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
