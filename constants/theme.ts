import { Dimensions } from 'react-native';
import colors from './colors';

const { width, height } = Dimensions.get('window');

export default {
  colors,
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 16,
    xl: 24,
    xxl: 32
  },
  fontSize: {
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  screen: {
    width,
    height
  }
};