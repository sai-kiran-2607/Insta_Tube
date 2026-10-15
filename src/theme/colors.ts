/**
 * ReelFetch Design System - Colors
 * Clean, premium white-theme UI with purple, violet, and pink accents.
 */

export const colors = {
  // Backgrounds
  background: '#FFFFFF',
  backgroundElevated: '#FAFAFD',
  surface: '#FFFFFF',
  surfaceCard: '#FFFFFF',
  surfaceHighlight: '#F8FAFC',
  surfaceActive: '#F3F2FD',
  surfaceLightPurple: '#F5F0FF',
  surfaceLightPink: '#FDF2FA',

  // Borders & Dividers
  borderSubtle: '#EDEBF8',
  borderStrong: '#D9D5EE',
  borderFocus: '#7138F5',
  borderLightPurple: '#E8DEFE',

  // Accent Colors (ReelFetch Palette)
  primaryPurple: '#7138F5',
  primaryPurpleHover: '#5F27E5',
  deepPurple: '#4C1DCE',
  accentPink: '#F044C8',
  secondaryPink: '#F044C8',
  accentViolet: '#8B5CF6',
  lightPurple: '#F5F0FF',
  accentBlue: '#3B82F6',
  accentCyan: '#06B6D4',

  // Social / Source Accents
  instagramPink: '#F044C8',
  instagramPurple: '#7138F5',
  instagramOrange: '#F77737',

  // Semantic Status Colors
  success: '#16834A',
  successSurface: '#EFFDF4',
  warning: '#F59E0B',
  warningSurface: '#FFFBEB',
  error: '#DC3545',
  errorSurface: '#FEF2F3',
  info: '#7138F5',
  infoSurface: '#F5F0FF',

  // Typography
  textPrimary: '#17152A',
  textSecondary: '#68708A',
  textMuted: '#969EB5',
  textDisabled: '#CBD1DF',
  textInverse: '#FFFFFF',

  // Gradients (color arrays for LinearGradient)
  gradients: {
    primary: ['#7138F5', '#F044C8'] as const,
    purpleDeep: ['#7138F5', '#4C1DCE'] as const,
    accent: ['#7138F5', '#A855F7'] as const,
    surface: ['#FFFFFF', '#FAFAFD'] as const,
    card: ['#FFFFFF', '#FFFFFF'] as const,
    instagram: ['#7138F5', '#F044C8', '#FFA07A'] as const,
    badgeDark: ['rgba(113, 56, 245, 0.1)', 'rgba(240, 68, 200, 0.05)'] as const,
    heroIcon: ['#F044C8', '#7138F5'] as const,
    badgePurple: ['#F5F0FF', '#FCFAFF'] as const,
  },
} as const;

export type ColorsType = typeof colors;
