import React, { useEffect, useState } from 'react';
import { Button, Input, Layout, Text} from '@ui-kitten/components'; // Importa `View` si no lo tienes ya
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native'; // Importa `TouchableOpacity` si no lo tienes ya
import { StackScreenProps } from '@react-navigation/stack';
import { styles } from '../styles';
import Toast from 'react-native-toast-message';
import { MyIcon } from '../../components/ui/MyIcon';
import { useEstablishmentStore } from '../../store/establishment/useEstablishmentStore';
import { RootStackParams } from '../../navigation/StackNavigator';
import { getProvinces, getCantonsByProvince } from '../../../actions/provinces/get-provinces-cantons';
import { Picker } from '@react-native-picker/picker';
import { Province, Canton } from '../../../domain/entities/province';  // Importa la interfaz Province

interface Props extends StackScreenProps<RootStackParams, 'EstablishmentRegisterScreenStep2'> {}

export const EstablishmentRegisterScreenStep2 = ({ route, navigation }: Props) => {
  const { userId, email, form: initialForm } = route.params;

  const [form, setForm] = useState({
    ...initialForm,
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

  const [provinces, setProvinces] = useState<Province[]>([]);  // Usa la interfaz Province
  const [cantons, setCantons] = useState<Canton[]>([]);        // Usa la interfaz Canton
  const [selectedProvince, setSelectedProvince] = useState<number | undefined>();
  const [selectedCanton, setSelectedCanton] = useState<number | undefined>();

  const { createEstablishment } = useEstablishmentStore();

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provincesData = await getProvinces();
        setProvinces(provincesData);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudieron cargar las provincias',
        });
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchCantons = async () => {
      if (selectedProvince) {
        try {
          const cantonsData = await getCantonsByProvince(selectedProvince);
          setCantons(cantonsData);
          setSelectedCanton(undefined); // Resetear el cantón seleccionado al cambiar la provincia
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'No se pudieron cargar los cantones',
          });
        }
      }
    };

    fetchCantons();
  }, [selectedProvince]);

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

    if (!selectedCanton) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Debes seleccionar un cantón',
      });
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
      canton_id: selectedCanton as number, // Asegura que canton_id es un número
      address: form.address,
      latitude: form.latitude,
      longitude: form.longitude,
      google_address: form.google_address,
      opening_time: form.opening_time,
      closing_time: form.closing_time,
    };

    const wasSuccessful = await createEstablishment(establishment);
    if (wasSuccessful) {
      navigation.navigate('ValidationScreen', { email, user_id: userId.toString() });
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
            <View
              style={[
                styles.input,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                  marginBottom: 5,
                  marginLeft: 9,
                  marginRight: 9,
                  paddingVertical: 0,
                  height: 40,
                },
              ]}
            >
              <MyIcon name="map-outline" style={{ marginLeft: 6 }} white />
              <Picker
                selectedValue={selectedProvince}
                onValueChange={(itemValue) => setSelectedProvince(itemValue)}
                style={{ color: '#7f7c7c', flex: 1 }}
                dropdownIconColor="white"
              >
                <Picker.Item label="Selecciona una provincia" value={undefined} color="#a4a4a4" />
                {provinces.map((province) => (
                  <Picker.Item
                    key={province.id}
                    label={province.description}
                    value={province.id}
                    color="#a4a4a4"
                  />
                ))}
              </Picker>
            </View>

            <View
              style={[
                styles.input,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                  marginBottom: 5,
                  marginLeft: 9,
                  marginRight: 9,
                  paddingVertical: 0,
                  height: 40,
                },
              ]}
            >
              <MyIcon name="map-outline" style={{ marginLeft: 6 }} white />
              <Picker
                selectedValue={selectedCanton}
                onValueChange={(itemValue) => setSelectedCanton(itemValue)}
                style={{ color: '#7f7c7c', flex: 1 }}
                dropdownIconColor="white"
              >
                <Picker.Item label="Selecciona un cantón" value={undefined} color="#a4a4a4" />
                {cantons.map((canton) => (
                  <Picker.Item
                    key={canton.id}
                    label={canton.description}
                    value={canton.id}
                    color="#a4a4a4"
                  />
                ))}
              </Picker>
            </View>

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
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onRegisterEstablishment}
              style={{
                backgroundColor: '#5BA246',
                borderRadius: 20,
                padding: 15,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
            >
              <MyIcon name="checkmark-circle-2-outline" white />
              <Text style={{ color: 'white', marginLeft: 10 }}>Registrar Establecimiento</Text>
            </TouchableOpacity>
          </Layout>
        </ScrollView>
      </Layout>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default EstablishmentRegisterScreenStep2;
