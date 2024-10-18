import React, {useState, useEffect} from 'react';
import {
  Alert,
  BackHandler,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {Layout, Text, Button, Input} from '@ui-kitten/components';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParams} from '../../navigation/StackNavigator';
import {useAuthStore} from '../../store/auth/useAuthStore';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Slider from '@react-native-community/slider'; // Importamos el slider
import {MyIcon} from '../../components/ui/MyIcon';
import {Calendar, DateData} from 'react-native-calendars'; // Importamos el calendario
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Importamos el DateTimePicker
import {useEstablishmentStore} from '../../store/establishment/useEstablishmentStore';

// Arreglo de ubicaciones con las coordenadas
// const locations = [
//   {
//     user_id: 2,
//     name: 'Los peluches2',
//     description:
//       'Cancha de uso múltiple con techo, tiene de basket y fútbol sintética y también disponible de pádel',
//     latitude: -2.900456,
//     longitude: -79.004563,
//   },
//   {
//     user_id: 3,
//     name: 'Complejo Deportivo Cuenca',
//     description:
//       'Cancha sintética para fútbol, basket, y otros deportes al aire libre',
//     latitude: -2.902341,
//     longitude: -79.005312,
//   },
//   {
//     user_id: 4,
//     name: 'Deportes Cuenca',
//     description:
//       'Espacio deportivo con acceso a cancha de fútbol sintética y área de entrenamiento',
//     latitude: -2.901245,
//     longitude: -79.006891,
//   },
//   {
//     user_id: 5,
//     name: 'Centro Deportivo Miraflores',
//     description: 'Centro deportivo con cancha sintética y gimnasio',
//     latitude: -2.899854,
//     longitude: -79.008134,
//   },
//   {
//     user_id: 6,
//     name: 'Club Deportivo El Ejido',
//     description:
//       'Cancha de fútbol sintética con iluminación nocturna y servicios adicionales',
//     latitude: -2.902567,
//     longitude: -79.003689,
//   },
//   {
//     user_id: 7,
//     name: 'Parque La Madre',
//     description:
//       'Área recreativa con cancha sintética de fútbol y zona de juegos',
//     latitude: -2.899731,
//     longitude: -79.007456,
//   },
// ];

export const DashboardScreen = () => {
  const {fetchEstablishments, establishments} = useEstablishmentStore();
  const [selectedMarker, setSelectedMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  // Estado para los filtros acumulados
  const [filters, setFilters] = useState({
    minPrice: 10,
    maxPrice: 310,
    selectedSport: null as string | null,
    selectedDates: {} as Record<string, {selected: boolean; marked: boolean}>,
    startTime: null as string | null,
    endTime: null as string | null,
  });

  const [markedDates, setMarkedDates] = useState<
    Record<string, {selected: boolean; marked: boolean}>
  >({});
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const {logout} = useAuthStore();

  // Deportes con íconos
  const sports = [
    {name: 'Fútbol', icon: 'award-outline'},
    {name: 'Básquetbol', icon: 'radio-outline'},
    {name: 'Tenis', icon: 'activity-outline'},
    {name: 'Natación', icon: 'droplet-outline'},
    {name: 'Ciclismo', icon: 'car-outline'},
  ];

  //Obtiene todos los establecimientos
  useEffect(() => {
    const fetchData = async () => {
      await fetchEstablishments();
      console.log('Los establecimientos se han cargado');
    };

    fetchData(); // Llamar solo una vez al montar el componente
  }, [fetchEstablishments]); // Solo se ejecuta al montar o si `fetchEstablishments` cambia

  useEffect(() => {
    // solo se ejecuta cuando `establishments` cambia
    console.log('Establecimientos actualizados:', establishments);
  }, [establishments]);

  // Mostrar los modales de selección de tiempo
  const showStartTimePicker = () => setStartTimePickerVisible(true);
  const hideStartTimePicker = () => setStartTimePickerVisible(false);

  const handleStartTimeConfirm = (time: Date) => {
    setFilters(prev => ({
      ...prev,
      startTime: time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));
    hideStartTimePicker();
  };

  const showEndTimePicker = () => setEndTimePickerVisible(true);
  const hideEndTimePicker = () => setEndTimePickerVisible(false);

  const handleEndTimeConfirm = (time: Date) => {
    setFilters(prev => ({
      ...prev,
      endTime: time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));
    hideEndTimePicker();
  };

  const handleDayPress = (day: DateData) => {
    const newMarkedDates = {...markedDates};
    if (newMarkedDates[day.dateString]) {
      delete newMarkedDates[day.dateString];
    } else {
      newMarkedDates[day.dateString] = {selected: true, marked: true};
    }
    setMarkedDates(newMarkedDates);
    setFilters(prev => ({...prev, selectedDates: newMarkedDates}));
  };

  const onMapPress = (event: any) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setSelectedMarker({latitude, longitude});
  };

  const onLogout = async () => {
    await logout();
    navigation.navigate('LoginScreen');
  };

  const openFilterModal = (filter: string) => {
    setFilterType(filter);
    setModalVisible(true);
  };

  // Función para aplicar todos los filtros al servidor
  const applyAllFilters = async () => {
    console.log('Filtros aplicados:', filters);
  };

  // Validar que el precio mínimo no sea mayor que el máximo
  const handleMinPriceChange = (value: number) => {
    setFilters(prev => ({
      ...prev,
      minPrice: value,
      maxPrice: value > prev.maxPrice ? value : prev.maxPrice,
    }));
  };

  const handleMaxPriceChange = (value: number) => {
    setFilters(prev => ({
      ...prev,
      maxPrice: value,
      minPrice: value < prev.minPrice ? value : prev.minPrice,
    }));
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Salir', '¿Quieres salir de la aplicación?', [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'Salir', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <Layout style={styles.container}>
      {/* Buscador, tabs y botón flotando sobre el mapa */}
      <Layout style={styles.floatingContainer}>
        {/* Buscador */}
        <Input
          style={styles.searchInput}
          placeholder="Buscar aquí"
          accessoryRight={<MyIcon name="search-outline" color="black" />}
          textStyle={{color: 'black'}}
          placeholderTextColor="#A9A9A9"
        />

        {/* Tabs para filtros */}
        <Layout style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.customButton}
            onPress={() => openFilterModal('Precio')}>
            <Text style={styles.customButtonText}>Precio $</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.customButton}
            onPress={() => openFilterModal('Deporte')}>
            <Text style={styles.customButtonText}>Deporte</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.customButton}
            onPress={() => openFilterModal('Disponibilidad')}>
            <Text style={styles.customButtonText}>Disponibilidad</Text>
          </TouchableOpacity>
        </Layout>

        {/* Botón para aplicar todos los filtros */}
        <Button onPress={applyAllFilters} style={styles.applyAllButton}>
          Aplicar Filtros
        </Button>
      </Layout>

      {/* Mapa */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: -2.897095,
          longitude: -79.021482,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        zoomEnabled={true}
        scrollEnabled={true}
        showsUserLocation={true}
        followsUserLocation={true}
        onPress={onMapPress}>
        {/* Iterar sobre los establecimientos traídos desde el backend */}
        {establishments.map(establishment => (
          <Marker
            key={establishment.id} // Usa el id de cada establecimiento como clave
            coordinate={{
              latitude: parseFloat(establishment.latitude), // Asegúrate de que sean números
              longitude: parseFloat(establishment.longitude),
            }}
            title={establishment.name} // Muestra el nombre del establecimiento
            description={establishment.description} // Muestra la descripción del establecimiento
          />
        ))}

        {/* Marcador seleccionado manualmente */}
        {selectedMarker && (
          <Marker
            coordinate={selectedMarker}
            title="Nuevo marcador"
            description="Ubicación seleccionada"
          />
        )}
      </MapView>

      {/* Modales */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {filterType === 'Disponibilidad'
                ? 'Selecciona las Fechas y Horas'
                : filterType === 'Deporte'
                ? 'Selecciona un Deporte'
                : filterType === 'Precio'
                ? 'Rango de precios'
                : 'Sin filtro seleccionado'}
            </Text>

            {filterType === 'Precio' && (
              <View style={styles.priceFilterContainer}>
                <Text style={styles.priceText}>
                  Precio mínimo: ${filters.minPrice}
                </Text>
                <Text style={styles.priceText}>
                  Precio máximo: ${filters.maxPrice}
                </Text>

                <Slider
                  style={styles.slider}
                  minimumValue={10}
                  maximumValue={310}
                  step={1}
                  value={filters.minPrice}
                  onValueChange={value => handleMinPriceChange(value)}
                  minimumTrackTintColor="#1AC71A"
                  maximumTrackTintColor="#000000"
                />

                <Slider
                  style={styles.slider}
                  minimumValue={10}
                  maximumValue={310}
                  step={1}
                  value={filters.maxPrice}
                  onValueChange={value => handleMaxPriceChange(value)}
                  minimumTrackTintColor="#1AC71A"
                  maximumTrackTintColor="#000000"
                />
              </View>
            )}

            {filterType === 'Deporte' && (
              <View style={styles.sportsContainer}>
                {sports.map((sport, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.sportItem}
                    onPress={() =>
                      setFilters(prev => ({...prev, selectedSport: sport.name}))
                    }>
                    <MyIcon name={sport.icon} size={30} color="black" />
                    <Text style={styles.sportText}>{sport.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {filterType === 'Disponibilidad' && (
              <>
                <Calendar
                  onDayPress={handleDayPress}
                  markedDates={markedDates}
                  markingType={'multi-dot'}
                />

                <View style={styles.timePickerContainer}>
                  <Text style={styles.timeText}>
                    Hora de inicio: {filters.startTime || 'Seleccionar'}
                  </Text>
                  <Button
                    onPress={showStartTimePicker}
                    style={styles.modalButton}>
                    Seleccionar hora de inicio
                  </Button>
                  <DateTimePickerModal
                    isVisible={isStartTimePickerVisible}
                    mode="time"
                    onConfirm={handleStartTimeConfirm}
                    onCancel={hideStartTimePicker}
                  />
                </View>

                <View style={styles.timePickerContainer}>
                  <Text style={styles.timeText}>
                    Hora de fin: {filters.endTime || 'Seleccionar'}
                  </Text>
                  <Button
                    onPress={showEndTimePicker}
                    style={styles.modalButton}>
                    Seleccionar hora de fin
                  </Button>
                  <DateTimePickerModal
                    isVisible={isEndTimePickerVisible}
                    mode="time"
                    onConfirm={handleEndTimeConfirm}
                    onCancel={hideEndTimePicker}
                  />
                </View>
              </>
            )}

            <Button
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}>
              Cerrar
            </Button>
          </View>
        </View>
      </Modal>

      {/* Navegación inferior */}
      <Layout style={styles.buttonContainer}>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('ConfigurationScreen')}
          appearance="filled"
          status="primary">
          <MyIcon name="settings-2-outline" white size={32} />
        </Button>
        <Button
          style={styles.largeButton}
          onPress={() => navigation.navigate('HomeScreen')}
          appearance="filled"
          status="primary">
          <MyIcon name="home-outline" white size={50} />
        </Button>
        <Button
          style={styles.button}
          onPress={onLogout}
          appearance="filled"
          status="primary">
          <MyIcon name="menu-outline" white size={32} />
        </Button>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  floatingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Fondo más transparente
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 1000, // Asegura que esté por encima del mapa
  },
  searchInput: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 12,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  customButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  customButtonText: {
    color: '#1AC71A', // El verde que quieres
    fontWeight: 'bold',
  },
  applyAllButton: {
    marginTop: 10,
    backgroundColor: '#000000',
    borderRadius: 20,
    borderColor: '#000000',
  },
  map: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    color: 'black',
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  priceFilterContainer: {
    width: '100%',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 10,
  },
  priceText: {
    fontSize: 16,
    marginBottom: 10,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  sportItem: {
    alignItems: 'center',
    marginBottom: 20,
    width: '30%',
  },
  sportText: {
    marginTop: 10,
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
  },
  timePickerContainer: {
    marginVertical: 10,
  },
  timeText: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalButton: {
    backgroundColor: 'black',
    borderColor: 'black',
    color: 'white',
    borderRadius: 20,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    marginHorizontal: 15,
    backgroundColor: 'black',
    borderColor: 'black',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 12,
  },
  largeButton: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: 'black',
    borderColor: 'black',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});

export default DashboardScreen;
