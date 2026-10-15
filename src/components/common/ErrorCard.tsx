import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface ErrorCardProps {
  title?: string;
  message: string;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  title = 'Invalid Link',
  message,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        <AlertCircle size={22} color={colors.error} />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FEF2F3',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(220, 53, 69, 0.2)',
    marginTop: 14,
    gap: 12,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.error,
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 18,
  },
});
