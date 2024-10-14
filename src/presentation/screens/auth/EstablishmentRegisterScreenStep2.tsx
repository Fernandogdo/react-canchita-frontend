import React, {useEffect, useState, useRef} from 'react';
import {Button, Input, Layout, Text} from '@ui-kitten/components';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {styles} from '../styles';
import Toast from 'react-native-toast-message';
import {MyIcon} from '../../components/ui/MyIcon';
import {useEstablishmentStore} from '../../store/establishment/useEstablishmentStore';
import {RootStackParams} from '../../navigation/StackNavigator';
import {Picker} from '@react-native-picker/picker';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import axios from 'axios';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import CustomMapView from '../../components/maps/CustomMapView';
import {Establishment} from '../../../domain/entities/establishment';

interface Props
  extends StackScreenProps<
    RootStackParams,
    'EstablishmentRegisterScreenStep2'
  > {}

const GOOGLE_API_KEY = 'AIzaSyDVE1zdOKRl0WUtdi5738Zi_lwoe1u6Psc'; // Clave de API de Google

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type FormType = {
  establishmentName?: string;
  description?: string;
  ruc?: string;
  address: string;
  latitude: string;
  longitude: string;
  google_address: string;
  province: string;
  canton: string;
  opening_time?: string;
  closing_time?: string;
};

export const EstablishmentRegisterScreenStep2 = ({
  route,
  navigation,
}: Props) => {
  const {userId, email, form: initialForm} = route.params;

  const [form, setForm] = useState<FormType>({
    ...initialForm,
    address: '', // Permitir que el usuario lo edite manualmente
    latitude: '',
    longitude: '',
    google_address: '',
    province: '',
    canton: '',
  });

  const [errors, setErrors] = useState({
    address: '',
    latitude: '',
    longitude: '',
    google_address: '',
    province: '',
    canton: '',
  });

  const [selectedMarker, setSelectedMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const {createEstablishment} = useEstablishmentStore();
  const mapRef = useRef<MapView>(null);

  const onMapPress = async (event: any) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setSelectedMarker({latitude, longitude});

    // Actualiza el estado form con latitud, longitud y google_address
    setForm({
      ...form,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      google_address: `https://www.google.com/maps/@${latitude},${longitude},17z`,
    });

    console.log('Latitud:', latitude, 'Longitud:', longitude);

    // Realiza la solicitud de Geocoding para obtener la provincia y el cantón
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`,
      );

      if (response.data.results.length > 0) {
        const addressComponents = response.data.results[0].address_components;
        let province = '';
        let canton = '';

        // Itera sobre los componentes de la dirección para encontrar la provincia y el cantón
        addressComponents.forEach((component: AddressComponent) => {
          if (component.types.includes('administrative_area_level_1')) {
            province = component.long_name;
          } else if (component.types.includes('administrative_area_level_2')) {
            canton = component.long_name;
          }
        });

        // Actualiza el estado form con provincia y cantón
        setForm((prevForm: FormType) => ({
          ...prevForm,
          province,
          canton,
        }));

        // Mostrar en consola lo que se está obteniendo
        console.log('Provincia:', province, 'Cantón:', canton);

        Toast.show({
          type: 'success',
          text1: 'Ubicación Obtenida',
          text2: `Provincia: ${province}, Cantón: ${canton}`,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo obtener la dirección de esta ubicación.',
        });
      }
    } catch (error) {
      console.error('Error en Geocoding:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo obtener la provincia y cantón.',
      });
    }
  };

  const validateFields = () => {
    let valid = true;
    const newErrors = {
      address: '',
      latitude: '',
      longitude: '',
      google_address: '',
      province: '',
      canton: '',
    };

    if (!form.latitude || !form.longitude) {
      newErrors.latitude = 'La latitud y longitud son obligatorias';
      newErrors.longitude = 'La latitud y longitud son obligatorias';
      valid = false;
    }

    if (!form.province || !form.canton) {
      newErrors.province = 'La provincia es obligatoria';
      newErrors.canton = 'El cantón es obligatorio';
      valid = false;
    }

    if (!form.address) {
      newErrors.address = 'La dirección es obligatoria';
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

    const establishment: Establishment = {
      user_id: userId,
      name: form.establishmentName || '',
      description: form.description || '',
      ruc: form.ruc || '',
      province: form.province, // Provincia añadida
      canton: form.canton, // Cantón añadido
      address: form.address,
      latitude: form.latitude,
      longitude: form.longitude,
      google_address: form.google_address,
      opening_time: form.opening_time || '09:00:00',
      closing_time: form.closing_time || '22:00:00',
    };

    const wasSuccessful = await createEstablishment(establishment);
    if (wasSuccessful) {
      navigation.navigate('ValidationScreen', {
        email,
        user_id: userId.toString(),
      });
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
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Layout style={styles.containerCentered}>
        <View style={styles.scrollViewContent}>
          <Layout style={[styles.fondoPrincipal, {paddingBottom: 10}]}>
            <Text style={styles.textoBase} category="h4">
              Completa los Datos del Establecimiento
            </Text>
            <Text style={styles.textoBase} category="p2">
              Completa la información restante del establecimiento
            </Text>
          </Layout>

          <GooglePlacesAutocomplete
            placeholder="Buscar lugar"
            onPress={async (data, details = null) => {
              if (details && details.geometry) {
                const {lat, lng} = details.geometry.location;
                setSelectedMarker({latitude: lat, longitude: lng});

                // Actualiza el estado form con latitud, longitud y google_address
                setForm({
                  ...form,
                  latitude: lat.toString(),
                  longitude: lng.toString(),
                  google_address: `https://www.google.com/maps/@${lat},${lng},17z`,
                });

                console.log('Latitud:', lat, 'Longitud:', lng);

                // Realiza la solicitud de Geocoding para obtener la provincia y el cantón
                try {
                  const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`,
                  );

                  if (response.data.results.length > 0) {
                    const addressComponents =
                      response.data.results[0].address_components;
                    let province = '';
                    let canton = '';

                    // Itera sobre los componentes de la dirección para encontrar la provincia y el cantón
                    addressComponents.forEach((component: AddressComponent) => {
                      if (
                        component.types.includes('administrative_area_level_1')
                      ) {
                        province = component.long_name;
                      } else if (
                        component.types.includes('administrative_area_level_2')
                      ) {
                        canton = component.long_name;
                      }
                    });

                    // Actualiza el estado form con provincia y cantón
                    setForm((prevForm: FormType) => ({
                      ...prevForm,
                      province,
                      canton,
                    }));

                    // Mostrar en consola lo que se está obteniendo
                    console.log('Provincia:', province, 'Cantón:', canton);

                    Toast.show({
                      type: 'success',
                      text1: 'Ubicación Obtenida',
                      text2: `Provincia: ${province}, Cantón: ${canton}`,
                    });
                  } else {
                    Toast.show({
                      type: 'error',
                      text1: 'Error',
                      text2:
                        'No se pudo obtener la dirección de esta ubicación.',
                    });
                  }
                } catch (error) {
                  console.error('Error en Geocoding:', error);
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'No se pudo obtener la provincia y cantón.',
                  });
                }

                // Mueve el mapa a la nueva ubicación
                mapRef.current?.animateCamera({
                  center: {
                    latitude: lat,
                    longitude: lng,
                  },
                  zoom: 15,
                });
              }
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: 'es',
            }}
            fetchDetails={true}
            styles={{
              container: {
                flex: 0,
                zIndex: 1,
                width: '100%',
              },
              textInputContainer: {
                backgroundColor: '#282626',
                borderTopWidth: 0,
                borderBottomWidth: 0,
                marginVertical: 10,
                marginHorizontal: 9,
                borderRadius: 20,
                borderColor: '#fff',
              },
              textInput: {
                height: 40,
                color: 'white',
                fontSize: 16,
                paddingHorizontal: 10,
                backgroundColor: '#282626',
              },
              listView: {
                backgroundColor: 'white',
                borderRadius: 10,
                marginHorizontal: 9,
              },
              description: {
                color: '#7f7c7c',
              },
            }}
          />

          <CustomMapView
            initialLatitude={-2.897095}
            initialLongitude={-79.021482}
            selectedMarker={selectedMarker}
            onMapPress={onMapPress}
            mapHeight="45%"
          />

          <Layout style={[styles.fondoPrincipal, {marginTop: 20}]}>
            <Input
              placeholder="Dirección"
              accessoryLeft={<MyIcon name="pin-outline" white />}
              value={form.address}
              onChangeText={address => setForm({...form, address})}
              status={errors.address ? 'danger' : 'basic'}
              caption={errors.address}
              style={[styles.input, errors.address ? styles.inputError : null]}
              textStyle={{color: styles.input.color}}
            />
          </Layout>

          <Layout style={[styles.fondoPrincipal, {height: 15}]} />

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
              }}>
              <MyIcon name="checkmark-circle-2-outline" white />
              <Text style={{color: 'white', marginLeft: 10}}>
                Registrar Establecimiento
              </Text>
            </TouchableOpacity>
          </Layout>
        </View>
      </Layout>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default EstablishmentRegisterScreenStep2;
