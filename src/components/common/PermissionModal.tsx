import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Download, Folder, Lock, Sparkles } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface PermissionModalProps {
  visible: boolean;
  onAllow: () => void;
  onDismiss: () => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  visible,
  onAllow,
  onDismiss,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Centered Lock / Storage Illustration (matching Reference Screen 9) */}
          <View style={styles.illustrationWrapper}>
            {/* Soft pink/lavender background circle */}
            <View style={styles.circleBg} />

            {/* Sparkles */}
            <View style={styles.sparkleTopLeft}>
              <Sparkles size={16} color="#F044C8" />
            </View>
            <View style={styles.sparkleBottomRight}>
              <Sparkles size={14} color="#7138F5" />
            </View>

            {/* Folder & Padlock Container */}
            <View style={styles.folderContainer}>
              <LinearGradient
                colors={['#8B5CF6', '#6D28D9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.folderGradient}
              >
                <Folder size={38} color="#FFFFFF" />
              </LinearGradient>

              {/* Golden Yellow Padlock Badge */}
              <View style={styles.lockBadge}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.lockGradient}
                >
                  <Lock size={16} color="#FFFFFF" strokeWidth={2.5} />
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Heading & Explanation */}
          <Text style={styles.title}>Allow Storage Access</Text>
          <Text style={styles.description}>
            ReelFetch needs access to your media library to save downloaded videos.
          </Text>

          {/* Primary Allow Access Button */}
          <Pressable
            onPress={onAllow}
            style={({ pressed }) => [
              styles.allowButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityLabel="Allow Media Access"
          >
            <LinearGradient
              colors={['#7138F5', '#4C1DCE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.allowGradient}
            >
              <Download size={18} color="#FFFFFF" style={styles.allowIcon} />
              <Text style={styles.allowText}>Allow Access</Text>
            </LinearGradient>
          </Pressable>

          {/* Secondary Not Now Button */}
          <Pressable
            onPress={onDismiss}
            style={({ pressed }) => [
              styles.dismissButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityLabel="Dismiss permission dialog"
          >
            <Text style={styles.dismissText}>Not Now</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 21, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  illustrationWrapper: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  circleBg: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#F5F0FF',
    opacity: 0.85,
  },
  sparkleTopLeft: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  sparkleBottomRight: {
    position: 'absolute',
    bottom: 12,
    right: 10,
  },
  folderContainer: {
    position: 'relative',
  },
  folderGradient: {
    width: 72,
    height: 72,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryPurple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  lockBadge: {
    position: 'absolute',
    bottom: -6,
    right: -8,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  lockGradient: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#17152A',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#68708A',
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  allowButton: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  allowGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  allowIcon: {
    marginRight: 2,
  },
  allowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dismissButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dismissText: {
    color: '#68708A',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
