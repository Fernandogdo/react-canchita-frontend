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
    backgroundColor: '#615e5e'
  },
  select: {
    borderRadius: 20,
    borderColor: '#000', // color inicial del borde
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  selectFocused: {
    backgroundColor: '#615e5e'
  },
  inputError: {
    borderColor: 'red', // color del borde cuando hay un error
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
  // Estilos de RoleScreen
  cardContainer: {
    flexDirection: 'column', // Cambiado a columna para que las tarjetas estén una debajo de otra
    justifyContent: 'space-around',
    marginTop: 20,
    height: '50%', // Ajusta esto según sea necesario para la separación vertical
  },
  card: {
    backgroundColor: '#5BA246',
    borderColor: '#5BA246',
    borderRadius: 10,
    width: '100%',
    marginBottom: 20, // Espaciado entre las tarjetas
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#5BA246', // Asegura que el fondo del contenido de la tarjeta también sea verde
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
});
