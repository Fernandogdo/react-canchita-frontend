import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';

const establishments = [
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

interface Props extends StackScreenProps<RootStackParams, 'EstablishmentDetailScreen'> {}

export const EstablishmentDetailScreen = ({ route }: Props) => {
  const { establishmentId } = route.params;

  // Aquí obtén los detalles del establecimiento usando el establishmentId
  const establishment = establishments.find(e => e.id === establishmentId);

  if (!establishment) {
    return (
      <Layout style={{ flex: 1, padding: 20 }}>
        <Text category="h1">Establecimiento no encontrado</Text>
      </Layout>
    );
  }

  return (
    <Layout style={{ flex: 1, padding: 20 }}>
      <Text category="h1">{establishment.name}</Text>
      <Text category="p1">{establishment.description}</Text>
      {/* Agrega más detalles según sea necesario */}
    </Layout>
  );
};
