import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { styles } from '../styles';
import { Layout, Text, Card } from '@ui-kitten/components';
import { MyIcon } from '../../components/ui/MyIcon';

interface Props extends StackScreenProps<RootStackParams, 'RoleScreen'> {}

export const RoleScreen = ({ navigation }: Props) => {
  const [pressedCard, setPressedCard] = useState<'Establecimiento' | 'Cliente' | null>(null);

  const onSelectRole = (roleLabel: 'Cliente' | 'Establecimiento') => {
    setPressedCard(roleLabel);
    setTimeout(() => {
      const role = roleLabel === 'Establecimiento' ? 'E' : 'C';
      navigation.navigate('RegisterScreen', { role });
      setPressedCard(null); // Reset after navigation
    }, 100); // Adjust delay as needed
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Layout style={styles.containerCentered}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Layout style={[styles.fondoPrincipal, { paddingBottom: 20 }]}>
            <Text style={{ color: 'white' }} category="h1">Escoge tu tipo de cuenta</Text>
            <Text style={{ color: 'white' }} category="p2">
              La cuenta Establecimiento es para personas dueñas de canchas disponibles al público. La cuenta Cliente es para personas que desean reservar.
            </Text>
          </Layout>

          {/* Cards */}
          <Layout style={[styles.fondoPrincipal, styles.cardContainer]}>
            <Card
              style={[
                styles.card,
                pressedCard === 'Establecimiento' && { backgroundColor: '#4e8b3a' }, // Cambia el color de fondo
              ]}
              onPress={() => onSelectRole('Establecimiento')}
            >
              <Layout style={[
                styles.cardContent,
                pressedCard === 'Establecimiento' && { backgroundColor: '#4e8b3a' }, // Cambia también el fondo del contenido
              ]}>
                <MyIcon name="home-outline" white />
                <Text style={styles.cardText}>Establecimiento</Text>
              </Layout>
            </Card>

            <Card
              style={[
                styles.card,
                pressedCard === 'Cliente' && { backgroundColor: '#4e8b3a' }, // Cambia el color de fondo
              ]}
              onPress={() => onSelectRole('Cliente')}
            >
              <Layout style={[
                styles.cardContent,
                pressedCard === 'Cliente' && { backgroundColor: '#4e8b3a' }, // Cambia también el fondo del contenido
              ]}>
                <MyIcon name="person-outline" white />
                <Text style={styles.cardText}>Cliente</Text>
              </Layout>
            </Card>
          </Layout>

        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
};
