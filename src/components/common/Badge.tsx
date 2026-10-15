import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { DownloadStatus } from '@/types/download';
import { SupportedPlatform } from '@/types/link';

interface BadgeProps {
  label: string;
  variant?: 'platform' | 'status' | 'default';
  platform?: SupportedPlatform;
  status?: DownloadStatus;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  platform,
  status,
  style,
}) => {
  const getBadgeStyle = () => {
    if (variant === 'platform' && platform) {
      if (platform === 'instagram') {
        return {
          container: styles.instagramBadge,
          text: styles.instagramText,
        };
      }
      if (platform === 'direct') {
        return {
          container: styles.directBadge,
          text: styles.directText,
        };
      }
      return {
        container: styles.unsupportedBadge,
        text: styles.unsupportedText,
      };
    }

    if (variant === 'status' && status) {
      switch (status) {
        case 'pending':
          return {
            container: styles.pendingBadge,
            text: styles.pendingText,
          };
        case 'downloading':
          return {
            container: styles.downloadingBadge,
            text: styles.downloadingText,
          };
        case 'completed':
          return {
            container: styles.completedBadge,
            text: styles.completedText,
          };
        case 'failed':
          return {
            container: styles.failedBadge,
            text: styles.failedText,
          };
        case 'cancelled':
          return {
            container: styles.unsupportedBadge,
            text: styles.unsupportedText,
          };
      }
    }

    return {
      container: styles.defaultBadge,
      text: styles.defaultText,
    };
  };

  const badgeStyles = getBadgeStyle();

  return (
    <View style={[styles.baseContainer, badgeStyles.container, style]}>
      <Text style={[styles.baseText, badgeStyles.text]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  baseText: {
    ...typography.badge,
    fontSize: 10,
  },
  defaultBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  defaultText: {
    color: colors.textSecondary,
  },
  instagramBadge: {
    backgroundColor: 'rgba(225, 48, 108, 0.15)',
    borderColor: 'rgba(225, 48, 108, 0.35)',
  },
  instagramText: {
    color: colors.instagramPink,
  },
  directBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.35)',
  },
  directText: {
    color: colors.accentBlue,
  },
  unsupportedBadge: {
    backgroundColor: 'rgba(100, 116, 139, 0.15)',
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  unsupportedText: {
    color: colors.textMuted,
  },
  pendingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  pendingText: {
    color: colors.warning,
  },
  downloadingBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.35)',
  },
  downloadingText: {
    color: colors.accentBlue,
  },
  completedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  completedText: {
    color: colors.success,
  },
  failedBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  failedText: {
    color: colors.error,
  },
});
