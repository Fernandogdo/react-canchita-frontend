import React, { useState, useEffect } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainLayout } from '../../layouts/MainLayout';
import { StyleSheet, View, Text } from 'react-native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { Button, Divider, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { MyIcon } from '../../components/ui/MyIcon';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ConfigurationScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { logout } = useAuthStore();
  const [userName, setUserName] = useState<string | null>(null);
  const { canGoBack, goBack } = useNavigation();
  const { top } = useSafeAreaInsets();
  const renderBackAction = () => (
    <TopNavigationAction 
      icon={ <MyIcon name="arrow-back-outline" /> }
      onPress={ goBack }
    />
  )
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName'); // Obtén el nombre del usuario del almacenamiento
        if (name !== null) {
          setUserName(name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const onLogout = async () => {
    await logout();
    navigation.navigate('LoginScreen');
  };

  return (
    <>
      {/* <MainLayout title="" subTitle="" > */}
      <Layout style={{ paddingTop: top }}>
      <TopNavigation
        title={ "" }
        subtitle={ "" }
        alignment="center"
        accessoryLeft={ canGoBack() ? renderBackAction : undefined }
       
      />
      <Divider />      
    </Layout>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* Título "Ajustes" */}
            <Text style={styles.title}>Ajustes</Text>
            <Text style={styles.normalTextBold}>Cuenta</Text>
            {/* Círculo con icono y nombre del usuario */}
            <View style={styles.userContainer}>
              <View style={styles.iconContainer}>
                <MyIcon name="person-outline" white />
              </View>
              <View style={styles.userContainerText}>
                <Text style={styles.userName}>{userName || 'Usuario'}</Text>
                <Text style={styles.secondaryText}>{"Cliente / Dueño"}</Text>
              </View>
            </View>
            <Text style={styles.normalTextBold}>Configuraciones</Text>
            {/* Menú con cuatro botones */}
            <Layout style={styles.containButton} >
            <MyIcon name="arrow-forward-outline" />
            <Text   onPress={() => navigation.navigate('EstablishmentDetailScreen',{establishmentId:"1"})}style={styles.menuText}>Configuraciones</Text>
            <MyIcon name="arrow-forward-outline" />
            </Layout>
           
            <Layout style={styles.containButton} >
            <MyIcon name="arrow-forward-outline" />
            <Text  onPress={onLogout} style={styles.menuText}>Configuraciones</Text>
            <MyIcon name="arrow-forward-outline" />
            </Layout>
            <Layout style={styles.containButton} >
            <MyIcon name="settings-2-outline" />
            <Text  onPress={onLogout} style={styles.menuText}>Configuraciones</Text>
            <MyIcon name="arrow-forward-outline" />
            </Layout>
            <Layout style={styles.containButton} >
            <MyIcon name="menu-outline" />
            <Text  onPress={onLogout} style={styles.menuText}>Configuraciones</Text>
            <MyIcon name="arrow-forward-outline" />
            </Layout>
           
          </View>
        </ScrollView>
      {/* </MainLayout> */}
{/* 
      <Button
        onPress={onLogout}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </Button> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  userContainer: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: "row",
  },
  userContainerText: {
    flexDirection: "column",
    marginLeft: 15,
    verticalAlign: 'middle',
  },
  iconContainer: {
    backgroundColor: 'black', // Color de fondo del círculo
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 25,
  },
  userName: {
    fontSize: 20,
    color: '#333',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    backgroundColor: '#dc3545',
    // Color de fondo del botón de cerrar sesión
  },
  title: {
    fontSize: 30, // Tamaño de fuente similar a un h1
    fontWeight: 'bold', // Para hacerlo más prominente
    marginBottom: 20, // Espaciado debajo del título
    textAlign: 'left', // Centrar el texto
    color: "black",
    marginLeft: 25,
  },
  normalTextBold: {
    fontSize: 15, // Tamaño de fuente similar a un h1
    fontWeight: 'bold', // Para hacerlo más prominente
    marginBottom: 20, // Espaciado debajo del título
    textAlign: 'left', // Centrar el texto
    color: "black",
    marginLeft: 25,
  },
  secondaryText: {
    fontSize: 10,
    color: 'gray',
  },

  logoutButtonText: {
    color: 'white', // Cambia este color al deseado para el texto del botón de cerrar sesión
  },
  containButton:{
    flexDirection: "row",
    marginLeft:25,
    marginTop:5,
    flex: 1
    
  },
  menuText:{
    marginRight:25,
    marginLeft:25,
    fontSize:20,
   
  }
});

export default ConfigurationScreen;
