import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  input: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000', // color inicial del borde
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inputFocused: {
    borderColor: '#fff', // color del borde cuando está enfocado
  },
  containerCentered: {
    flex: 1,
    justifyContent: 'center', // centrado verticalmente
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center', // centrado verticalmente
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: '#5BA246',
    borderColor: '#000',
  },
  textButton: {
    color: '#5BA246',
  },
});
