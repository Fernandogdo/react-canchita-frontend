import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Input, Layout, Text, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { styles } from '../styles';
import Toast from 'react-native-toast-message';

interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'> {}

const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const validatePassword = (password: string) => {
  return /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && password.length >= 8;
};

export const RegisterScreen = ({ route, navigation }: Props) => {
  const { role } = route.params;
  const { register } = useAuthStore();
  const idTypes = ['Cédula', 'Pasaporte', 'Licencia de conducir'];

  const [isPosting, setIsPosting] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    lastName: '',
    email: '',
    idType: idTypes[0],
    idNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    fullName: '',
    lastName: '',
    email: '',
    idType: '',
    idNumber: '',
    password: '',
  });

  const [isFocused, setIsFocused] = useState({
    fullName: false,
    lastName: false,
    email: false,
    idType: false,
    idNumber: false,
    password: false,
  });

  const [selectedIdTypeIndex, setSelectedIdTypeIndex] = useState<IndexPath>(new IndexPath(0));

  const onRegister = async () => {
    let valid = true;
    const newErrors = { fullName: '', lastName: '', email: '', idType: '', idNumber: '', password: '' };

    if (form.fullName.length === 0) {
      newErrors.fullName = 'El nombre es obligatorio';
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
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números';
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      Toast.show({
        type: 'error',
        text1: 'Errores en el formulario',
        text2: 'Por favor, revisa los campos resaltados'
      });
      return;
    }

    setIsPosting(true);
    const wasSuccessful = await register(form.fullName, form.lastName, form.email, form.idType, form.idNumber, form.password);
    setIsPosting(false);

    if (wasSuccessful) {
      if (role === 'Establecimiento') {
        navigation.navigate('EstablishmentRegisterScreen');
      } else {
        navigation.navigate('ValidationScreen');
      }
      return;
    }

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Error al crear la cuenta',
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Layout style={styles.containerCentered}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Layout style={[styles.fondoPincipal, { paddingBottom: 20 }]}>
            <Text style={{ color: 'white' }} category="h1">Crear cuenta</Text>
            <Text style={{ color: 'white' }} category="p2">Por favor, crea una cuenta para continuar</Text>
            {role && <Text style={{ color: 'white' }} category="s1">Rol seleccionado: {role}</Text>}
          </Layout>

          {/* Inputs */}
          <Layout style={[styles.fondoPincipal, { marginTop: 20 }]}>
            <Input
              placeholder="Nombre"
              accessoryLeft={<MyIcon name="person-outline" />}
              value={form.fullName}
              onChangeText={(fullName) => setForm({ ...form, fullName })}
              status={errors.fullName ? 'danger' : 'basic'}
              caption={errors.fullName}
              onFocus={() => setIsFocused({ ...isFocused, fullName: true })}
              onBlur={() => setIsFocused({ ...isFocused, fullName: false })}
              style={[
                styles.input,
                isFocused.fullName && styles.inputFocused,
                errors.fullName ? styles.inputError : null,
              ]}
              textStyle={{ color: styles.input.color }} // Cambia el color del texto interno
            />
            <Input
              placeholder="Apellido"
              accessoryLeft={<MyIcon name="person-outline" />}
              value={form.lastName}
              onChangeText={(lastName) => setForm({ ...form, lastName })}
              status={errors.lastName ? 'danger' : 'basic'}
              caption={errors.lastName}
              onFocus={() => setIsFocused({ ...isFocused, lastName: true })}
              onBlur={() => setIsFocused({ ...isFocused, lastName: false })}
              style={[
                styles.input,
                isFocused.lastName && styles.inputFocused,
                errors.lastName ? styles.inputError : null,
              ]}
              textStyle={{ color: styles.input.color }} // Cambia el color del texto interno
            />
            <Input
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              accessoryLeft={<MyIcon name="email-outline" />}
              value={form.email}
              onChangeText={(email) => setForm({ ...form, email })}
              status={errors.email ? 'danger' : 'basic'}
              caption={errors.email}
              onFocus={() => setIsFocused({ ...isFocused, email: true })}
              onBlur={() => setIsFocused({ ...isFocused, email: false })}
              style={[
                styles.input,
                isFocused.email && styles.inputFocused,
                errors.email ? styles.inputError : null,
              ]}
              textStyle={{ color: styles.input.color }} // Cambia el color del texto interno
            />
            <Select
              placeholder="Tipo de Identificación"
              selectedIndex={selectedIdTypeIndex}
              value={idTypes[selectedIdTypeIndex.row]}
              onSelect={(index) => {
                setSelectedIdTypeIndex(index as IndexPath);
                setForm({ ...form, idType: idTypes[(index as IndexPath).row] });
              }}
              accessoryLeft={<MyIcon name="credit-card-outline" />}
              status={errors.idType ? 'danger' : 'basic'}
              caption={errors.idType}
              onFocus={() => setIsFocused({ ...isFocused, idType: true })}
              onBlur={() => setIsFocused({ ...isFocused, idType: false })}
              style={[
                styles.select,
                errors.idType ? styles.inputError : null,
              ]}
            >
              {idTypes.map((idType) => (
                <SelectItem key={idType} title={idType} />
              ))}
            </Select>
            <Input
              placeholder="Identificación"
              accessoryLeft={<MyIcon name="hash-outline" />}
              value={form.idNumber}
              onChangeText={(idNumber) => setForm({ ...form, idNumber })}
              status={errors.idNumber ? 'danger' : 'basic'}
              caption={errors.idNumber}
              onFocus={() => setIsFocused({ ...isFocused, idNumber: true })}
              onBlur={() => setIsFocused({ ...isFocused, idNumber: false })}
              style={[
                styles.input,
                isFocused.idNumber && styles.inputFocused,
                errors.idNumber ? styles.inputError : null,
              ]}
              textStyle={{ color: styles.input.color }} // Cambia el color del texto interno
            />
            <Input
              placeholder="Contraseña"
              autoCapitalize="none"
              secureTextEntry
              accessoryLeft={<MyIcon name="lock-outline" />}
              value={form.password}
              onChangeText={(password) => setForm({ ...form, password })}
              status={errors.password ? 'danger' : 'basic'}
              caption={errors.password}
              onFocus={() => setIsFocused({ ...isFocused, password: true })}
              onBlur={() => setIsFocused({ ...isFocused, password: false })}
              style={[
                styles.input,
                isFocused.password && styles.inputFocused,
                errors.password ? styles.inputError : null,
              ]}
              textStyle={{ color: styles.input.color }} // Cambia el color del texto interno
            />
          </Layout>

          {/* Space */}
          <Layout style={[styles.fondoPincipal, { height: 10 }]} />

          {/* Button */}
          <Layout style={styles.fondoPincipal}>
            <Button
              style={styles.button}
              disabled={isPosting}
              accessoryRight={<MyIcon name="arrow-forward-outline" white />}
              onPress={onRegister}
            >
              Crear
            </Button>
          </Layout>

          {/* Información para crear cuenta */}
          <Layout style={[styles.fondoPincipal, { height: 50 }]} />

          <Layout
            style={[styles.fondoPincipal, {
              alignItems: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'center',
            }]}
          >
            <Text style={{ color: 'white' }}>¿Ya tienes cuenta?</Text>
            <Text
              style={styles.textButton}
              status="primary"
              category="s1"
              onPress={() => navigation.navigate('LoginScreen')}
            >
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
