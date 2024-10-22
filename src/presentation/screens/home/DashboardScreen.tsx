import React, {useState, useEffect} from 'react';
import {
  Alert,
  BackHandler,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
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
import StarRating from '../../components/establishments/StarRating';

export const DashboardScreen = () => {
  const {fetchEstablishments, establishments} = useEstablishmentStore();
  const [selectedMarker, setSelectedMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [plazasModalVisible, setPlazasModalVisible] = useState(false); // Modal para plazas
  const [filterType, setFilterType] = useState<string | null>(null);
  const [rating, setRating] = useState(3);
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

  // Arreglo de plazas ficticias
  const samplePlazas = [
    {
      establishment_id: 1,
      sport_category_id: 2,
      description: 'Cancha de Basket',
      capacity: '11',
      isCovered: true,
      isMultipurpose: false,
      isAvailable: true,
    },
    {
      establishment_id: 1,
      sport_category_id: 1,
      description: 'Cancha de Fútbol',
      capacity: '22',
      isCovered: false,
      isMultipurpose: true,
      isAvailable: false,
    },
    {
      establishment_id: 1,
      sport_category_id: 3,
      description: 'Cancha de Tenis',
      capacity: '2',
      isCovered: false,
      isMultipurpose: false,
      isAvailable: true,
    },
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
    const roundedStartTime = new Date(time);
    roundedStartTime.setMinutes(0); // Redondea los minutos a 0
    setFilters(prev => ({
      ...prev,
      startTime: roundedStartTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));
    hideStartTimePicker();
  };
  

  const showEndTimePicker = () => setEndTimePickerVisible(true);
  const hideEndTimePicker = () => setEndTimePickerVisible(false);

  const handleEndTimeConfirm = (time: Date) => {
    const roundedEndTime = new Date(time);
    roundedEndTime.setMinutes(0); // Redondea los minutos a 0
    setFilters(prev => ({
      ...prev,
      endTime: roundedEndTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));
    hideEndTimePicker();
  };

  const handleDayPress = (day: DateData) => {
    const newMarkedDates: Record<string, { selected: boolean; marked: boolean }> = {
      [day.dateString]: { selected: true, marked: true },
    };
    setMarkedDates(newMarkedDates);
    setFilters(prev => ({ ...prev, selectedDates: newMarkedDates }));
  };
  

  // Selecciona marcador y abre modal de plazas
  const onMarkerPress = () => {
    setPlazasModalVisible(true); // Abre el modal de plazas al seleccionar un marcador
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
          {/* Tab de Precio */}
          <View style={styles.tabItem}>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => openFilterModal('Precio')}>
              <Text style={styles.customButtonText}>Precio $</Text>
            </TouchableOpacity>
            {/* Mostrar el rango de precios seleccionado */}
            {filters.minPrice && filters.maxPrice && (
              <Text style={styles.selectedFilterText}>
                ${filters.minPrice} - ${filters.maxPrice}
              </Text>
            )}
          </View>

          {/* Tab de Deporte */}
          <View style={styles.tabItem}>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => openFilterModal('Deporte')}>
              <Text style={styles.customButtonText}>Deporte</Text>
            </TouchableOpacity>
            {/* Mostrar el deporte seleccionado */}
            {filters.selectedSport && (
              <Text style={styles.selectedFilterText}>{filters.selectedSport}</Text>
            )}
          </View>

          {/* Tab de Disponibilidad */}
          <View style={styles.tabItem}>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => openFilterModal('Disponibilidad')}>
              <Text style={styles.customButtonText}>Disponibilidad</Text>
            </TouchableOpacity>
            {/* Mostrar la fecha seleccionada */}
            {Object.keys(filters.selectedDates).length > 0 && (
              <Text style={styles.selectedFilterText}>
                {Object.keys(filters.selectedDates)[0]} {/* Mostrar la fecha seleccionada */}
              </Text>
            )}
          </View>
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
            onPress={onMarkerPress} // Abre el modal de plazas al seleccionar el marcador
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

      {/* Modal para las plazas */}
      <Modal
        visible={plazasModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPlazasModalVisible(false)}>
        <View style={styles.plazasModalContainer}>
          <View style={styles.plazasModalContent}>
            <ScrollView>
              {samplePlazas.map((plaza, index) => (
                <View key={index} style={styles.plazaCard}>
                  <View style={styles.plazaDetailsContainer}>
                    {/* Estrellas */}
                    <StarRating rating={rating} />
                    <Image
                      source={require('../../../assets/canchita-logo.png')} // Imagen de ejemplo
                      style={styles.circularImage}
                    />
                    <Text style={styles.plazaTitle}>
                      {plaza.description} - Capacidad: {plaza.capacity}
                    </Text>
                    <Text style={styles.plazaDetail}>
                      {plaza.isCovered ? 'Cubierta' : 'No cubierta'} |{' '}
                      {plaza.isMultipurpose
                        ? 'Multipropósito'
                        : 'No Multipropósito'}{' '}
                      | {plaza.isAvailable ? 'Disponible' : 'No Disponible'}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <Button style={styles.viewButton}>Ver Establecimiento</Button>
            <Button
              onPress={() => setPlazasModalVisible(false)}
              style={styles.modalButton}>
              Cerrar
            </Button>
          </View>
        </View>
      </Modal>

      {/* Modales (Filtros) */}
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
                  markingType={'custom'}
                  theme={{
                    selectedDayBackgroundColor: '#1AC71A', // Cambia el color de fondo del día seleccionado a verde
                    selectedDayTextColor: '#ffffff', // Color del texto del día seleccionado
                    todayTextColor: '#1AC71A', // Cambia el color del texto para el día actual
                    dayTextColor: '#2d4150', // Color del texto de los días normales
                    textDayFontWeight: '600',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '600',
                    arrowColor: '#1AC71A', // Cambia el color de las flechas del calendario
                  }}
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
  tabItem: {
    alignItems: 'center', // Asegura que el texto del filtro seleccionado esté alineado
  },
  customButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 5, // Aumenta el espacio entre el botón y el filtro seleccionado
  },
  customButtonText: {
    color: '#000000', // Cambia el color a negro
    fontWeight: 'bold',
  },  
  selectedFilterText: {
    color: '#1AC71A', // Color del texto para los filtros seleccionados
    fontSize: 12,
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  plazasModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro más sutil
  },
  plazasModalContent: {
    width: '90%',
    padding: 15, // Ajusta el padding para que sea más pequeño
    backgroundColor: 'white',
    borderRadius: 12, // Bordes más redondeados para mejor apariencia
    maxHeight: '70%', // Controla la altura para que no ocupe toda la pantalla
  },
  plazaCard: {
    backgroundColor: '#F8F8F8', // Fondo de las tarjetas de plazas
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    flexDirection: 'row', // Alinea los elementos horizontalmente
    justifyContent: 'space-between', // Añadido para la estructura
  },
  plazaDetailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  plazaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Un color más oscuro para mejor contraste
    marginBottom: 5, // Espaciado entre el título y los detalles
  },
  plazaDetail: {
    fontSize: 14,
    color: '#666', // Un gris medio para los detalles
  },
  circularImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Círculo perfecto
    marginRight: 10, // Espacio entre la imagen y el texto
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 10, // Espacio entre las estrellas y el contenido
  },
  starIcon: {
    marginHorizontal: 2, // Espaciado entre las estrellas
  },
  viewButton: {
    backgroundColor: '#000',
    borderColor: '#000',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
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
