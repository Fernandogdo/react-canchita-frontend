import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { Layout, Button } from '@ui-kitten/components';
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../navigation/StackNavigator";
import { ScrollView } from 'react-native-gesture-handler';
import { styles } from '../styles';

interface Props extends StackScreenProps<RootStackParams, 'ValidationScreen'> {}

export const ValidationScreen = ({ navigation }: Props) => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text.slice(0, 1); // Solo permite un carácter por campo
    }

    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);

    // Mover al siguiente input automáticamente
    if (text !== '' && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Si se completaron todos los campos, imprimir el PIN en la consola
    if (index === 5 && text !== '') {
      console.log('Código PIN completo:', newPin.join(''));
      // Aquí puedes agregar la lógica para enviar el PIN automáticamente
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Layout style={localStyles.containerCentered}>
        <ScrollView contentContainerStyle={localStyles.scrollViewContent}>
          <Text style={localStyles.headerText}>Ingrese código envisado a</Text>
          <Text style={localStyles.subText}>Agregue un número PIN para hacer su cuenta más segura.</Text>

          <View style={localStyles.pinContainer}>
            {pin.map((_, index) => (
              <TextInput
                key={index}
                style={localStyles.pinInput}
                onChangeText={(text) => handleChange(text, index)}
                value={pin[index]}
                keyboardType="number-pad"
                maxLength={1}
                ref={(input) => inputs.current[index] = input}
                autoFocus={index === 0}
              />
            ))}
          </View>

          <Button style={styles.button} onPress={() => console.log('Código PIN:', pin.join(''))}>
            Validar Código
          </Button>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
};

const localStyles = StyleSheet.create({
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E', // Color de fondo
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    color: '#9C9C9E',
    marginBottom: 40,
    textAlign: 'center',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  pinInput: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    textAlign: 'center',
    fontSize: 24,
    color: '#FFFFFF',
    backgroundColor: '#2C2C2E',
  },
  continueButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 25,
    width: '80%',
  },
});

export default ValidationScreen;