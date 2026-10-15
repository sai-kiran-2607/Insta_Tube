import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LogoEmblem } from './LogoEmblem';

const { width, height } = Dimensions.get('window');

interface SplashScreenViewProps {
  onFinish?: () => void;
  duration?: number;
}

export const SplashScreenView: React.FC<SplashScreenViewProps> = ({
  onFinish,
  duration = 1800,
}) => {
  const [fadeAnim] = useState(() => new Animated.Value(1));
  const [progressAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.92));

  useEffect(() => {
    // Animate progress bar and logo scale
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: duration - 300,
        useNativeDriver: false,
      }),
    ]).start();

    // Trigger fade out after duration
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        onFinish?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, fadeAnim, onFinish, progressAnim, scaleAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Soft Ambient Corner Glows matching Reference Screen 1 */}
      <View style={styles.ambientGlowTopLeft}>
        <LinearGradient
          colors={['rgba(240, 68, 200, 0.18)', 'rgba(113, 56, 245, 0.08)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={styles.ambientGlowBottomRight}>
        <LinearGradient
          colors={['transparent', 'rgba(113, 56, 245, 0.1)', 'rgba(240, 68, 200, 0.18)']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Centered Brand Content */}
      <Animated.View style={[styles.centerContent, { transform: [{ scale: scaleAnim }] }]}>
        <LogoEmblem size={96} />
        
        <View style={styles.titleRow}>
          <Text style={styles.titleReel}>Reel</Text>
          <Text style={styles.titleFetch}>Fetch</Text>
        </View>

        <Text style={styles.subtitle}>Instagram Reels Saver</Text>
      </Animated.View>

      {/* Bottom Tagline & Progress Bar */}
      <View style={styles.bottomArea}>
        <Text style={styles.tagline}>Save Reels. Watch Anytime.</Text>
        <View style={styles.progressBarTrack}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]}>
            <LinearGradient
              colors={['#7138F5', '#F044C8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ambientGlowTopLeft: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: width * 0.75,
    height: height * 0.4,
    borderRadius: width * 0.4,
    overflow: 'hidden',
  },
  ambientGlowBottomRight: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: width * 0.8,
    height: height * 0.45,
    borderRadius: width * 0.4,
    overflow: 'hidden',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  titleReel: {
    fontSize: 34,
    fontWeight: '800',
    color: '#17152A',
    letterSpacing: -0.5,
  },
  titleFetch: {
    fontSize: 34,
    fontWeight: '800',
    color: '#7138F5',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#68708A',
    marginTop: 6,
    letterSpacing: -0.2,
  },
  bottomArea: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 13,
    fontWeight: '600',
    color: '#969EB5',
    letterSpacing: 0.2,
    marginBottom: 16,
  },
  progressBarTrack: {
    width: 130,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F0EAFE',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
});
