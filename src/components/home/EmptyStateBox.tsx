import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image as ImageIcon, Link2, Play, Sparkles } from 'lucide-react-native';
import { colors } from '@/theme/colors';

export const EmptyStateBox: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Soft ambient background glow blobs */}
      <View style={styles.glowBlobLeft} />
      <View style={styles.glowBlobRight} />

      {/* Floating Link Pill Badge (Left) */}
      <View style={styles.floatingPillLeft}>
        <LinearGradient
          colors={['#FFFFFF', '#FAF5FF']}
          style={styles.pillInner}
        >
          <Link2 size={16} color={colors.primaryPurple} />
        </LinearGradient>
      </View>

      {/* Floating Media Image Pill Badge (Right) */}
      <View style={styles.floatingPillRight}>
        <LinearGradient
          colors={['#FFFFFF', '#FAF5FF']}
          style={styles.pillInner}
        >
          <ImageIcon size={16} color={colors.primaryPurple} />
        </LinearGradient>
      </View>

      {/* Little floating sparkles */}
      <View style={styles.sparkleTop}>
        <Sparkles size={14} color="#C084FC" />
      </View>

      {/* 3D Open Box Container */}
      <View style={styles.boxWrapper}>
        {/* Open flaps */}
        <View style={styles.flapsRow}>
          <LinearGradient
            colors={['#E9D5FF', '#C084FC']}
            style={[styles.flap, styles.flapLeft]}
          />
          <LinearGradient
            colors={['#FBCFE8', '#F472B6']}
            style={[styles.flap, styles.flapRight]}
          />
        </View>

        {/* Box Front Face */}
        <LinearGradient
          colors={['#8B5CF6', '#6D28D9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.boxFront}
        >
          {/* Inner Play Icon */}
          <View style={styles.playContainer}>
            <Play size={20} color="#FFFFFF" fill="#FFFFFF" style={styles.playIcon} />
          </View>
        </LinearGradient>

        {/* Soft shadow under the box */}
        <View style={styles.boxBottomShadow} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowBlobLeft: {
    position: 'absolute',
    top: 20,
    left: 10,
    width: 50,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    opacity: 0.7,
  },
  glowBlobRight: {
    position: 'absolute',
    top: 24,
    right: 12,
    width: 50,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCE7F3',
    opacity: 0.7,
  },
  floatingPillLeft: {
    position: 'absolute',
    top: 6,
    left: 20,
    shadowColor: colors.primaryPurple,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    transform: [{ rotate: '-12deg' }],
  },
  floatingPillRight: {
    position: 'absolute',
    top: 4,
    right: 22,
    shadowColor: colors.secondaryPink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    transform: [{ rotate: '12deg' }],
  },
  pillInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
  },
  sparkleTop: {
    position: 'absolute',
    top: -2,
    left: 80,
  },
  boxWrapper: {
    alignItems: 'center',
    marginTop: 18,
    position: 'relative',
  },
  flapsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: -4,
    zIndex: 2,
  },
  flap: {
    width: 34,
    height: 16,
    borderRadius: 4,
  },
  flapLeft: {
    transform: [{ rotate: '-20deg' }, { skewX: '-10deg' }],
    marginRight: -4,
  },
  flapRight: {
    transform: [{ rotate: '20deg' }, { skewX: '10deg' }],
    marginLeft: -4,
  },
  boxFront: {
    width: 68,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryPurple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 3,
  },
  playContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    marginLeft: 2,
  },
  boxBottomShadow: {
    width: 60,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    marginTop: 4,
    alignSelf: 'center',
  },
});
