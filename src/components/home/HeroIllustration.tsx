import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Download, Play, Sparkles } from 'lucide-react-native';
import { colors } from '@/theme/colors';

export const HeroIllustration: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Ambient soft glow background */}
      <View style={styles.glow} />

      {/* Floating Sparkles */}
      <View style={styles.sparkleTop}>
        <Sparkles size={16} color={colors.primaryPurple} />
      </View>
      <View style={styles.sparkleRight}>
        <Sparkles size={12} color={colors.secondaryPink} />
      </View>

      {/* Tilted Main Video Card */}
      <View style={styles.tiltedCardWrapper}>
        <LinearGradient
          colors={['#F044C8', '#7138F5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          {/* Card inner background */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.98)', 'rgba(245, 240, 255, 0.95)']}
            style={styles.cardInner}
          >
            {/* Center Play Button */}
            <View style={styles.playButtonCircle}>
              <LinearGradient
                colors={['#F044C8', '#7138F5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.playGradient}
              >
                <Play size={18} color="#FFFFFF" fill="#FFFFFF" style={styles.playIcon} />
              </LinearGradient>
            </View>
          </LinearGradient>
        </LinearGradient>

        {/* Floating Download Circular Badge on Bottom Right */}
        <View style={styles.downloadBadgeWrapper}>
          <LinearGradient
            colors={['#7138F5', '#4C1DCE']}
            style={styles.downloadBadge}
          >
            <Download size={14} color="#FFFFFF" strokeWidth={2.6} />
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 96,
    height: 84,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 70,
    height: 60,
    borderRadius: 35,
    backgroundColor: '#F3E8FF',
    opacity: 0.8,
  },
  sparkleTop: {
    position: 'absolute',
    top: 0,
    right: 8,
  },
  sparkleRight: {
    position: 'absolute',
    bottom: 4,
    left: 2,
  },
  tiltedCardWrapper: {
    transform: [{ rotate: '10deg' }],
    position: 'relative',
  },
  cardGradient: {
    width: 76,
    height: 54,
    borderRadius: 14,
    padding: 2,
    shadowColor: colors.primaryPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardInner: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.secondaryPink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  playGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    marginLeft: 2,
  },
  downloadBadgeWrapper: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    shadowColor: colors.primaryPurple,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  downloadBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
