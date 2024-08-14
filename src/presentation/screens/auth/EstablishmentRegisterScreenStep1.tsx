// import React, { useState } from 'react';
// import { Button, Input, Layout, Text } from '@ui-kitten/components';
// import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
// import { StackScreenProps } from '@react-navigation/stack';
// import { styles } from '../styles';
// import Toast from 'react-native-toast-message';
// import { useEstablishmentStore } from '../../store/establishment/useEstablishmentStore';
// import { MyIcon } from '../../components/ui/MyIcon';
// import { TimePicker } from '../../components/ui/TimePicker';
// import { RootStackParams } from '../../navigation/StackNavigator';

// interface Props extends StackScreenProps<RootStackParams, 'EstablishmentRegisterScreen'> {}

// export const EstablishmentRegisterScreen = ({ route, navigation }: Props) => {
//   const { userId, email } = route.params;
//   console.log("🚀 ~ EstablishmentRegisterScreen ~ userId, email:", userId, email)

//   const [form, setForm] = useState({
//     establishmentName: '',
//     description: '',
//     ruc: '',
//     canton_id: 1, 
//     address: '',
//     latitude: '',
//     longitude: '',
//     google_address: '',
//     opening_time: '',
//     closing_time: '',
//   });

//   const { createEstablishment } = useEstablishmentStore();

//   const [errors, setErrors] = useState({
//     establishmentName: '',
//     description: '',
//     ruc: '',
//     address: '',
//     latitude: '',
//     longitude: '',
//     google_address: '',
//     opening_time: '',
//     closing_time: '',
//   });

//   const [showOpeningTimePicker, setShowOpeningTimePicker] = useState(false);
//   const [showClosingTimePicker, setShowClosingTimePicker] = useState(false);


//   const validateFields = () => {
//     let valid = true;
//     const newErrors = {
//       establishmentName: '',
//       description: '',
//       ruc: '',
//       address: '',
//       latitude: '',
//       longitude: '',
//       google_address: '',
//       opening_time: '',
//       closing_time: '',
//     };

//     if (form.establishmentName.length === 0) {
//       newErrors.establishmentName = 'El nombre del establecimiento es obligatorio';
//       valid = false;
//     }

//     if (form.description.length === 0) {
//       newErrors.description = 'La descripción es obligatoria';
//       valid = false;
//     }

//     if (form.ruc.length === 0) {
//       newErrors.ruc = 'El RUC es obligatorio';
//       valid = false;
//     }

//     if (form.address.length === 0) {
//       newErrors.address = 'La dirección es obligatoria';
//       valid = false;
//     }

//     if (form.latitude.length === 0) {
//       newErrors.latitude = 'La latitud es obligatoria';
//       valid = false;
//     }

//     if (form.longitude.length === 0) {
//       newErrors.longitude = 'La longitud es obligatoria';
//       valid = false;
//     }

//     if (form.google_address.length === 0) {
//       newErrors.google_address = 'La dirección de Google es obligatoria';
//       valid = false;
//     }

//     if (form.opening_time.length === 0) {
//       newErrors.opening_time = 'La hora de apertura es obligatoria';
//       valid = false;
//     }

//     if (form.closing_time.length === 0) {
//       newErrors.closing_time = 'La hora de cierre es obligatoria';
//       valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };

//   const onRegisterEstablishment = async () => {
//     if (!validateFields()) {
//       Toast.show({
//         type: 'error',
//         text1: 'Errores en el formulario',
//         text2: 'Por favor, revisa los campos resaltados',
//       });
//       return;
//     }

//     const establishment = {
//       user_id: userId,
//       name: form.establishmentName,
//       description: form.description,
//       ruc: form.ruc,
//       canton_id: form.canton_id,
//       address: form.address,
//       latitude: form.latitude,
//       longitude: form.longitude,
//       google_address: form.google_address,
//       opening_time: form.opening_time,
//       closing_time: form.closing_time,
//     };

//     const wasSuccessful = await createEstablishment(establishment);
//     if (wasSuccessful) {
//       navigation.navigate('ValidationScreen', { email });
//     } else {
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: 'Error al crear el establecimiento',
//       });
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <Layout style={styles.containerCentered}>
//         <ScrollView contentContainerStyle={styles.scrollViewContent}>
//           <Layout style={[styles.fondoPrincipal, { paddingBottom: 10 }]}>
//             <Text style={styles.textoBase} category="h4">Registra tu Establecimiento</Text>
//             <Text style={styles.textoBase} category="p2">Por favor, completa los datos de tu establecimiento</Text>
//           </Layout>

//           <Layout style={[styles.fondoPrincipal, { marginTop: 20 }]}>
//             <Input
//               placeholder="Nombre del Establecimiento"
//               accessoryLeft={<MyIcon name="briefcase-outline" white/>}
//               value={form.establishmentName}
//               onChangeText={(establishmentName) => setForm({ ...form, establishmentName })}
//               status={errors.establishmentName ? 'danger' : 'basic'}
//               caption={errors.establishmentName}
//               style={[styles.input, errors.establishmentName ? styles.inputError : null]}
//               textStyle={{ color: styles.input.color }}
//             />
//             <Input
//               placeholder="Descripción"
//               accessoryLeft={<MyIcon name="file-text-outline" white/>}
//               value={form.description}
//               onChangeText={(description) => setForm({ ...form, description })}
//               status={errors.description ? 'danger' : 'basic'}
//               caption={errors.description}
//               style={[styles.input, errors.description ? styles.inputError : null]}
//               textStyle={{ color: styles.input.color }}
//             />
//             <Input
//               placeholder="RUC"
//               accessoryLeft={<MyIcon name="hash-outline" white/>}
//               value={form.ruc}
//               onChangeText={(ruc) => setForm({ ...form, ruc })}
//               status={errors.ruc ? 'danger' : 'basic'}
//               caption={errors.ruc}
//               style={[styles.input, errors.ruc ? styles.inputError : null]}
//               textStyle={{ color: styles.input.color }}
//             />
//             <Input
//               placeholder="Dirección"
//               accessoryLeft={<MyIcon name="pin-outline" white/>}
//               value={form.address}
//               onChangeText={(address) => setForm({ ...form, address })}
//               status={errors.address ? 'danger' : 'basic'}
//               caption={errors.address}
//               style={[styles.input, errors.address ? styles.inputError : null]}
//               textStyle={{ color: styles.input.color }}
//             />
//             <Input
//               placeholder="Latitud"
//               accessoryLeft={<MyIcon name="compass-outline" white/>}
//               value={form.latitude}
//               onChangeText={(latitude) => setForm({ ...form, latitude })}
//               keyboardType="decimal-pad"
//               status={errors.latitude ? 'danger' : 'basic'}
//               caption={errors.latitude}
//               style={[styles.input, errors.latitude ? styles.inputError : null]}
//               textStyle={{ color: styles.input.color }}
//             />
//             <Input
//               placeholder="Longitud"
//               accessoryLeft={<MyIcon name="compass-outline" white/>}
//               value={form.longitude}
//               onChangeText={(longitude) => setForm({ ...form, longitude })}
//               keyboardType="decimal-pad"
//               status={errors.longitude ? 'danger' : 'basic'}
//               caption={errors.longitude}
//               style={[styles.input, errors.longitude ? styles.inputError : null]}
//               textStyle={{ color: styles.input.color }}
//             />
//             <Input
//               placeholder="Dirección de Google Maps"
//               accessoryLeft={<MyIcon name="map-outline" white/>}
//               value={form.google_address}
//               onChangeText={(google_address) => setForm({ ...form, google_address })}
//               status={errors.google_address ? 'danger' : 'basic'}
//               caption={errors.google_address}
//               style={[styles.input, errors.google_address ? styles.inputError : null]}
//               textStyle={{ color: styles.input.color }}
//             />

//             {/* Usando TimePicker */}
//             <TimePicker
//               label="Hora de Apertura"
//               placeholder="Selecciona la hora"
//               value={form.opening_time}
//               onChange={(time) => setForm({ ...form, opening_time: time })}
//               error={errors.opening_time}
//               style={[styles.input, errors.opening_time ? styles.inputError : null]}
//             />

//             <TimePicker
//               label="Hora de Cierre"
//               placeholder="Selecciona la hora"
//               value={form.closing_time}
//               onChange={(time) => setForm({ ...form, closing_time: time })}
//               error={errors.closing_time}
//               style={[styles.input, errors.closing_time ? styles.inputError : null]}
//             />
//           </Layout>

//           <Layout style={[styles.fondoPrincipal, { height: 15 }]} />

//           <Layout style={styles.fondoPrincipal}>
//             <Button
//               style={styles.button}
//               onPress={onRegisterEstablishment}
//               accessoryRight={<MyIcon name="checkmark-circle-2-outline" white />}
//             >
//               Registrar Establecimiento
//             </Button>
//           </Layout>
//         </ScrollView>
//       </Layout>

//       <Toast />
//     </KeyboardAvoidingView>
//   );
// };

// export default EstablishmentRegisterScreen;

import React, { useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { styles } from '../styles';
import Toast from 'react-native-toast-message';
import { MyIcon } from '../../components/ui/MyIcon';
import { TimePicker } from '../../components/ui/TimePicker';
import { RootStackParams } from '../../navigation/StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'EstablishmentRegisterScreenStep1'> {}

export const EstablishmentRegisterScreenStep1 = ({ route, navigation }: Props) => {
  const { userId, email } = route.params;

  const [form, setForm] = useState({
    establishmentName: '',
    description: '',
    ruc: '',
    opening_time: '',
    closing_time: '',
  });

  const [errors, setErrors] = useState({
    establishmentName: '',
    description: '',
    ruc: '',
    opening_time: '',
    closing_time: '',
  });

  const validateFields = () => {
    let valid = true;
    const newErrors = {
      establishmentName: '',
      description: '',
      ruc: '',
      opening_time: '',
      closing_time: '',
    };

    if (form.establishmentName.length === 0) {
      newErrors.establishmentName = 'El nombre del establecimiento es obligatorio';
      valid = false;
    }

    if (form.description.length === 0) {
      newErrors.description = 'La descripción es obligatoria';
      valid = false;
    }

    if (form.ruc.length === 0) {
      newErrors.ruc = 'El RUC es obligatorio';
      valid = false;
    }

    if (form.opening_time.length === 0) {
      newErrors.opening_time = 'La hora de apertura es obligatoria';
      valid = false;
    }

    if (form.closing_time.length === 0) {
      newErrors.closing_time = 'La hora de cierre es obligatoria';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const onNextStep = () => {
    if (!validateFields()) {
      Toast.show({
        type: 'error',
        text1: 'Errores en el formulario',
        text2: 'Por favor, revisa los campos resaltados',
      });
      return;
    }

    // Navegar a la segunda pantalla pasando el formulario y los datos del usuario
    navigation.navigate('EstablishmentRegisterScreenStep2', {
      userId,
      email,
      form,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Layout style={styles.containerCentered}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Layout style={[styles.fondoPrincipal, { paddingBottom: 10 }]}>
            <Text style={styles.textoBase} category="h4">Registra tu Establecimiento</Text>
            <Text style={styles.textoBase} category="p2">Por favor, completa los datos de tu establecimiento</Text>
          </Layout>

          <Layout style={[styles.fondoPrincipal, { marginTop: 20 }]}>
            <Input
              placeholder="Nombre del Establecimiento"
              accessoryLeft={<MyIcon name="briefcase-outline" white />}
              value={form.establishmentName}
              onChangeText={(establishmentName) => setForm({ ...form, establishmentName })}
              status={errors.establishmentName ? 'danger' : 'basic'}
              caption={errors.establishmentName}
              style={[styles.input, errors.establishmentName ? styles.inputError : null]}
              textStyle={{ color: styles.input.color }}
            />
            <Input
              placeholder="Descripción"
              accessoryLeft={<MyIcon name="file-text-outline" white />}
              value={form.description}
              onChangeText={(description) => setForm({ ...form, description })}
              status={errors.description ? 'danger' : 'basic'}
              caption={errors.description}
              style={[styles.input, errors.description ? styles.inputError : null]}
              textStyle={{ color: styles.input.color }}
            />
            <Input
              placeholder="RUC"
              accessoryLeft={<MyIcon name="hash-outline" white />}
              value={form.ruc}
              onChangeText={(ruc) => setForm({ ...form, ruc })}
              status={errors.ruc ? 'danger' : 'basic'}
              caption={errors.ruc}
              style={[styles.input, errors.ruc ? styles.inputError : null]}
              textStyle={{ color: styles.input.color }}
            />

            <TimePicker
              label="Hora de Apertura"
              placeholder="Selecciona la hora"
              value={form.opening_time}
              onChange={(time) => setForm({ ...form, opening_time: time })}
              error={errors.opening_time}
              style={[styles.input, errors.opening_time ? styles.inputError : null]}
            />

            <TimePicker
              label="Hora de Cierre"
              placeholder="Selecciona la hora"
              value={form.closing_time}
              onChange={(time) => setForm({ ...form, closing_time: time })}
              error={errors.closing_time}
              style={[styles.input, errors.closing_time ? styles.inputError : null]}
            />
          </Layout>

          <Layout style={[styles.fondoPrincipal, { height: 15 }]} />

          <Layout style={styles.fondoPrincipal}>
            <Button
              style={styles.button}
              onPress={onNextStep}
              accessoryRight={<MyIcon name="arrow-forward-outline" white />}
            >
              Siguiente
            </Button>
          </Layout>
        </ScrollView>
      </Layout>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default EstablishmentRegisterScreenStep1;
