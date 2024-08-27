import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Button,
  Input,
  Layout,
  Text,
  Select,
  SelectItem,
  IndexPath,
} from '@ui-kitten/components';
import {MyIcon} from '../../components/ui/MyIcon';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';
import {useAuthStore} from '../../store/auth/useAuthStore';
import {styles} from '../styles';
import Toast from 'react-native-toast-message';
import {Picker} from '@react-native-picker/picker';

interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'> {}

const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const validatePassword = (password: string) => {
  return (
    /[A-Z]/.test(password) && /[a-z]/.test(password) && password.length >= 8
  );
};

export const RegisterScreen = ({route, navigation}: Props) => {
  const {role} = route.params;
  const {register} = useAuthStore();

  const type_identificationOptions = [
    {label: 'Cédula', value: 'CED'},
    {label: 'RUC', value: 'RUC'},
    {label: 'Pasaporte', value: 'PAS'},
  ];

  const [isPosting, setIsPosting] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    type_identification: type_identificationOptions[0].value,
    identification_number: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState(''); // Estado para repetir la contraseña
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    type_identification: '',
    identification_number: '',
    password: '',
    confirmPassword: '', // Error para el campo de confirmar contraseña
  });

  const [isFocused, setIsFocused] = useState({
    firstName: false,
    lastName: false,
    email: false,
    type_identification: false,
    identification_number: false,
    password: false,
    confirmPassword: false, // Estado de enfoque para confirmar contraseña
  });

  const [selectedtype_identificationIndex, setSelectedtype_identificationIndex] = useState<IndexPath>(
    new IndexPath(0),
  );

  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para controlar visibilidad de la contraseña
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); // Estado para controlar visibilidad de confirmar contraseña

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const onRegister = async () => {
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
    
    if (form.firstName.length === 0) {
      newErrors.firstName = 'El nombre es obligatorio';
      valid = false;
    }
  
    if (form.lastName.length === 0) {
      newErrors.lastName = 'El apellido es obligatorio';
      valid = false;
    }
  
    if (!validateEmail(form.email)) {
      newErrors.email = 'El correo electrónico no es válido';
      valid = false;
    }
  
    if (form.identification_number.length === 0) {
      newErrors.identification_number = 'La identificación es obligatoria';
      valid = false;
    }
  
    if (!validatePassword(form.password)) {
      newErrors.password =
        'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números';
      valid = false;
    }
  
    if (form.password !== confirmPassword) {
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
  
    setIsPosting(true);
  
    try {
      const response = await register(
        form.firstName,
        form.lastName,
        form.email,
        form.type_identification,
        form.identification_number,
        form.password,
        role,
      );
  
      if (response && response.user) {
        const userId = response.user.id;
        const email = response.user.email;
  
        if (role === 'E') {
          navigation.navigate('EstablishmentRegisterScreenStep1', {userId, email});
        } else {
          navigation.navigate('ValidationScreen', { email, user_id: userId });
        }
      } else if (response && 'message' in response) {
        // Mostrar el mensaje de error del servidor en el Toast
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message,
        });
      } else {
        throw new Error('Error al obtener el ID de usuario');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error al crear la cuenta';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setIsPosting(false);
    }
  };
  
  

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Layout style={styles.containerCentered}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Layout style={[styles.fondoPrincipal, {paddingBottom: 20}]}>
            <Text style={styles.titleText} category="h1">
              Crear cuenta
            </Text>
            {role && (
              <Text style={{color: 'white', marginTop: 20}} category="s1">
                Rol seleccionado: {role === 'E' ? 'Establecimiento' : 'Cliente'}
              </Text>
            )}
          </Layout>

          {/* Inputs */}
          <Layout style={[styles.fondoPrincipal, {marginTop: 15}]}>
            <Input
              placeholder="Nombre"
              accessoryLeft={<MyIcon name="person-outline" white />}
              value={form.firstName}
              onChangeText={firstName => setForm({...form, firstName})}
              status={errors.firstName ? 'danger' : 'basic'}
              caption={errors.firstName}
              onFocus={() => setIsFocused({...isFocused, firstName: true})}
              onBlur={() => setIsFocused({...isFocused, firstName: false})}
              style={[
                styles.input,
                isFocused.firstName && styles.inputFocused,
                errors.firstName ? styles.inputError : null,
              ]}
              textStyle={{color: styles.input.color}}
            />
            <Input
              placeholder="Apellido"
              accessoryLeft={<MyIcon name="person-outline" white />}
              value={form.lastName}
              onChangeText={lastName => setForm({...form, lastName})}
              status={errors.lastName ? 'danger' : 'basic'}
              caption={errors.lastName}
              onFocus={() => setIsFocused({...isFocused, lastName: true})}
              onBlur={() => setIsFocused({...isFocused, lastName: false})}
              style={[
                styles.input,
                isFocused.lastName && styles.inputFocused,
                errors.lastName ? styles.inputError : null,
              ]}
              textStyle={{color: styles.input.color}}
            />
            <Input
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              accessoryLeft={<MyIcon name="email-outline" white />}
              value={form.email}
              onChangeText={email => setForm({...form, email})}
              status={errors.email ? 'danger' : 'basic'}
              caption={errors.email}
              onFocus={() => setIsFocused({...isFocused, email: true})}
              onBlur={() => setIsFocused({...isFocused, email: false})}
              style={[
                styles.input,
                isFocused.email && styles.inputFocused,
                errors.email ? styles.inputError : null,
              ]}
              textStyle={{color: styles.input.color}}
            />

            <View
              style={[
                styles.input,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                  marginBottom: 5,
                  marginLeft: 9,
                  marginRight: 9,
                  paddingVertical: 0,
                  height: 40,
                },
              ]}>
              <MyIcon name="credit-card-outline" style={{marginLeft: 6}} white />
              <Picker
                selectedValue={form.type_identification}
                onValueChange={itemValue =>
                  setForm({...form, type_identification: itemValue})
                }
                style={{color: '#7f7c7c', flex: 1}}
                dropdownIconColor="white"
                itemStyle={{color: '#737373'}}
              >
                {type_identificationOptions.map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    color="#a4a4a4"
                  />
                ))}
              </Picker>
            </View>

            <Input
              placeholder="Identificación"
              accessoryLeft={<MyIcon name="hash-outline" white />}
              value={form.identification_number}
              onChangeText={identification_number => setForm({...form, identification_number})}
              status={errors.identification_number ? 'danger' : 'basic'}
              caption={errors.identification_number}
              onFocus={() => setIsFocused({...isFocused, identification_number: true})}
              onBlur={() => setIsFocused({...isFocused, identification_number: false})}
              style={[
                styles.input,
                isFocused.identification_number && styles.inputFocused,
                errors.identification_number ? styles.inputError : null,
              ]}
              textStyle={{color: styles.input.color}}
            />
            <Input
              placeholder="Contraseña"
              autoCapitalize="none"
              secureTextEntry={!isPasswordVisible} // Controla la visibilidad de la contraseña
              accessoryLeft={<MyIcon name="lock-outline" white />}
              accessoryRight={() => (
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <MyIcon
                    name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                    white
                  />
                </TouchableOpacity>
              )}
              value={form.password}
              onChangeText={password => setForm({...form, password})}
              status={errors.password ? 'danger' : 'basic'}
              caption={errors.password}
              onFocus={() => setIsFocused({...isFocused, password: true})}
              onBlur={() => setIsFocused({...isFocused, password: false})}
              style={[
                styles.input,
                isFocused.password && styles.inputFocused,
                errors.password ? styles.inputError : null,
              ]}
              textStyle={{color: styles.input.color}}
            />

            <Input
              placeholder="Repetir contraseña"
              autoCapitalize="none"
              secureTextEntry={!isConfirmPasswordVisible} // Controla la visibilidad de la confirmación de contraseña
              accessoryLeft={<MyIcon name="lock-outline" white />}
              accessoryRight={() => (
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                  <MyIcon
                    name={isConfirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                    white
                  />
                </TouchableOpacity>
              )}
              value={confirmPassword}
              onChangeText={password => setConfirmPassword(password)}
              status={errors.confirmPassword ? 'danger' : 'basic'}
              caption={errors.confirmPassword}
              onFocus={() => setIsFocused({...isFocused, confirmPassword: true})}
              onBlur={() => setIsFocused({...isFocused, confirmPassword: false})}
              style={[
                styles.input,
                isFocused.confirmPassword && styles.inputFocused,
                errors.confirmPassword ? styles.inputError : null,
              ]}
              textStyle={{color: styles.input.color}}
            />
          </Layout>

          <Layout style={[styles.fondoPrincipal, {height: 10}]} />

          <Layout style={styles.fondoPrincipal}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPressIn={() => setIsPressed(true)}
              onPressOut={() => setIsPressed(false)}
              onPress={onRegister}
              style={{
                backgroundColor: isPressed ? '#4e8b3a' : '#5BA246',
                borderRadius: 20,
                padding: 15,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
              disabled={isPosting}>
              <MyIcon name="arrow-forward-outline" white />
              <Text style={{color: 'white', marginLeft: 10}}>Crear</Text>
            </TouchableOpacity>
          </Layout>

          <Layout style={[styles.fondoPrincipal, {height: 50}]} />

          <Layout
            style={[
              styles.fondoPrincipal,
              {
                alignItems: 'flex-end',
                flexDirection: 'row',
                justifyContent: 'center',
              },
            ]}>
            <Text style={{color: 'white'}}>¿Ya tienes cuenta?</Text>
            <Text
              style={styles.textButton}
              status="primary"
              category="s1"
              onPress={() => navigation.navigate('LoginScreen')}>
              {' '}
              ingresar{' '}
            </Text>
          </Layout>
        </ScrollView>
      </Layout>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
