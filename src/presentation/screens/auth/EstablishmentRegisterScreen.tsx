import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { MyIcon } from '../../components/ui/MyIcon';
import { styles } from '../styles'; // Importa los estilos

interface Props extends StackScreenProps<RootStackParams, 'EstablishmentRegisterScreen'> {}

export const EstablishmentRegisterScreen = ({ navigation }: Props) => {
  const [form, setForm] = useState({
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
    if (form.establishmentName.length === 0 || form.address.length === 0 || form.phone.length === 0 || form.email.length === 0) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
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
          <Layout style={{ paddingBottom: 20 }}>
            <Text category="h1">Registrar Establecimiento</Text>
            <Text category="p2">Por favor, ingrese la información del establecimiento</Text>
          </Layout>

          {/* Inputs */}
          <Layout style={{ marginTop: 20 }}>
            <Input
              placeholder="Nombre del Establecimiento"
              accessoryLeft={<MyIcon name="home-outline" />}
              value={form.establishmentName}
              onChangeText={(establishmentName) => setForm({ ...form, establishmentName })}
              onFocus={() => setIsFocused({ ...isFocused, establishmentName: true })}
              onBlur={() => setIsFocused({ ...isFocused, establishmentName: false })}
              style={[
                styles.input,
                isFocused.establishmentName && styles.inputFocused,
              ]}
            />
            <Input
              placeholder="Dirección"
              accessoryLeft={<MyIcon name="email-outline" />}
              value={form.address}
              onChangeText={(address) => setForm({ ...form, address })}
              onFocus={() => setIsFocused({ ...isFocused, address: true })}
              onBlur={() => setIsFocused({ ...isFocused, address: false })}
              style={[
                styles.input,
                isFocused.address && styles.inputFocused,
              ]}
            />
            <Input
              placeholder="Teléfono"
              keyboardType="phone-pad"
              accessoryLeft={<MyIcon name="phone-outline" />}
              value={form.phone}
              onChangeText={(phone) => setForm({ ...form, phone })}
              onFocus={() => setIsFocused({ ...isFocused, phone: true })}
              onBlur={() => setIsFocused({ ...isFocused, phone: false })}
              style={[
                styles.input,
                isFocused.phone && styles.inputFocused,
              ]}
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
              style={[
                styles.input,
                isFocused.email && styles.inputFocused,
              ]}
            />
          </Layout>

          {/* Space */}
          <Layout style={{ height: 10 }} />

          {/* Button */}
          <Layout>
            <Button
              style={styles.button}
              onPress={onRegisterEstablishment}
            >
              Registrar Establecimiento
            </Button>
          </Layout>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
};
