import { colors } from '@/theme/colors';
import { LinkParseResult, SupportedPlatform } from '@/types/link';
import { parseAndValidateUrl } from '@/utils/urlValidator';

export interface PlatformVisualConfig {
  name: string;
  badgeBackground: string;
  badgeTextColor: string;
  gradient: readonly [string, string, ...string[]];
  accentColor: string;
  iconName: string;
}

export const PLATFORM_CONFIGS: Record<SupportedPlatform, PlatformVisualConfig> = {
  instagram: {
    name: 'Instagram',
    badgeBackground: 'rgba(225, 48, 108, 0.18)',
    badgeTextColor: colors.instagramPink,
    gradient: colors.gradients.instagram,
    accentColor: colors.instagramPink,
    iconName: 'instagram',
  },
  direct: {
    name: 'Direct Media',
    badgeBackground: 'rgba(59, 130, 246, 0.18)',
    badgeTextColor: colors.accentBlue,
    gradient: colors.gradients.accent,
    accentColor: colors.accentBlue,
    iconName: 'video',
  },
  unsupported: {
    name: 'Unsupported',
    badgeBackground: 'rgba(100, 116, 139, 0.2)',
    badgeTextColor: colors.textMuted,
    gradient: ['#475569', '#334155'],
    accentColor: colors.textMuted,
    iconName: 'help-circle',
  },
};

export const linkService = {
  parse(url: string): LinkParseResult {
    return parseAndValidateUrl(url);
  },

  getVisualConfig(platform: SupportedPlatform): PlatformVisualConfig {
    return PLATFORM_CONFIGS[platform] || PLATFORM_CONFIGS.unsupported;
  },

  isSupported(platform: SupportedPlatform): boolean {
    return platform === 'instagram';
  },
};
