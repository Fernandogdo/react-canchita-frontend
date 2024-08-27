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
import {
  getProvinces,
  getCantonsByProvince,
} from '../../../actions/provinces/get-provinces-cantons';
import {Picker} from '@react-native-picker/picker';
import {Province, Canton} from '../../../domain/entities/province';
import {useDebounce} from 'use-debounce';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

interface Props
  extends StackScreenProps<
    RootStackParams,
    'EstablishmentRegisterScreenStep2'
  > {}

export const EstablishmentRegisterScreenStep2 = ({
  route,
  navigation,
}: Props) => {
  const {userId, email, form: initialForm} = route.params;

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

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cantons, setCantons] = useState<Canton[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<
    number | undefined
  >();
  const [selectedCanton, setSelectedCanton] = useState<number | undefined>();
  const [selectedMarker, setSelectedMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const {createEstablishment} = useEstablishmentStore();

  const mapRef = useRef<MapView>(null);

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

  const [debouncedProvince] = useDebounce(selectedProvince, 300);

  useEffect(() => {
    const fetchCantons = async () => {
      if (debouncedProvince) {
        try {
          const cantonsData = await getCantonsByProvince(debouncedProvince);
          setCantons(cantonsData);
          setSelectedCanton(undefined);
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
  }, [debouncedProvince]);

  const onMapPress = (event: any) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setSelectedMarker({latitude, longitude});
    setForm({
      ...form,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      google_address: `https://www.google.com/maps/@${latitude},${longitude},17z`, // Aquí 17z es un nivel de zoom apropiado
    });
  };

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
      canton_id: selectedCanton as number,
      address: form.address,
      latitude: form.latitude,
      longitude: form.longitude,
      google_address: form.google_address,
      opening_time: form.opening_time,
      closing_time: form.closing_time,
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

          {/* Campo de búsqueda de Google Places */}
          <GooglePlacesAutocomplete
            placeholder="Buscar lugar"
            onPress={(data, details = null) => {
              if (details && details.geometry) {
                const {lat, lng} = details.geometry.location;
                setSelectedMarker({latitude: lat, longitude: lng});
                setForm({
                  ...form,
                  latitude: lat.toString(),
                  longitude: lng.toString(),
                  google_address: `https://www.google.com/maps/@${lat},${lng},17z`,
                });

                // Mueve elmapa a la nueva ubicación
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
              key: 'AIzaSyDVE1zdOKRl0WUtdi5738Zi_lwoe1u6Psc',
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
                backgroundColor: '#282626', // Color de fondo 
                borderTopWidth: 0,
                borderBottomWidth: 0,
                marginVertical: 10,
                marginHorizontal: 9,
                borderRadius: 20,
                borderColor: '#fff', // Borde blanco inputs
              },
              textInput: {
                height: 40,
                color: 'white', // Asegura que el texto sea visible
                fontSize: 16,
                paddingHorizontal: 10,
                backgroundColor: '#282626', // Fondo oscuro
              },
              listView: {
                backgroundColor: 'white',
                borderRadius: 10,
                marginHorizontal: 9,
              },
              description: {
                color: '#7f7c7c', // Color de texto para las sugerencias
              },
            }}
          />

          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{height: 400, marginVertical: 20}}
            region={{
              latitude: selectedMarker ? selectedMarker.latitude : -2.897095,
              longitude: selectedMarker ? selectedMarker.longitude : -79.021482,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
            zoomEnabled={true}
            scrollEnabled={true}
            showsUserLocation={true}
            followsUserLocation={true}
            onPress={onMapPress}>
            {selectedMarker && (
              <Marker
                coordinate={selectedMarker}
                title="Ubicación seleccionada"
                description="Presiona para ajustar"
              />
            )}
          </MapView>

          <Layout style={[styles.fondoPrincipal, {marginTop: 20}]}>
            <View
              style={[
                styles.input,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 5,
                  marginHorizontal: 9,
                  height: 40,
                },
              ]}>
              <MyIcon name="map-outline" style={{marginLeft: 6}} white />
              <Picker
                selectedValue={selectedProvince}
                onValueChange={itemValue => setSelectedProvince(itemValue)}
                style={{color: '#7f7c7c', flex: 1}}
                dropdownIconColor="white">
                <Picker.Item
                  label="Selecciona una provincia"
                  value={undefined}
                  color="#a4a4a4"
                />
                {provinces.map(province => (
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
                  marginVertical: 5,
                  marginHorizontal: 9,
                  height: 40,
                },
              ]}>
              <MyIcon name="map-outline" style={{marginLeft: 6}} white />
              <Picker
                selectedValue={selectedCanton}
                onValueChange={itemValue => setSelectedCanton(itemValue)}
                style={{color: '#7f7c7c', flex: 1}}
                dropdownIconColor="white">
                <Picker.Item
                  label="Selecciona un cantón"
                  value={undefined}
                  color="#a4a4a4"
                />
                {cantons.map(canton => (
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
