/**
 * Legacy theme adapter linking to src/theme tokens.
 */
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const Colors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: colors.textPrimary,
    background: colors.background,
    backgroundElement: colors.surface,
    backgroundSelected: colors.surfaceActive,
    textSecondary: colors.textSecondary,
  },
} as const;

export const Spacing = {
  half: spacing.xxs,
  one: spacing.xs,
  two: spacing.sm,
  three: spacing.lg,
  four: spacing.xxl,
  five: spacing.xxxl,
  six: spacing.huge,
} as const;

export const BottomTabInset = 70;
export const MaxContentWidth = 600;
