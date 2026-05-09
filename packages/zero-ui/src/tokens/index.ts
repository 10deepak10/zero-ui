import colors from './primitives/colors.json';
import spacing from './primitives/spacing.json';
import typography from './primitives/typography.json';
import radius from './primitives/radius.json';
import shadows from './primitives/shadows.json';
import motion from './primitives/motion.json';

import brand from './brand/zeroui.json';

import semanticColors from './semantic/colors.json';
import semanticTypography from './semantic/typography.json';
import semanticElevation from './semantic/elevation.json';

import lightTheme from './themes/light.json';
import darkTheme from './themes/dark.json';

import buttonTokens from './components/button.json';
import cardTokens from './components/card.json';
import inputTokens from './components/input.json';
import dropdownTokens from './components/dropdown.json';
import checkboxTokens from './components/checkbox.json';
import toggleTokens from './components/toggle.json';
import sliderTokens from './components/slider.json';
import selectTokens from './components/select.json';

export const primitiveTokens = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  motion
};

export const brandTokens = brand;

export const semanticTokens = {
  colors: semanticColors,
  typography: semanticTypography,
  elevation: semanticElevation
};

export const themeTokens = {
  light: lightTheme,
  dark: darkTheme
};

export const componentTokens = {
  button: buttonTokens,
  card: cardTokens,
  input: inputTokens,
  dropdown: dropdownTokens,
  checkbox: checkboxTokens,
  toggle: toggleTokens,
  slider: sliderTokens,
  select: selectTokens
};

export const allTokens = {
  primitives: primitiveTokens,
  brand: brandTokens,
  semantic: semanticTokens,
  themes: themeTokens,
  components: componentTokens
};
