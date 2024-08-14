import React, { useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { styles } from '../styles';
import Toast from 'react-native-toast-message';
import { MyIcon } from '../../components/ui/MyIcon';
import { useEstablishmentStore } from '../../store/establishment/useEstablishmentStore';
import { RootStackParams } from '../../navigation/StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'EstablishmentRegisterScreenStep2'> {}

export const EstablishmentRegisterScreenStep2 = ({ route, navigation }: Props) => {
  const { userId, email, form: initialForm } = route.params;

  const [form, setForm] = useState({
    ...initialForm, // Incluir los datos de la primera pantalla
    address: '',
    latitude: '',
    longitude: '',
    google_address: '',
  });

  const [errors, setErrors] = useState({
    address: '',
    latitude: '',
    longitude: '',
    google_address: '',
  });

  const { createEstablishment } = useEstablishmentStore();

  const validateFields = () => {
    let valid = true;
    const newErrors = {
      address: '',
      latitude: '',
      longitude: '',
      google_address: '',
    };

    if (form.address.length === 0) {
      newErrors.address = 'La dirección es obligatoria';
      valid = false;
    }

    if (form.latitude.length === 0) {
      newErrors.latitude = 'La latitud es obligatoria';
      valid = false;
    }

    if (form.longitude.length === 0) {
      newErrors.longitude = 'La longitud es obligatoria';
      valid = false;
    }

    if (form.google_address.length === 0) {
      newErrors.google_address = 'La dirección de Google es obligatoria';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const onRegisterEstablishment = async () => {
    if (!validateFields()) {
      Toast.show({
        type: 'error',
        text1: 'Errores en el formulario',
        text2: 'Por favor, revisa los campos resaltados',
      });
      return;
    }

    const establishment = {
      user_id: userId,
      name: form.establishmentName,
      description: form.description,
      ruc: form.ruc,
      canton_id: 1, // Puedes ajustar esto según sea necesario
      address: form.address,
      latitude: form.latitude,
      longitude: form.longitude,
      google_address: form.google_address,
      opening_time: form.opening_time,
      closing_time: form.closing_time,
    };

    const wasSuccessful = await createEstablishment(establishment);
    if (wasSuccessful) {
      navigation.navigate('ValidationScreen', { email });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al crear el establecimiento',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Layout style={styles.containerCentered}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Layout style={[styles.fondoPrincipal, { paddingBottom: 10 }]}>
            <Text style={styles.textoBase} category="h4">Completa los Datos del Establecimiento</Text>
            <Text style={styles.textoBase} category="p2">Completa la información restante del establecimiento</Text>
          </Layout>

          <Layout style={[styles.fondoPrincipal, { marginTop: 20 }]}>
            <Input
              placeholder="Dirección"
              accessoryLeft={<MyIcon name="pin-outline" white />}
              value={form.address}
              onChangeText={(address) => setForm({ ...form, address })}
              status={errors.address ? 'danger' : 'basic'}
              caption={errors.address}
              style={[styles.input, errors.address ? styles.inputError : null]}
              textStyle={{ color: styles.input.color }}
            />
            <Input
              placeholder="Latitud"
              accessoryLeft={<MyIcon name="compass-outline" white />}
              value={form.latitude}
              onChangeText={(latitude) => setForm({ ...form, latitude })}
              keyboardType="decimal-pad"
              status={errors.latitude ? 'danger' : 'basic'}
              caption={errors.latitude}
              style={[styles.input, errors.latitude ? styles.inputError : null]}
              textStyle={{ color: styles.input.color }}
            />
            <Input
              placeholder="Longitud"
              accessoryLeft={<MyIcon name="compass-outline" white />}
              value={form.longitude}
              onChangeText={(longitude) => setForm({ ...form, longitude })}
              keyboardType="decimal-pad"
              status={errors.longitude ? 'danger' : 'basic'}
              caption={errors.longitude}
              style={[styles.input, errors.longitude ? styles.inputError : null]}
              textStyle={{ color: styles.input.color }}
            />
            <Input
              placeholder="Dirección de Google Maps"
              accessoryLeft={<MyIcon name="map-outline" white />}
              value={form.google_address}
              onChangeText={(google_address) => setForm({ ...form, google_address })}
              status={errors.google_address ? 'danger' : 'basic'}
              caption={errors.google_address}
              style={[styles.input, errors.google_address ? styles.inputError : null]}
              textStyle={{ color: styles.input.color }}
            />
          </Layout>

          <Layout style={[styles.fondoPrincipal, { height: 15 }]} />

          <Layout style={styles.fondoPrincipal}>
            <Button
              style={styles.button}
              onPress={onRegisterEstablishment}
              accessoryRight={<MyIcon name="checkmark-circle-2-outline" white />}
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

export default EstablishmentRegisterScreenStep2;
