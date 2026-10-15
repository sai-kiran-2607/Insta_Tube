import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { borderRadius, spacing } from '@/theme/spacing';
import { colors } from '@/theme/colors';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'highlight' | 'outlined';
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  style,
  children,
  ...rest
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return styles.elevated;
      case 'highlight':
        return styles.highlight;
      case 'outlined':
        return styles.outlined;
      default:
        return styles.default;
    }
  };

  return (
    <View style={[styles.base, getVariantStyle(), style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  elevated: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  highlight: {
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: colors.primaryPurple,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
});
