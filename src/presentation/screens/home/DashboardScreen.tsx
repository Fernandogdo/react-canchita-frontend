import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Layout, Text, Button} from '@ui-kitten/components';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParams} from '../../navigation/StackNavigator';
import {FAB} from '../../components/ui/FAB';
import {useAuthStore} from '../../store/auth/useAuthStore';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {MyIcon} from '../../components/ui/MyIcon';
export const DashboardScreen = () => {
  const [selectedMarker, setSelectedMarker] = useState<{ latitude: number, longitude: number } | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const {logout} = useAuthStore();

  const onMapPress = (event: any) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setSelectedMarker({latitude, longitude});
  };

  const onLogout = async () => {
    await logout();
    navigation.navigate('LoginScreen');
  };

  return (
    <Layout style={styles.container}>
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
        onPress={onMapPress} // Captura las pulsaciones en el mapa
      >
        {selectedMarker && (
          <Marker
            coordinate={selectedMarker}
            title="Nuevo marcador"
            description="Ubicación seleccionada"
          />
        )}
      </MapView>

      {/* <FAB
        iconName="plus-outline"
        onPress={() => navigation.navigate('ProductScreen', {productId: 'new'})}
        style={styles.fab}
      />

      <Button onPress={onLogout} style={styles.logoutButton}>
        Cerrar Sesión
      </Button> */}
       <Layout style={styles.buttonContainer}>
        <Button
          style={styles.button}
          onPress={onLogout}
          appearance='filled'
        >
          <MyIcon name="settings-2-outline" white size={32} />
        </Button>
        <Button
          style={styles.largeButton} // Aplica el estilo para el botón del medio
          onPress={() => navigation.navigate('HomeScreen')}
          appearance='filled'
        >
          <MyIcon name="home-outline" white size={50} />
        </Button>
        <Button
          style={styles.button}
          onPress={onLogout}
          appearance='filled'
        >
          <MyIcon name="menu-outline" white size={32} />
        </Button>
      </Layout>

    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    //height: '87.5%', // 3.5/4 de la pantalla
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor:"transparent"
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
    marginTop:12
  },
  largeButton: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: 'black',
    borderColor: 'black',
    height: 80, // Altura mayor para el botón del medio
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});

export default DashboardScreen;
