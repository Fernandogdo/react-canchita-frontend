import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Icon, useTheme } from '@ui-kitten/components';

interface Props {
  name: string;
  color?: string;
  white?: boolean;
  style?: StyleProp<ViewStyle>;  // Añade la propiedad style aquí
  size?: number;  // Añade la propiedad size aquí
}

export const MyIcon = ({ name, color, white = false, style,size = 30 }: Props) => {
  const theme = useTheme();

  if (white) {
    color = theme['color-info-100'];
  } else if (!color) {
    color = theme['text-basic-color'];
  } else {
    color = theme[color] ?? theme['text-basic-color'];
  }

  return <Icon style={[style,{ width: size, height: size }]} fill={color} name={name} />; // Aplica la propiedad style aquí
};

