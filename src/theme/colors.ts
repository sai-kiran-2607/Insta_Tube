/**
 * ReelFetch Design System - Colors
 * Clean, premium white-theme UI with purple, violet, and pink accents.
 */

export const colors = {
  // Backgrounds
  background: '#FFFFFF',
  backgroundElevated: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceCard: '#FFFFFF',
  surfaceHighlight: '#F8FAFC',
  surfaceActive: '#F1F5F9',
  surfaceLightPurple: '#F3E8FF',
  surfaceLightPink: '#FDF2F8',

  // Borders & Dividers
  borderSubtle: '#E8ECF4',
  borderStrong: '#CBD5E1',
  borderFocus: '#7C3AED',
  borderLightPurple: '#E9D5FF',

  // Accent Colors (Purple, Violet, Pink)
  primaryPurple: '#7C3AED',
  primaryPurpleHover: '#6D28D9',
  accentViolet: '#8B5CF6',
  lightPurple: '#F3E8FF',
  secondaryPink: '#EC4899',
  accentBlue: '#3B82F6',
  accentCyan: '#06B6D4',

  // Social / Source Accents
  instagramPink: '#E1306C',
  instagramPurple: '#833AB4',
  instagramOrange: '#F77737',

  // Semantic Status Colors
  success: '#10B981',
  successSurface: '#ECFDF5',
  warning: '#F59E0B',
  warningSurface: '#FFFBEB',
  error: '#EF4444',
  errorSurface: '#FEF2F2',
  info: '#3B82F6',
  infoSurface: '#EFF6FF',

  // Typography
  textPrimary: '#111827',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textDisabled: '#CBD5E1',
  textInverse: '#FFFFFF',

  // Gradients (color arrays for LinearGradient)
  gradients: {
    primary: ['#7C3AED', '#EC4899'] as const,
    accent: ['#7C3AED', '#A855F7'] as const,
    surface: ['#FFFFFF', '#F8FAFC'] as const,
    card: ['#FFFFFF', '#FFFFFF'] as const,
    instagram: ['#833AB4', '#FD1D1D', '#FCB045'] as const,
    badgeDark: ['rgba(124, 58, 237, 0.1)', 'rgba(236, 72, 153, 0.05)'] as const,
    heroIcon: ['#EC4899', '#7C3AED'] as const,
    badgePurple: ['#F3E8FF', '#FAF5FF'] as const,
  },
} as const;

export type ColorsType = typeof colors;
