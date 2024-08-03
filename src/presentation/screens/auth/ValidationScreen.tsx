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
    backgroundColor: '#1C1C1E',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // Añadir un padding para evitar que el contenido se acerque demasiado a los bordes de la pantalla
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
    width: '100%', // Hacer que el contenedor use todo el ancho disponible
    maxWidth: 400, // Limitar el ancho máximo en pantallas más grandes
    paddingHorizontal: 20, // Añadir padding horizontal
    marginBottom: 30,
  },
  pinInput: {
    flex: 1, // Distribuir equitativamente el espacio entre las casillas
    height: 60,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    textAlign: 'center',
    fontSize: 24,
    color: '#FFFFFF',
    backgroundColor: '#2C2C2E',
    marginHorizontal: 4, // Margen entre casillas
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});


export default ValidationScreen;
