import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { MyIcon } from '../../components/ui/MyIcon';
import { styles } from '../styles';
import Toast from 'react-native-toast-message';

interface Props extends StackScreenProps<RootStackParams, 'EstablishmentRegisterScreen'> {}

const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const EstablishmentRegisterScreen = ({ navigation }: Props) => {
  const [form, setForm] = useState({
    establishmentName: '',
    address: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState({
    establishmentName: '',
    address: '',
    phone: '',
    email: '',
  });
  const [isFocused, setIsFocused] = useState({
    establishmentName: false,
    address: false,
    phone: false,
    email: false,
  });

  const onRegisterEstablishment = async () => {
    let valid = true;
    const newErrors = { establishmentName: '', address: '', phone: '', email: '' };

    if (form.establishmentName.length === 0) {
      newErrors.establishmentName = 'El nombre del establecimiento es obligatorio';
      valid = false;
    }

    if (form.address.length === 0) {
      newErrors.address = 'La dirección es obligatoria';
      valid = false;
    }

    if (form.phone.length === 0) {
      newErrors.phone = 'El teléfono es obligatorio';
      valid = false;
    }

    if (!validateEmail(form.email)) {
      newErrors.email = 'El correo electrónico no es válido';
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

    // Lógica para registrar el establecimiento
    Alert.alert('Éxito', 'Establecimiento registrado con éxito');
    navigation.navigate('LoginScreen');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Layout style={styles.containerCentered}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Layout style={[styles.fondoPincipal, { paddingBottom: 20 }]}>
            <Text style={{ color: 'white' }} category="h1">Registrar Establecimiento</Text>
            <Text style={{ color: 'white' }} category="p2">Por favor, ingrese la información del establecimiento</Text>
          </Layout>

          {/* Inputs */}
          <Layout style={[styles.fondoPincipal, { marginTop: 20 }]}>
            <Input
              placeholder="Nombre del Establecimiento"
              accessoryLeft={<MyIcon name="home-outline" />}
              value={form.establishmentName}
              onChangeText={(establishmentName) => setForm({ ...form, establishmentName })}
              onFocus={() => setIsFocused({ ...isFocused, establishmentName: true })}
              onBlur={() => setIsFocused({ ...isFocused, establishmentName: false })}
              status={errors.establishmentName ? 'danger' : 'basic'}
              caption={errors.establishmentName}
              style={[
                styles.input,
                isFocused.establishmentName && styles.inputFocused,
                errors.establishmentName ? styles.inputError : null,
              ]}
              textStyle={{ color: 'white' }}
            />
            <Input
              placeholder="Dirección"
              accessoryLeft={<MyIcon name="map-outline" />}
              value={form.address}
              onChangeText={(address) => setForm({ ...form, address })}
              onFocus={() => setIsFocused({ ...isFocused, address: true })}
              onBlur={() => setIsFocused({ ...isFocused, address: false })}
              status={errors.address ? 'danger' : 'basic'}
              caption={errors.address}
              style={[
                styles.input,
                isFocused.address && styles.inputFocused,
                errors.address ? styles.inputError : null,
              ]}
              textStyle={{ color: 'white' }}
            />
            <Input
              placeholder="Teléfono"
              keyboardType="phone-pad"
              accessoryLeft={<MyIcon name="phone-outline" />}
              value={form.phone}
              onChangeText={(phone) => setForm({ ...form, phone })}
              onFocus={() => setIsFocused({ ...isFocused, phone: true })}
              onBlur={() => setIsFocused({ ...isFocused, phone: false })}
              status={errors.phone ? 'danger' : 'basic'}
              caption={errors.phone}
              style={[
                styles.input,
                isFocused.phone && styles.inputFocused,
                errors.phone ? styles.inputError : null,
              ]}
              textStyle={{ color: 'white' }}
            />
            <Input
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              accessoryLeft={<MyIcon name="email-outline" />}
              value={form.email}
              onChangeText={(email) => setForm({ ...form, email })}
              onFocus={() => setIsFocused({ ...isFocused, email: true })}
              onBlur={() => setIsFocused({ ...isFocused, email: false })}
              status={errors.email ? 'danger' : 'basic'}
              caption={errors.email}
              style={[
                styles.input,
                isFocused.email && styles.inputFocused,
                errors.email ? styles.inputError : null,
              ]}
              textStyle={{ color: 'white' }}
            />
          </Layout>

          {/* Space */}
          <Layout style={[styles.fondoPincipal, { height: 10 }]} />

          {/* Button */}
          <Layout style={styles.fondoPincipal}>
            <Button
              style={styles.button}
              onPress={onRegisterEstablishment}
            >
              Registrar Establecimiento
            </Button>
          </Layout>
        </ScrollView>
      </Layout>
      <Toast />
    </KeyboardAvoidingView>
  );
};
