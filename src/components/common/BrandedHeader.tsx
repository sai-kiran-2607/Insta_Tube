import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { LogoEmblem } from './LogoEmblem';

interface BrandedHeaderProps {
  title?: string;
  subtitle?: string;
  showBadge?: boolean;
}

export const BrandedHeader: React.FC<BrandedHeaderProps> = ({
  title = 'ReelFetch',
  subtitle = 'Instagram Reel Utility',
  showBadge = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <LogoEmblem size={44} />
        <View style={styles.titleColumn}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </View>
      </View>

      {showBadge && (
        <View style={styles.badge}>
          <View style={styles.activeDot} />
          <Text style={styles.badgeText}>Ready</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  titleColumn: {
    justifyContent: 'center',
  },
  titleText: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  subtitleText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    gap: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  badgeText: {
    ...typography.captionBold,
    color: colors.success,
    fontSize: 11,
  },
});
