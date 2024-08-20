import { PropsWithChildren, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from '../navigation/StackNavigator';
import { useAuthStore } from '../store/auth/useAuthStore';

export const AuthProvider = ({ children }: PropsWithChildren) => {

  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const { checkStatus, status } = useAuthStore();


  useEffect(() => {
    checkStatus(); 
  }, [])

  useEffect(() => {
    if ( status !== 'checking' ) {
      if ( status === 'authenticated' ) {
        console.log("🚀 ~ useEffect ~ status:", status)
        navigation.reset({
          index: 0,
          routes: [{ name: 'DashboardScreen' }],
        })
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        })
      }
    }
  }, [status])
  
  


  return (
    <>{ children }</>
  )
}