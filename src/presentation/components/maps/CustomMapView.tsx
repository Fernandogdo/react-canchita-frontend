// components/ui/CustomMapView.tsx
import React, { useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, MapPressEvent } from 'react-native-maps';
import { StyleSheet, Platform, ViewStyle, Dimensions } from 'react-native';

type CustomMapViewProps = {
  initialLatitude: number;
  initialLongitude: number;
  selectedMarker: { latitude: number; longitude: number } | null;
  onMapPress: (event: MapPressEvent) => void;
  markerTitle?: string;
  markerDescription?: string;
  mapHeight: number | string; // Permitir tanto number como string
};

// Función para manejar la altura del mapa
const getMapHeight = (height: number | string): ViewStyle['height'] => {
  if (typeof height === 'number') {
    return height;
  } else if (typeof height === 'string' && height.endsWith('%')) {
    return height as ViewStyle['height'];
  } else {
    return '50%' as ViewStyle['height']; // Valor predeterminado como porcentaje para mayor flexibilidad
  }
};

const CustomMapView: React.FC<CustomMapViewProps> = ({
  initialLatitude,
  initialLongitude,
  selectedMarker,
  onMapPress,
  markerTitle = 'Ubicación seleccionada',
  markerDescription = 'Presiona para ajustar',
  mapHeight,
}) => {
  const mapRef = useRef<MapView>(null);

  return (
    <MapView
      ref={mapRef}
      provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
      style={[styles.map, { height: getMapHeight(mapHeight) }]} // Usar la función de utilidad
      region={{
        latitude: selectedMarker ? selectedMarker.latitude : initialLatitude,
        longitude: selectedMarker ? selectedMarker.longitude : initialLongitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}
      zoomEnabled={true}
      scrollEnabled={true}
      showsUserLocation={true}
      followsUserLocation={true}
      onPress={onMapPress}
    >
      {selectedMarker && (
        <Marker
          coordinate={selectedMarker}
          title={markerTitle}
          description={markerDescription}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
  },
});

export default CustomMapView;
