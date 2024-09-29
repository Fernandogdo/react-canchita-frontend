import React, { useState } from 'react';
import { Divider, Layout, Text, TopNavigation, TopNavigationAction, Button } from '@ui-kitten/components';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MyIcon } from '../../components/ui/MyIcon';
import { styles } from '../styles';
import StarRating from '../../components/establishments/StarRating';
import Swiper from 'react-native-swiper';

const establishments = [
  {
    id: '1',
    name: 'Cancha 1',
    description: 'Descripción de Cancha 1',
    latitude: -0.180653,
    longitude: -78.467834,
    image: '../../../assets/no-product-image.png',
    tarifa: "20/hora",
    images: [
      require('../../../assets/no-product-image.png'),
      require('../../../assets/no-product-image.png'),
      require('../../../assets/no-product-image.png'),
    ],
    des: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. This is a test to scrollview and now im got to wite some ramdom text mn c kjsd cksjd csdkc sdkcj sdkcj s dckjs c skv  sdv kj ccksd ksd cksd cds cmsdn cmsn cmsdnc smdcn sdmc sdmdnc sd  jkdnskjdnkjsnkjndkjnkjdnkj kffkfkkfkfkfkfk test v1sasa" 
  },
  {
    id: '2',
    name: 'Cancha 2',
    description: 'Descripción de Cancha 2',
    latitude: -0.190653,
    longitude: -78.477834,
    image: '../../../assets/no-product-image.png',
    tarifa: "25/hora",
    images: [
      require('../../../assets/no-product-image.png'),
      require('../../../assets/no-product-image.png'),
      require('../../../assets/no-product-image.png'),
    ],
  },
  {
    id: '3',
    name: 'Cancha 3',
    description: 'Descripción de Cancha 3',
    latitude: -0.190653,
    longitude: -78.477834,
    image: '../../../assets/no-product-image.png',
    tarifa: "25/hora",
    images: [
      require('../../../assets/no-product-image.png'),
      require('../../../assets/no-product-image.png'),
      require('../../../assets/no-product-image.png'),
    ],
  },
];

interface Props extends StackScreenProps<RootStackParams, 'CourtsCard'> {}

export const CourtsCard = ({ route }: Props) => {
  const { establishmentId } = route.params;
  const { top } = useSafeAreaInsets();
  
  const establishment = establishments.find(e => e.id === establishmentId);
  const { canGoBack, goBack } = useNavigation();
  const [rating, setRating] = useState(3);

  const renderBackAction = () => (
    <TopNavigationAction 
      icon={<MyIcon name="arrow-back-outline" />}
      onPress={goBack}
    />
  );

  const renderActionButton = () => (
    <Button
      onPress={goBack}
      style={styles.buttonBlack}
      accessoryRight={<MyIcon name="arrow-forward-outline" white />}
    >
      <Text>Ver canchas</Text>
    </Button> 
  );

  if (!establishment) {
    return (
      <Layout style={{ flex: 1, padding: 20 }}>
        <Text category="h1">Establecimiento no encontrado</Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles2.container}>
        <View style={styles2.innerContainer}>
          <View style={styles2.textContainer}>
            <StarRating rating={rating} />
            <Text style={styles2.title} category="h1">
              {establishment.name}
            </Text>
            <Text style={styles2.secondaryText}>
              {establishment.tarifa}
            </Text>
          </View>
          <Image
            source={require('../../../assets/canchita-logo.png')}
            style={styles2.image}
            resizeMode="cover"
          />
        </View>
        
        <Swiper style={styles2.carousel} showsButtons={true}>
          {establishment.images.map((image, index) => (
            <Image key={index} source={image} style={styles2.carouselImage} resizeMode="cover" />
          ))}
        </Swiper>
      </ScrollView>
    </Layout>
  );
};

const styles2 = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    borderColor: 'gray', // Color del borde
    borderWidth: 1, // Ancho del borde
    borderRadius: 5, // Esquinas redondeadas (opcional)
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
  },
  secondaryText: {
    fontSize: 15,
    color: 'gray',
  },
  carousel: {
    height: 200,
    marginTop:20,
    marginBottom:10
  },
  carouselImage: {
    width: '100%',
    height: 200,
  },
  scrollContainer: {
    maxHeight: 250, // Altura máxima para el ScrollView
   
  },
});