import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { styles } from '../styles';
import Toast from 'react-native-toast-message';

interface Props extends StackScreenProps<RootStackParams, 'EstablishmentRegisterScreen'> {}

export const EstablishmentRegisterScreen = ({ navigation }: Props) => {
  const [form, setForm] = useState({
    establishmentName: '',
    address: '',
    phoneNumber: '',
    // Otros campos que necesites
  });
  
  const [errors, setErrors] = useState({
    establishmentName: '',
    address: '',
    phoneNumber: '',
    // Otros errores
  });

  const validateFields = () => {
    let valid = true;
    const newErrors = { establishmentName: '', address: '', phoneNumber: '' };

    if (form.establishmentName.length === 0) {
      newErrors.establishmentName = 'El nombre del establecimiento es obligatorio';
      valid = false;
    }

    if (form.address.length === 0) {
      newErrors.address = 'La dirección es obligatoria';
      valid = false;
    }

    if (form.phoneNumber.length === 0) {
      newErrors.phoneNumber = 'El número de teléfono es obligatorio';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const onRegisterEstablishment = () => {
    if (!validateFields()) {
      Toast.show({
        type: 'error',
        text1: 'Errores en el formulario',
        text2: 'Por favor, revisa los campos resaltados'
      });
      return;
    }

    // Si la validación es correcta, navegamos a la pantalla de Validación
    navigation.navigate('ValidationScreen');
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
            <Text style={{ color: 'white' }} category="p2">Por favor, completa los datos de tu establecimiento</Text>
          </Layout>

          {/* Inputs */}
          <Layout style={[styles.fondoPincipal, { marginTop: 20 }]}>
            <Input
              placeholder="Nombre del Establecimiento"
              value={form.establishmentName}
              onChangeText={(establishmentName) => setForm({ ...form, establishmentName })}
              status={errors.establishmentName ? 'danger' : 'basic'}
              caption={errors.establishmentName}
              style={[styles.input, errors.establishmentName ? styles.inputError : null]}
              textStyle={{ color: styles.input.color }}
            />
            <Input
              placeholder="Dirección"
              value={form.address}
              onChangeText={(address) => setForm({ ...form, address })}
              status={errors.address ? 'danger' : 'basic'}
              caption={errors.address}
              style={[styles.input, errors.address ? styles.inputError : null]}
              textStyle={{ color: styles.input.color }}
            />
            <Input
              placeholder="Número de Teléfono"
              keyboardType="phone-pad"
              value={form.phoneNumber}
              onChangeText={(phoneNumber) => setForm({ ...form, phoneNumber })}
              status={errors.phoneNumber ? 'danger' : 'basic'}
              caption={errors.phoneNumber}
              style={[styles.input, errors.phoneNumber ? styles.inputError : null]}
              textStyle={{ color: styles.input.color }}
            />
            {/* Otros inputs si es necesario */}
          </Layout>

          {/* Botón Registrar Establecimiento */}
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

export default EstablishmentRegisterScreen;
