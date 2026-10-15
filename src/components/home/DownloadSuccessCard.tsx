import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, ExternalLink, RotateCcw, Sparkles } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface DownloadSuccessCardProps {
  isAudio?: boolean;
  onViewInGallery?: () => void;
  onDownloadAnother?: () => void;
}

export const DownloadSuccessCard: React.FC<DownloadSuccessCardProps> = ({
  isAudio = false,
  onViewInGallery,
  onDownloadAnother,
}) => {
  return (
    <View style={styles.container}>
      {/* Celebration Checkmark Graphic with Confetti Sparkles (matching Reference Screen 6) */}
      <View style={styles.illustrationWrapper}>
        {/* Ambient glow */}
        <View style={styles.ambientGlow} />

        {/* Decorative Confetti Sparkles */}
        <View style={styles.sparkleTopLeft}>
          <Sparkles size={16} color="#F044C8" />
        </View>
        <View style={styles.sparkleTopRight}>
          <Sparkles size={14} color="#16834A" />
        </View>
        <View style={styles.sparkleBottomLeft}>
          <Sparkles size={14} color="#7138F5" />
        </View>
        <View style={styles.sparkleBottomRight}>
          <Sparkles size={18} color="#F59E0B" />
        </View>

        {/* Large Check Badge */}
        <LinearGradient
          colors={['#7138F5', '#4C1DCE']}
          style={styles.checkCircle}
        >
          <Check size={36} color="#FFFFFF" strokeWidth={3.5} />
        </LinearGradient>
      </View>

      {/* Success Title & Subtitle */}
      <Text style={styles.title}>Downloaded Successfully!</Text>
      <Text style={styles.subtitle}>
        {isAudio
          ? 'Audio saved to your device media library.'
          : 'Video saved to your device gallery.'}
      </Text>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        {onViewInGallery && (
          <Pressable
            onPress={onViewInGallery}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.buttonPressed,
            ]}
            accessibilityLabel="View in Gallery"
          >
            <LinearGradient
              colors={['#7138F5', '#4C1DCE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryGradient}
            >
              <ExternalLink size={18} color="#FFFFFF" style={styles.btnIcon} />
              <Text style={styles.primaryBtnText}>View in Gallery</Text>
            </LinearGradient>
          </Pressable>
        )}

        <Pressable
          onPress={onDownloadAnother}
          style={({ pressed }) => [
            styles.secondaryBtn,
            pressed && styles.buttonPressed,
          ]}
          accessibilityLabel="Download Another Video"
        >
          <RotateCcw size={16} color={colors.primaryPurple} style={styles.btnIcon} />
          <Text style={styles.secondaryBtnText}>Download Another</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEBF8',
    shadowColor: colors.primaryPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginTop: 16,
  },
  illustrationWrapper: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F0FF',
    opacity: 0.9,
  },
  sparkleTopLeft: {
    position: 'absolute',
    top: 4,
    left: 8,
  },
  sparkleTopRight: {
    position: 'absolute',
    top: 2,
    right: 12,
  },
  sparkleBottomLeft: {
    position: 'absolute',
    bottom: 6,
    left: 6,
  },
  sparkleBottomRight: {
    position: 'absolute',
    bottom: 4,
    right: 8,
  },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryPurple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 20,
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
    marginBottom: 24,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
  },
  primaryGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnIcon: {
    marginRight: 2,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#EDEBF8',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    color: colors.primaryPurple,
    fontSize: 15,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
