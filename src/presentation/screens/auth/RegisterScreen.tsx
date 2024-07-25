import React, { useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { styles } from './styles'; // Importa los estilos

interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'> {}

export const RegisterScreen = ({ navigation }: Props) => {
  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    password: false,
  });

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
              onFocus={() => setIsFocused({ ...isFocused, name: true })}
              onBlur={() => setIsFocused({ ...isFocused, name: false })}
              style={[
                styles.input,
                isFocused.name && styles.inputFocused,
              ]}
            />
            <Input
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              accessoryLeft={<MyIcon name="email-outline" />}
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
              accessoryRight={<MyIcon name="arrow-forward-outline" white />}
              onPress={() => {}}>
              Crear
            </Button>
          </Layout>

          {/* Información para crear cuenta */}
          <Layout style={{ height: 50 }} />

          <Layout
            style={{
              alignItems: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text>¿Ya tienes cuenta?</Text>
            <Text
              style={styles.textButton}
              status="primary"
              category="s1"
              onPress={() => navigation.goBack()}>
              {' '}
              ingresar{' '}
            </Text>
          </Layout>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
};
