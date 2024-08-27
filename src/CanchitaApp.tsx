import 'react-native-gesture-handler';
// import {enableLatestRenderer} from 'react-native-maps'

// enableLatestRenderer();

import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {NavigationContainer} from '@react-navigation/native';
import {StackNavigator} from './presentation/navigation/StackNavigator';
import {useColorScheme} from 'react-native';
import {AuthProvider} from './presentation/providers/AuthProvider';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import deepmerge from 'deepmerge';
import { PermissionsChecker } from './presentation/providers/PermissionsChecker';

const queryClient = new QueryClient();

export const CanchitaApp = () => {
  const colorScheme = useColorScheme();

  const customDarkTheme = deepmerge(eva.dark, {
    'color-primary-500': '#5BA246',
    'color-basic-800': '#000000',
    'color-basic-900': '#000000',
    'color-basic-1000': '#000000',
    'color-basic-1100': '#000000',
    'select-background-color': '#282626', // Define un color de fondo para el Select
  });

  const theme = colorScheme === 'dark' ? customDarkTheme : eva.light;
  const backgroundColor =
    colorScheme === 'dark'
      ? customDarkTheme['color-basic-800']
      : theme['color-basic-100'];

  return (
    <QueryClientProvider client={queryClient}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={theme}>
        <NavigationContainer
          theme={{
            dark: colorScheme === 'dark',
            colors: {
              primary: theme['color-primary-500'],
              background: backgroundColor,
              card: theme['color-basic-100'],
              text: theme['text-basic-color'],
              border: theme['color-basic-800'],
              notification: theme['color-primary-500'],
            },
          }}>
          <AuthProvider>
            <PermissionsChecker>
              <StackNavigator />
            </PermissionsChecker>
          </AuthProvider>
        </NavigationContainer>
      </ApplicationProvider>
    </QueryClientProvider>
  );
};
