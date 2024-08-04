import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { styles } from '../styles';
import { Layout, Text, Card } from '@ui-kitten/components';
import { MyIcon } from '../../components/ui/MyIcon';

interface Props extends StackScreenProps<RootStackParams, 'RoleScreen'> {}

export const RoleScreen = ({ navigation }: Props) => {

  const onSelectRole = (roleLabel: 'Cliente' | 'Establecimiento') => {
    // Mapea los valores de la interfaz de usuario a los valores que necesitas enviar
    const role = roleLabel === 'Establecimiento' ? 'E' : 'C';
    navigation.navigate('RegisterScreen', { role });
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
              style={styles.card}
              onPress={() => onSelectRole('Establecimiento')}
            >
              <Layout style={styles.cardContent}>
                <MyIcon name="home-outline" white />
                <Text style={styles.cardText}>Establecimiento</Text>
              </Layout>
            </Card>

            <Card
              style={styles.card}
              onPress={() => onSelectRole('Cliente')}
            >
              <Layout style={styles.cardContent}>
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
