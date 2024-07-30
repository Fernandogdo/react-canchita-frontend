import React, {useState} from 'react';
// import MapView, { Marker, Callout } from 'react-native-maps';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Layout, Text, Button, Card} from '@ui-kitten/components';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParams} from '../../navigation/StackNavigator';
import { FAB } from '../../components/ui/FAB';
import { useAuthStore } from '../../store/auth/useAuthStore';

interface Establishment {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

const establishments: Establishment[] = [
  {
    id: '1',
    name: 'Cancha 1',
    description: 'Descripción de Cancha 1',
    latitude: -0.180653,
    longitude: -78.467834,
  },
  {
    id: '2',
    name: 'Cancha 2',
    description: 'Descripción de Cancha 2',
    latitude: -0.190653,
    longitude: -78.477834,
  },
  // Agrega más canchas según sea necesario
];

export const DashboardScreen = () => {
  const [selectedEstablishment, setSelectedEstablishment] =
    useState<Establishment | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const {logout} = useAuthStore()


  const onMarkerPress = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
  };

  const onViewDetails = () => {
    if (selectedEstablishment) {
      navigation.navigate('EstablishmentDetailScreen', {
        establishmentId: selectedEstablishment.id,
      });
    }
  };

  const onLogout = async () => {
    await logout();
    navigation.navigate('LoginScreen')
  };

  return (
    <Layout style={styles.container}>
      <Text>Dashboard</Text>
      {/* <MapView
        style={styles.map}
        initialRe<gion={{
          latitude: -0.180653,
          longitude: -78.467834,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {establishments.map((establishment) => (
          <Marker
            key={establishment.id}
            coordinate={{
              latitude: establishment.latitude,
              longitude: establishment.longitude,
            }}
            onPress={() => onMarkerPress(establishment)}
          >
            <Callout>
              <Text>{establishment.name}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView> */}

      {selectedEstablishment && (
        <Card style={styles.infoCard}>
          <Text category="h6">{selectedEstablishment.name}</Text>
          <Text>{selectedEstablishment.description}</Text>
          <Button onPress={onViewDetails}>Ver detalles</Button>
        </Card>
      )}

      <FAB
        iconName="plus-outline"
        onPress={() => navigation.navigate('ProductScreen', {productId: 'new'})}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
        }}
      />

      <Button
        onPress={onLogout}
        style={{
          position: 'absolute',
          bottom: 30,
          left: 20,
        }}>
        Cerrar Sesion
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  infoCard: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
});
