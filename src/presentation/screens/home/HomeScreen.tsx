import {useInfiniteQuery} from '@tanstack/react-query';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import {getProductsByPage} from '../../../actions/products/get-products-by-page';
import {MainLayout} from '../../layouts/MainLayout';

import {FullScreenLoader} from '../../components/ui/FullScreenLoader';
import {ProductList} from '../../components/products/ProductList';
import { FAB } from '../../components/ui/FAB';
import { RootStackParams } from '../../navigation/StackNavigator';
import { Button } from '@ui-kitten/components';
import { Text } from 'react-native-svg';
import { useAuthStore } from '../../store/auth/useAuthStore';

export const HomeScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();
   const {logout} = useAuthStore()
  // const {isLoading, data: products = []} = useQuery({
  //   queryKey: ['products', 'infinite'],
  //   staleTime: 1000 * 60 * 60, // 1 hour
  //   queryFn: () => getProductsByPage(0),
  // });

  const {isLoading, data, fetchNextPage} = useInfiniteQuery({
    queryKey: ['products', 'infinite'],
    staleTime: 1000 * 60 * 60, // 1 hour
    initialPageParam: 0,

    queryFn: async params => await getProductsByPage(params.pageParam),
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });

  const onLogout = async () => {
    await logout();
    navigation.navigate('LoginScreen')
  };

  return (
    <>
      <MainLayout
        title="TesloShop - Products"
        subTitle="Aplicación administrativa">
        {isLoading ? (
          <FullScreenLoader />
        ) : (
          <ProductList
            products={data?.pages.flat() ?? []}
            fetchNextPage={fetchNextPage}
          />
        )}
      </MainLayout>

      <FAB 
        iconName="plus-outline"
        onPress={() => navigation.navigate('ProductScreen',{ productId: 'new' })}
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
        }}
      >
        Cerrar Sesion
      </Button>
    </>
  );
};
