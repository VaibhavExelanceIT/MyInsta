import { Dimensions, PixelRatio } from 'react-native';
// import { images } from './imageHelper';

// Reference screen size from your Figma design
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Scales width from Figma to current screen
 * @param size - Width from design (e.g., 120)
 */
export const wp = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Scales height from Figma to current screen
 * @param size - Height from design (e.g., 400)
 */
export const hp = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Scales font size from Figma based on screen size
 * @param fontSize - Font size from design (e.g., 16)
 */
export const fs = (fontSize: number): number => {
  const scale = Math.min(
    SCREEN_WIDTH / BASE_WIDTH,
    SCREEN_HEIGHT / BASE_HEIGHT,
  );
  const newSize = fontSize * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// export { images };
