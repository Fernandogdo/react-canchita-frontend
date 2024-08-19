import React, { useRef, useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Text, Alert, BackHandler } from 'react-native';
import { Layout, Button } from '@ui-kitten/components';
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../navigation/StackNavigator";
import { ScrollView } from 'react-native-gesture-handler';
import { styles } from '../styles';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth/useAuthStore';

interface Props extends StackScreenProps<RootStackParams, 'ValidationScreen'> {}

export const ValidationScreen = ({ route, navigation }: Props) => {
  const { email, user_id } = route.params;  // Asegúrate de que ambos se reciban
  const { validateOtp } = useAuthStore(); // Accede a la función validateOtp del store
  
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text.slice(0, 1); // Solo permite un carácter por campo
    }

    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);

    if (text !== '' && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (index === 5 && text !== '') {
      console.log('Código PIN completo:', newPin.join(''));
    }
  };

  const handleValidate = async () => {
    const pinCode = pin.join('');
    console.log('Código PIN ingresado:', pinCode);

    // Envía el código OTP al servidor
    const response = await validateOtp(pinCode);

    if (response.success) {
      Alert.alert('Éxito', response.message, [
        { text: 'OK', onPress: () => navigation.navigate('LoginScreen') } // Navega a la siguiente pantalla si es necesario
      ]);
    } else {
      Alert.alert('Error', response.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Confirmación",
          "Si no ingresa el código su cuenta no será validada. ¿Está seguro de que desea regresar al Inicio de Sesión?",
          [
            { text: "Cancelar", style: "cancel", onPress: () => {} },
            { text: "Sí", style: "destructive", onPress: () => navigation.navigate('LoginScreen')}
          ]
        );
        return true; // Previene el comportamiento predeterminado
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Layout style={localStyles.containerCentered}>
        <ScrollView contentContainerStyle={localStyles.scrollViewContent}>
          <Text style={localStyles.headerText}>Ingrese código enviado a {email} </Text>
          <Text style={localStyles.subText}>El código fue enviado a su correo para validar su cuenta.</Text>

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

          <Button style={styles.button} onPress={handleValidate}>
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
    backgroundColor: '#000000',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center'
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
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  pinInput: {
    flex: 1,
    height: 60,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    textAlign: 'center',
    fontSize: 24,
    color: '#FFFFFF',
    backgroundColor: '#2C2C2E',
    marginHorizontal: 4,
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
