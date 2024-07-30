import React from 'react';
import { createStackNavigator, StackCardStyleInterpolator } from '@react-navigation/stack';
import { LoadingScreen } from '../screens/loading/LoadingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProductScreen } from '../screens/product/ProductScreen';
import { RoleScreen } from '../screens/auth/RoleScreen';
import { EstablishmentRegisterScreen } from '../screens/auth/EstablishmentRegisterScreen';
import { DashboardScreen } from '../screens/home/DashboardScreen';
import { EstablishmentDetailScreen } from '../screens/home/EstablishmentDetailScreen';

export type RootStackParams = {
  LoadingScreen: undefined;
  LoginScreen: undefined;
  RoleScreen: undefined;
  RegisterScreen: { role: 'Cliente' | 'Establecimiento' };
  EstablishmentRegisterScreen: undefined;
  EstablishmentDetailScreen: { establishmentId: string }; // Asegúrate de que este tipo esté definido correctamente
  HomeScreen: undefined;
  DashboardScreen: undefined;
  ProductScreen: { productId: string };
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
        // cardStyleInterpolator: fadeAnimation,
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
        name="EstablishmentRegisterScreen"
        component={EstablishmentRegisterScreen}
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
      <Stack.Screen name="ProductScreen" component={ProductScreen} />
    </Stack.Navigator>
  );
};
