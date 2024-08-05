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

  // Mapea los valores mostrados al usuario con los valores enviados al servidor
  const idTypeOptions = [
    {label: 'Cédula', value: 'CED'},
    {label: 'RUC', value: 'RUC'},
    {label: 'Pasaporte', value: 'PAS'},
  ];

  const [isPosting, setIsPosting] = useState(false);
  const [isPressed, setIsPressed] = useState(false); // Estado para manejar el cambio de color al presionar

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    idType: idTypeOptions[0].value, // Valor inicial (CED)
    idNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    idType: '',
    idNumber: '',
    password: '',
  });

  const [isFocused, setIsFocused] = useState({
    firstName: false,
    lastName: false,
    email: false,
    idType: false,
    idNumber: false,
    password: false,
  });

  const [selectedIdTypeIndex, setSelectedIdTypeIndex] = useState<IndexPath>(
    new IndexPath(0),
  );

  const onRegister = async () => {
    let valid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      idType: '',
      idNumber: '',
      password: '',
    };

    // Validaciones
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

    if (form.idNumber.length === 0) {
      newErrors.idNumber = 'La identificación es obligatoria';
      valid = false;
    }

    if (!validatePassword(form.password)) {
      newErrors.password =
        'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números';
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
      // Aquí se llama a la función register y se obtiene la respuesta con el id del usuario
      const response = await register(
        form.firstName,
        form.lastName,
        form.email,
        form.idType,
        form.idNumber,
        form.password,
        role,
      );

      if (response && response.user) {
        const userId = response.user.id;
        const email = response.user.email;

        if (role === 'E') {
          navigation.navigate('EstablishmentRegisterScreen', {userId, email});
        } else {
          navigation.navigate('ValidationScreen', {email});
        }
      } else {
        throw new Error('Error al obtener el ID de usuario');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al crear la cuenta',
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
            {/* <Text
              style={[styles.textoBase, {textAlign: 'center'}]}
              category="p2">
              Por favor, crea una cuenta para continuar
            </Text> */}
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
              accessoryLeft={<MyIcon name="person-outline" />}
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
              textStyle={{color: styles.input.color}} // Cambia el color del texto interno
            />
            <Input
              placeholder="Apellido"
              accessoryLeft={<MyIcon name="person-outline" />}
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
              textStyle={{color: styles.input.color}} // Cambia el color del texto interno
            />
            <Input
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              accessoryLeft={<MyIcon name="email-outline" />}
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
              textStyle={{color: styles.input.color}} // Cambia el color del texto interno
            />

            <View
              style={[
                styles.input,
                {
                  flexDirection: 'row',
                  alignItems: 'center', // Centra verticalmente el icono y el picker
                  marginTop: 5,
                  marginBottom: 5,
                  marginLeft: 9,
                  marginRight: 9,
                  paddingVertical: 0, // Reduce el padding vertical para hacer el contenedor más pequeño
                  height: 40, // Ajusta la altura total del View para que sea más pequeño
                },
              ]}>
              <MyIcon name="credit-card-outline" style={{marginLeft: 6}} />
              <Picker
                selectedValue={form.idType}
                onValueChange={itemValue =>
                  setForm({...form, idType: itemValue})
                }
                style={{color: '#7f7c7c', flex: 1}} // flex: 1 para que el picker ocupe el espacio restante
                dropdownIconColor="white" // Cambiar color del ícono de despliegue
                itemStyle={{color: '#737373'}} // Cambiar color de la opción por defecto
              >
                {idTypeOptions.map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    color="#a4a4a4" // Cambia el color de cada opción a un gris más oscuro
                  />
                ))}
              </Picker>
            </View>

            <Input
              placeholder="Identificación"
              accessoryLeft={<MyIcon name="hash-outline" />}
              value={form.idNumber}
              onChangeText={idNumber => setForm({...form, idNumber})}
              status={errors.idNumber ? 'danger' : 'basic'}
              caption={errors.idNumber}
              onFocus={() => setIsFocused({...isFocused, idNumber: true})}
              onBlur={() => setIsFocused({...isFocused, idNumber: false})}
              style={[
                styles.input,
                isFocused.idNumber && styles.inputFocused,
                errors.idNumber ? styles.inputError : null,
              ]}
              textStyle={{color: styles.input.color}} // Cambia el color del texto interno
            />
            <Input
              placeholder="Contraseña"
              autoCapitalize="none"
              secureTextEntry
              accessoryLeft={<MyIcon name="lock-outline" />}
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
              textStyle={{color: styles.input.color}} // Cambia el color del texto interno
            />
          </Layout>

          {/* Space */}
          <Layout style={[styles.fondoPrincipal, {height: 10}]} />

          {/* Button */}
          {/* Button */}
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

          {/* Información para crear cuenta */}
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
