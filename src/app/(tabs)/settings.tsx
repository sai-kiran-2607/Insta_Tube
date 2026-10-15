import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {
  FolderOpen,
  Trash2,
} from 'lucide-react-native';
import { LogoEmblem } from '@/components/common/LogoEmblem';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { useDownloads } from '@/hooks/useDownloads';
import { colors } from '@/theme/colors';

export default function SettingsScreen() {
  const [autoSaveGallery, setAutoSaveGallery] = useState(true);
  const { downloads, clearAll } = useDownloads();

  const handleClearCache = () => {
    Alert.alert('Clear Download Cache', 'Delete all downloaded files from application storage?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear Cache',
        style: 'destructive',
        onPress: () => clearAll(),
      },
    ]);
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>Settings</Text>
          <Text style={styles.screenSubtitle}>App preferences and options</Text>
        </View>

        {/* App Identity Card */}
        <View style={styles.identityCard}>
          <LogoEmblem size={52} />
          <View style={styles.identityTextCol}>
            <View style={styles.appNameRow}>
              <Text style={styles.appNameDark}>Reel</Text>
              <Text style={styles.appNamePurple}>Fetch</Text>
            </View>
            <Text style={styles.versionText}>Version 1.0.0 • Clean Native UI</Text>
          </View>
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionHeading}>PREFERENCES</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingItemRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Auto-Save to Gallery</Text>
              <Text style={styles.settingDesc}>
                Automatically export completed videos to device media gallery
              </Text>
            </View>
            <Switch
              value={autoSaveGallery}
              onValueChange={setAutoSaveGallery}
              trackColor={{ false: '#CBD5E1', true: colors.surfaceLightPurple }}
              thumbColor={autoSaveGallery ? colors.primaryPurple : '#94A3B8'}
            />
          </View>
        </View>

        {/* Android Share Sheet Integration Guide */}
        <Text style={styles.sectionHeading}>SHARE INTEGRATION</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.guideItem}>
            <View style={styles.guideStepCircle}>
              <Text style={styles.guideStepNumber}>1</Text>
            </View>
            <Text style={styles.guideText}>
              Open Instagram and tap <Text style={styles.boldText}>Share</Text> on any Reel.
            </Text>
          </View>

          <View style={styles.guideDivider} />

          <View style={styles.guideItem}>
            <View style={styles.guideStepCircle}>
              <Text style={styles.guideStepNumber}>2</Text>
            </View>
            <Text style={styles.guideText}>
              Select <Text style={styles.boldText}>ReelFetch</Text> from the Android share sheet.
            </Text>
          </View>

          <View style={styles.guideDivider} />

          <View style={styles.guideItem}>
            <View style={styles.guideStepCircle}>
              <Text style={styles.guideStepNumber}>3</Text>
            </View>
            <Text style={styles.guideText}>
              The link is auto-detected. Tap <Text style={styles.boldText}>Get Video</Text> to preview and download!
            </Text>
          </View>
        </View>

        {/* Storage Management Section */}
        <Text style={styles.sectionHeading}>STORAGE & DATA</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.storageInfoRow}>
            <View style={styles.storageIconWrapper}>
              <FolderOpen size={18} color={colors.primaryPurple} />
            </View>
            <View style={styles.storageTextCol}>
              <Text style={styles.storageLabel}>Downloaded Media</Text>
              <Text style={styles.storageSubtext}>
                {downloads.length} files currently stored in app storage
              </Text>
            </View>
          </View>

          <View style={styles.guideDivider} />

          <Pressable
            onPress={handleClearCache}
            style={({ pressed }) => [styles.clearCacheBtn, pressed && styles.pressed]}
            accessibilityLabel="Clear all downloads cache"
          >
            <Trash2 size={16} color={colors.error} />
            <Text style={styles.clearCacheText}>Clear All Downloaded Files</Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  headerRow: {
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  identityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  identityTextCol: {
    marginLeft: 14,
  },
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appNameDark: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  appNamePurple: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryPurple,
  },
  versionText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTextCol: {
    flex: 1,
    paddingRight: 14,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  guideStepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  guideStepNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryPurple,
  },
  guideText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
    color: '#111827',
  },
  guideDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  storageInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storageIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  storageTextCol: {
    flex: 1,
  },
  storageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  storageSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  clearCacheBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
  },
  clearCacheText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
