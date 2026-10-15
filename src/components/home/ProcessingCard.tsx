import React, { useEffect, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Sparkles } from 'lucide-react-native';
import { colors } from '@/theme/colors';

export const ProcessingCard: React.FC = () => {
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const [rotateAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    // Gentle pulsating loop
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    // Subtle slow rotation for sparkles
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      })
    );

    pulse.start();
    rotate.start();

    return () => {
      pulse.stop();
      rotate.stop();
    };
  }, [pulseAnim, rotateAnim]);

  return (
    <View style={styles.container}>
      {/* Centered Magnifier Illustration matching Reference Screen 3 */}
      <View style={styles.illustrationWrapper}>
        <Animated.View
          style={[
            styles.ambientCircle,
            { transform: [{ scale: pulseAnim }] },
          ]}
        />

        {/* Decorative Sparkles */}
        <View style={styles.sparkleTopLeft}>
          <Sparkles size={16} color="#F044C8" />
        </View>
        <View style={styles.sparkleBottomRight}>
          <Sparkles size={14} color="#7138F5" />
        </View>

        {/* Main Magnifier Circle */}
        <LinearGradient
          colors={['#8B5CF6', '#6D28D9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.magnifierCircle}
        >
          <Search size={32} color="#FFFFFF" strokeWidth={2.8} />
        </LinearGradient>
      </View>

      {/* Status Headlines */}
      <Text style={styles.title}>Fetching video details...</Text>
      <Text style={styles.subtitle}>Please wait, this may take a few seconds.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  ambientCircle: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F5F0FF',
    opacity: 0.8,
  },
  sparkleTopLeft: {
    position: 'absolute',
    top: 6,
    left: 8,
  },
  sparkleBottomRight: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  magnifierCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryPurple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#17152A',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#68708A',
    textAlign: 'center',
    fontWeight: '400',
  },
});
