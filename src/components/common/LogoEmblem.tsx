import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/theme/colors';

// Use the newly provided ReelFetch logo asset
const reelFetchLogo = require('../../../assets/insta.png');

interface LogoEmblemProps {
  size?: number;
}

export const LogoEmblem: React.FC<LogoEmblemProps> = ({ size = 42 }) => {
  const borderRadius = Math.round(size * 0.24);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={reelFetchLogo}
        style={[styles.logoImage, { width: size, height: size, borderRadius }]}
        contentFit="contain"
        transition={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryPurple,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  logoImage: {
    overflow: 'hidden',
  },
});
