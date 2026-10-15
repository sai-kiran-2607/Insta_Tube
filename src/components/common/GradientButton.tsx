import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';
import { borderRadius, layout, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
}) => {
  const isInteractive = !disabled && !loading;

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={!isInteractive}
        style={({ pressed }) => [
          styles.pressableWrapper,
          pressed && isInteractive && styles.pressed,
          disabled && styles.disabledWrapper,
          style,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: !isInteractive, busy: loading }}
      >
        <LinearGradient
          colors={
            disabled
              ? ['#2C335A', '#202542']
              : colors.gradients.primary
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientContainer}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.textPrimary} />
          ) : (
            <View style={styles.contentRow}>
              {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
              <Text style={[styles.primaryLabel, disabled && styles.disabledLabel]}>
                {label}
              </Text>
              {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
            </View>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  // Secondary, Outline, or Ghost
  return (
    <Pressable
      onPress={onPress}
      disabled={!isInteractive}
      style={({ pressed }) => [
        styles.standardButton,
        variant === 'outline' && styles.outlineButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'ghost' && styles.ghostButton,
        pressed && isInteractive && styles.pressed,
        disabled && styles.disabledWrapper,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.textPrimary} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            style={[
              styles.standardLabel,
              variant === 'outline' && styles.outlineLabel,
              disabled && styles.disabledLabel,
            ]}
          >
            {label}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressableWrapper: {
    minHeight: layout.buttonHeight,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    shadowColor: colors.primaryPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientContainer: {
    minHeight: layout.buttonHeight,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  standardButton: {
    minHeight: layout.buttonHeight,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  primaryLabel: {
    ...typography.button,
    color: colors.textPrimary,
  },
  standardLabel: {
    ...typography.button,
    color: colors.textPrimary,
  },
  outlineLabel: {
    color: colors.textSecondary,
  },
  disabledWrapper: {
    opacity: 0.55,
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledLabel: {
    color: colors.textDisabled,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
});
