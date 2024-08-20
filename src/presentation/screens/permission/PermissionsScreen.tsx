import { View, Text, Pressable } from 'react-native'
import { styles } from '../styles'
import { usePermissionStore } from '../../store/permissions/usePermissionStore'


export const PermissionsScreen = () => {
    
    const { locationStatus, requestLocationPermission } =  usePermissionStore()
  
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>
            Habilitar Ubicación
        </Text>

        <Pressable style = {{
            backgroundColor: '#5BA246', 
            paddingVertical: 10, 
            paddingHorizontal: 20, 
            borderRadius: 100, 
            margin: 10
        }}
            onPress={ requestLocationPermission }
        >
            <Text style = {{color: 'white'}} >
                Habilitar Localizacion
            </Text>
        </Pressable>

        <Text>Estado actual: { locationStatus }  </Text>
    </View>
  )
}
