/**
 * Shadow and elevation presets for the design system.
 * Values combine web-style shadow strings (for RN web) and elevation numbers (for native).
 */

const createShadow = ({ android, ios, web }) => ({
  android, // elevation
  ios,     // shadow style for iOS
  web,     // fallback string for RN web
});

export const shadows = {
  none: createShadow({
    android: 0,
    ios: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    web: 'none',
  }),
  xs: createShadow({
    android: 1,
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 1,
    },
    web: '0 1px 2px rgba(15, 23, 42, 0.08)',
  }),
  sm: createShadow({
    android: 2,
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2.5,
    },
    web: '0 2px 4px rgba(15, 23, 42, 0.1)',
  }),
  md: createShadow({
    android: 4,
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 5,
    },
    web: '0 4px 10px rgba(15, 23, 42, 0.12)',
  }),
  lg: createShadow({
    android: 8,
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    web: '0 10px 30px rgba(15, 23, 42, 0.15)',
  }),
  xl: createShadow({
    android: 12,
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
    },
    web: '0 18px 45px rgba(15, 23, 42, 0.2)',
  }),
};

export const innerShadows = {
  subtle: 'inset 0 1px 2px rgba(15, 23, 42, 0.12)',
  medium: 'inset 0 2px 6px rgba(15, 23, 42, 0.16)',
  strong: 'inset 0 4px 12px rgba(15, 23, 42, 0.2)',
};

export const glows = {
  primary: '0 0 25px rgba(0, 102, 255, 0.35)',
  success: '0 0 20px rgba(16, 185, 129, 0.35)',
  warning: '0 0 20px rgba(251, 191, 36, 0.35)',
  danger: '0 0 20px rgba(239, 68, 68, 0.35)',
};

export const specialShadows = {
  floating: '0 15px 35px rgba(15, 23, 42, 0.18)',
  popover: '0 25px 45px rgba(15, 23, 42, 0.22)',
  dropdown: '0 12px 25px rgba(15, 23, 42, 0.18)',
  card: '0 8px 20px rgba(15, 23, 42, 0.12)',
};

export const componentShadows = {
  card: shadows.md,
  modal: shadows.lg,
  button: shadows.sm,
  input: shadows.xs,
  floatingAction: specialShadows.floating,
  tooltip: shadows.xs,
};

const shadowsConfig = {
  shadows,
  innerShadows,
  glows,
  specialShadows,
  componentShadows,
};

export default shadowsConfig;

