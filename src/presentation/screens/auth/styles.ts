import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  input: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222B45', // color inicial del borde
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'black',
    color:'white'
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
    backgroundColor:'#4A4A4A'
  },
  button: {
    backgroundColor: '#5BA246',
    borderColor: '#5BA246',
    borderRadius: 20,
  },
  textButton: {
    color: '#5BA246',
  },
  fondoPincipal:{
    backgroundColor:'#4A4A4A'
  }
});
