/**
 * ReelFetch Design System - Spacing & Layout Tokens
 */

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 9999,
} as const;

export const layout = {
  minTouchTarget: 48,
  maxContentWidth: 600,
  cardBorderRadius: borderRadius.lg,
  inputHeight: 52,
  buttonHeight: 52,
  headerHeight: 64,
} as const;
