import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@ui-kitten/components';

interface StarRatingProps {
  rating: number; // Calificación del 1 al 5
  onRatingChange?: (rating: number) => void; // Callback para cuando cambia la calificación
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1); // Crea un array de 1 a 5

  const handleRatingPress = (star: number) => {
    if (onRatingChange) {
      onRatingChange(star); // Llama a la función de callback si está definida
    }
  };

  return (
    <View style={styles.container}>
      {stars.map(star => (
        <TouchableOpacity key={star} onPress={() => handleRatingPress(star)}>
          <Icon 
            name={star <= rating ? 'star' : 'star-outline'} 
            style={styles.star} 
            fill={star <= rating ? '#FFD700' : '#C0C0C0'} // Color dorado para estrellas llenas, gris para vacías
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    width: 30,
    height: 30,
    marginHorizontal: 2, // Espacio entre estrellas
  },
});

export default StarRating;
