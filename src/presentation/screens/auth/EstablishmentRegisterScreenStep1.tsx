import React, { useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { styles } from '../styles';
import Toast from 'react-native-toast-message';
import { MyIcon } from '../../components/ui/MyIcon';
import { TimePicker } from '../../components/ui/TimePicker';
import { RootStackParams } from '../../navigation/StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'EstablishmentRegisterScreenStep1'> {}

export const EstablishmentRegisterScreenStep1 = ({ route, navigation }: Props) => {
  const { userId, email } = route.params;

  const [form, setForm] = useState({
    establishmentName: '',
    description: '',
    ruc: '',
    opening_time: '',
    closing_time: '',
  });

  const [errors, setErrors] = useState({
    establishmentName: '',
    description: '',
    ruc: '',
    opening_time: '',
    closing_time: '',
  });

  const validateFields = () => {
    let valid = true;
    const newErrors = {
      establishmentName: '',
      description: '',
      ruc: '',
      opening_time: '',
      closing_time: '',
    };

    if (form.establishmentName.length === 0) {
      newErrors.establishmentName = 'El nombre del establecimiento es obligatorio';
      valid = false;
    }

    if (form.description.length === 0) {
      newErrors.description = 'La descripción es obligatoria';
      valid = false;
    }

    if (form.ruc.length === 0) {
      newErrors.ruc = 'El RUC es obligatorio';
      valid = false;
    }

    if (form.opening_time.length === 0) {
      newErrors.opening_time = 'La hora de apertura es obligatoria';
      valid = false;
    }

    if (form.closing_time.length === 0) {
      newErrors.closing_time = 'La hora de cierre es obligatoria';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const onNextStep = () => {
    if (!validateFields()) {
      Toast.show({
        type: 'error',
        text1: 'Errores en el formulario',
        text2: 'Por favor, revisa los campos resaltados',
      });
      return;
    }

    // Navegar a la segunda pantalla pasando el formulario y los datos del usuario
    navigation.navigate('EstablishmentRegisterScreenStep2', {
      userId,
      email,
      form,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Layout style={styles.containerCentered}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Layout style={[styles.fondoPrincipal, { paddingBottom: 10 }]}>
            <Text style={styles.textoBase} category="h4">Registra tu Establecimiento</Text>
            <Text style={styles.textoBase} category="p2">Por favor, completa los datos de tu establecimiento</Text>
          </Layout>

          <Layout style={[styles.fondoPrincipal, { marginTop: 20 }]}>
            <Input
              placeholder="Nombre del Establecimiento"
              accessoryLeft={<MyIcon name="briefcase-outline" white />}
              value={form.establishmentName}
              onChangeText={(establishmentName) => setForm({ ...form, establishmentName })}
              status={errors.establishmentName ? 'danger' : 'basic'}
              caption={errors.establishmentName}
              style={[styles.input, errors.establishmentName ? styles.inputError : null]}
              textStyle={{ color: styles.input.color }}
            />
            <Input
              placeholder="Descripción"
              accessoryLeft={<MyIcon name="file-text-outline" white />}
              value={form.description}
              onChangeText={(description) => setForm({ ...form, description })}
              status={errors.description ? 'danger' : 'basic'}
              caption={errors.description}
              style={[styles.input, errors.description ? styles.inputError : null]}
              textStyle={{ color: styles.input.color }}
            />
            <Input
              placeholder="RUC"
              accessoryLeft={<MyIcon name="hash-outline" white />}
              value={form.ruc}
              onChangeText={(ruc) => setForm({ ...form, ruc })}
              status={errors.ruc ? 'danger' : 'basic'}
              caption={errors.ruc}
              style={[styles.input, errors.ruc ? styles.inputError : null]}
              textStyle={{ color: styles.input.color }}
            />

            <TimePicker
              label="Hora de Apertura"
              placeholder="Selecciona la hora"
              value={form.opening_time}
              onChange={(time) => setForm({ ...form, opening_time: time })}
              error={errors.opening_time}
              style={[styles.input, errors.opening_time ? styles.inputError : null]}
            />

            <TimePicker
              label="Hora de Cierre"
              placeholder="Selecciona la hora"
              value={form.closing_time}
              onChange={(time) => setForm({ ...form, closing_time: time })}
              error={errors.closing_time}
              style={[styles.input, errors.closing_time ? styles.inputError : null]}
            />
          </Layout>

          <Layout style={[styles.fondoPrincipal, { height: 15 }]} />

          <Layout style={styles.fondoPrincipal}>
            <Button
              style={styles.button}
              onPress={onNextStep}
              accessoryRight={<MyIcon name="arrow-forward-outline" white />}
            >
              Siguiente
            </Button>
          </Layout>
        </ScrollView>
      </Layout>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default EstablishmentRegisterScreenStep1;
