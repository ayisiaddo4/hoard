/*
 *
 *  Style
 *
 * Usage:
 *
 * // in some component
 * import styles from 'styles/index.js'
 * <View style={styles.container} />
 */

import { StyleSheet, Dimensions } from 'react-native';

export const Theme = {
  light: 'light',
  dark: 'dark',
};

export const calculateHitSlop = (height, widthArg) => {
  const MIN_TOUCH_TARGET = 44;

  let width = widthArg;
  if (!widthArg) {
    width = height;
  }

  let verticalSlop = 0;
  let horizontalSlop = 0;

  const missingWidth = Math.max(MIN_TOUCH_TARGET - width, 0);
  if (missingWidth) {
    horizontalSlop = missingWidth / 2;
  }

  const missingHeight = Math.max(MIN_TOUCH_TARGET - height, 0);
  if (missingHeight) {
    verticalSlop = missingHeight / 2;
  }

  return {
    top: verticalSlop,
    bottom: verticalSlop,
    left: horizontalSlop,
    right: horizontalSlop,
  };
};

// Colors
export const colors = {
  white: '#ffffff', // rgba(255, 255, 255, 1)
  grayLighter: '#dedfe5', // rgba(222, 223, 229, 1)
  grayLight: '#8c8fa5', // rgba(140, 143, 165, 1)
  gray: '#5f627d', // rgba(95, 98, 125, 1)
  grayDark: '#313347', // rgba(49, 51, 71, 1)
  grayDarker: '#17181e', // rgba(23, 24, 30, 1)
  black: '#000000', // rgba(0, 0, 0, 1)

  pinkDark: '#E5129A', // rgba(229, 18, 154, 1)
  violet: '#9E0C6A', // rgba(158, 12, 106, 1)
  greenLighter: '#00EC9E', //rgb(0, 236, 158)
  greenLight: '#00a073', // rgba(0, 160, 115, 1)
  greenBlue: '#007982', // rgba(0, 121, 130, 1)

  blueGray: '#3d434a', // rgba(61, 67, 74, 1)

  red: '#FF6161',
  green: '#33FF33',
  blue: '#00C1FF',

  error: '#FF6161',
  success: '#33FF33',
  active: '#00C1FF',
};

export const colorsRGBA = {
  white: 'rgba(255, 255, 255, 1)',
  grayLighter: 'rgba(222, 223, 229, 1)',
  grayLight: 'rgba(140, 143, 165, 1)',
  gray: 'rgba(95, 98, 125, 1)',
  grayDark: 'rgba(49, 51, 71, 1)',
  grayDarker: 'rgba(23, 24, 30, 1)',
  black: 'rgba(0, 0, 0, 1)',
  pinkDark: 'rgba(229, 18, 154, 1)',
  violet: 'rgba(158, 12, 106, 1)',
  greenLighter: 'rgb(0, 236, 158)',
  greenLight: 'rgba(0, 160, 115, 1)',
  greenBlue: 'rgba(0, 121, 130, 1)',
  blueGray: 'rgba(61, 67, 74, 1)',
};

export const adjustRGBAOpacity = (rgba, opacity) =>
  rgba.replace(/\d\.?\d?\)$/, `${opacity})`);

export const gradients = {
  green: [colors.greenLight, colors.greenBlue],
  blue: [colors.grayDark, colors.grayDarker],
  transparentBlueGray: [
    adjustRGBAOpacity(colorsRGBA.blueGray, 0),
    colorsRGBA.blueGray,
  ],
  pink: [colors.pinkDark, colors.violet],
  light: [colors.grayLighter, colors.grayLight],
  horizontal: {
    start: { x: 0, y: 1 },
    end: { x: 1, y: 1 },
  },
  vertical: {
    start: { x: 1, y: 1 },
    end: { x: 1, y: 0 },
  },
  topLeft: {
    start: { x: 0.0, y: 0.1 },
    end: { x: 0.1, y: 1.0 },
  },
};

// Typography
export const typography = {
  size: {
    sm: 12,
    normal: 14,
    md: 18,
    lg: 28,
    xl: 32,
    xxl: 44,
  },
  lineHeight: {
    sm: 18,
    normal: 20,
    md: 26,
    lg: 32,
  },
  letterSpacing: {
    sm: -1,
    normal: 0,
    md: 1,
    lg: 1.5,
  },
  weight: {
    thin: '100',
    light: '200',
    normal: '400',
    semibold: '600',
    bold: '800',
  },
  family: {
    serif: 'Cochin',
    sans: 'HelveticaNeue',
    primary: 'HelveticaNeue',
  },
};

// Layout & Dimensions
export const dimensions = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
};

export const breakpoints = {
  height: {
    XS: 500,
    S: 600,
    M: 700,
    L: 800,
    XL: 900,
    TABLET_S: 1000,
    TABLET_M: 1200,
    TABLET_L: 1300,
    TABLET_XL: 1500,
  },
  width: {
    XS: 320,
    S: 360,
    M: 375,
    L: 400,
    XL: 500,
    TABLET_S: 720,
    TABLET_M: 768,
    TABLET_L: 800,
    TABLET_XL: 1024,
  },
};

export const padding = {
  sm: 10,
  md: 20,
  lg: 30,
  xl: 40,
};

const baseStyles = {
  container: {
    paddingHorizontal: padding.sm,
    paddingVertical: padding.lg,
    width: dimensions.fullWidth,
  },
  header: {
    backgroundColor: 'transparent',
    fontSize: typography.size.lg,
    fontFamily: typography.family.primary,
    fontWeight: typography.weight.semibold,
  },
  text: {
    fontSize: typography.size.lg,
    fontFamily: typography.family.primary,
    fontWeight: typography.weight.light,
    letterSpacing: 1.5,
  },
  section: {
    paddingVertical: padding.sm,
    paddingHorizontal: padding.sm,
  },
};

/*
   Create Styles

   Usage:

   // import exported styles & methods
   import createStyles, {typography, colors} from '../../styles/base.js'

  // override default styles
  const panelStyles = createStyles({
    section: {
      fontSize: typography.md,
      color: colors.secondary
    }
  })

  // use new overridden
  <View style={panelStyles.section}>...</View>
 */
export default function createStyles(overrides = {}) {
  return StyleSheet.create({ ...baseStyles, ...overrides });
}

export const themeColors = {
  [Theme.light]: {
    background: '#FFFFFF',
    chartNegative: '#C30072',
    chartPositive: '#21FF78',
    interactivePrimary: '#33BD5A',
    interactivePrimaryText: '#FFFFFF',
    interactiveSecondary: '#2DA64E',
    interactiveSecondaryText: '#FFFFFF',
    menu: '#3B4D5E',
    textNegative: '#C30072',
    textPositive: '#4EBE70',
    textPrimary: '#27323D',
    textSecondary: '#526271',
  },
  [Theme.dark]: {
    background: '#171D2B',
    chartNegative: '#C30072',
    chartPositive: '#21FF78',
    interactivePrimary: '#1BB443',
    interactivePrimaryText: '#FFFFFF',
    interactiveSecondary: '#1B923D',
    interactiveSecondaryText: '#FFFFFF',
    menu: '#FFFFFF',
    textNegative: '#CF0044',
    textPositive: '#1EDC6B',
    textPrimary: '#FFFFFF',
    textSecondary: '#8D9FAE',
  },
};

let currentTheme = Theme.dark;

export function setTheme(theme) {
  return (currentTheme = theme);
}

export function getTheme() {
  return currentTheme;
}

export function getColors() {
  return themeColors[currentTheme];
}
