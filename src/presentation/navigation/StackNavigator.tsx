import React from 'react';
import { createStackNavigator, StackCardStyleInterpolator } from '@react-navigation/stack';
import { LoadingScreen } from '../screens/loading/LoadingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProductScreen } from '../screens/product/ProductScreen';
import { RoleScreen } from '../screens/auth/RoleScreen';
import { EstablishmentRegisterScreenStep1 } from '../screens/auth/EstablishmentRegisterScreenStep1';
import { EstablishmentRegisterScreenStep2 } from '../screens/auth/EstablishmentRegisterScreenStep2';
import { DashboardScreen } from '../screens/home/DashboardScreen';
import { EstablishmentDetailScreen } from '../screens/home/EstablishmentDetailScreen';
import { RecoverScreen } from '../screens/auth/RecoverScreen';
import { ValidationScreen } from '../screens/auth/ValidationScreen';
import { PermissionsScreen } from '../screens/permission/PermissionsScreen';
import { ResetPassScreen } from '../screens/auth/ResetPassScreen';
import { ConfigurationScreen } from '../screens/product/ConfigurationScreen';
import { CourtsCard } from '../components/courts/CourtsCard';

export type RootStackParams = {
  LoadingScreen: undefined;
  LoginScreen: undefined;
  RoleScreen: undefined;
  RegisterScreen: { role: 'E' | 'C' };  // Cambia aquí a 'E' | 'C'
  EstablishmentRegisterScreenStep1: { userId: number; email: string };
  EstablishmentRegisterScreenStep2: { userId: number; email: string; form: any }; // Agrega los parámetros necesarios
  EstablishmentDetailScreen: { establishmentId: string }; // Asegúrate de que este tipo esté definido correctamente
  HomeScreen: undefined;
  DashboardScreen: undefined;
  ProductScreen: { productId: string };
  RecoverScreen: undefined;
  PermissionsScreen: undefined;
  ValidationScreen: { email: string, user_id: string }; // Asegúrate de que ValidationScreen reciba el email
  ResetPassScreen: {email: string};
  ConfigurationScreen: undefined;
  CourtsCard: { establishmentId: string }; // Asegúrate de que este tipo esté definido correctamente
};

const Stack = createStackNavigator<RootStackParams>();

const fadeAnimation: StackCardStyleInterpolator = ({ current }) => {
  return {
    cardStyle: {
      opacity: current.progress,
    },
  };
};

export const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoadingScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="LoadingScreen"
        component={LoadingScreen}
      />
      <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="LoginScreen"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="RegisterScreen"
        component={RegisterScreen}
      />
      <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="RoleScreen"
        component={RoleScreen}
      />
      <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="EstablishmentRegisterScreenStep1"
        component={EstablishmentRegisterScreenStep1}
      />
      <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="EstablishmentRegisterScreenStep2"
        component={EstablishmentRegisterScreenStep2}
      />
      <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="HomeScreen"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="DashboardScreen"
        component={DashboardScreen}
      />
      <Stack.Screen
        name="EstablishmentDetailScreen"
        component={EstablishmentDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ValidationScreen"
        component={ValidationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ProductScreen" component={ProductScreen} />
      <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="RecoverScreen"
        component={RecoverScreen}
      />
       <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="PermissionsScreen"
        component={PermissionsScreen}
      />
       <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="ResetPassScreen"
        component={ResetPassScreen}
      />
       <Stack.Screen
        options={{ cardStyleInterpolator: fadeAnimation }}
        name="ConfigurationScreen"
        component={ConfigurationScreen}
      />
        <Stack.Screen
        name="CourtsCard"
        component={CourtsCard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
