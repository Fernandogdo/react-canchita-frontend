import React, { useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { styles } from './styles'; // Importa los estilos

interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'> {}

export const RegisterScreen = ({ navigation }: Props) => {
  const { register } = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [isFocused, setIsFocused] = useState({
    fullName: false,
    email: false,
    password: false,
  });

  const onRegister = async () => {
    if (form.fullName.length === 0 || form.email.length === 0 || form.password.length === 0) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    setIsPosting(true);
    const wasSuccessful = await register(form.fullName, form.email, form.password);
    setIsPosting(false);

    if (wasSuccessful) {
      navigation.navigate('LoginScreen');
      return;
    }

    Alert.alert('Error', 'Error al crear la cuenta');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Layout style={styles.containerCentered}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Layout style={{ paddingBottom: 20 }}>
            <Text category="h1">Crear cuenta</Text>
            <Text category="p2">Por favor, crea una cuenta para continuar</Text>
          </Layout>

          {/* Inputs */}
          <Layout style={{ marginTop: 20 }}>
            <Input
              placeholder="Nombre completo"
              accessoryLeft={<MyIcon name="person-outline" />}
              value={form.fullName}
              onChangeText={(fullName) => setForm({ ...form, fullName })}
              onFocus={() => setIsFocused({ ...isFocused, fullName: true })}
              onBlur={() => setIsFocused({ ...isFocused, fullName: false })}
              style={[
                styles.input,
                isFocused.fullName && styles.inputFocused,
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
            <Input
              placeholder="Contraseña"
              autoCapitalize="none"
              secureTextEntry
              accessoryLeft={<MyIcon name="lock-outline" />}
              value={form.password}
              onChangeText={(password) => setForm({ ...form, password })}
              onFocus={() => setIsFocused({ ...isFocused, password: true })}
              onBlur={() => setIsFocused({ ...isFocused, password: false })}
              style={[
                styles.input,
                isFocused.password && styles.inputFocused,
              ]}
            />
          </Layout>

          {/* Space */}
          <Layout style={{ height: 10 }} />

          {/* Button */}
          <Layout>
            <Button
              style={styles.button}
              disabled={isPosting}
              accessoryRight={<MyIcon name="arrow-forward-outline" white />}
              onPress={onRegister}
            >
              Crear
            </Button>
          </Layout>

          {/* Mostrar datos del formulario */}
          <Layout style={{ marginTop: 20 }}>
            <Text>Datos del formulario:</Text>
            <Text>{JSON.stringify(form, null, 2)}</Text>
          </Layout>

          {/* Información para crear cuenta */}
          <Layout style={{ height: 50 }} />

          <Layout
            style={{
              alignItems: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Text>¿Ya tienes cuenta?</Text>
            <Text
              style={styles.textButton}
              status="primary"
              category="s1"
              onPress={() => navigation.goBack()}
            >
              {' '}
              ingresar{' '}
            </Text>
          </Layout>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
};
