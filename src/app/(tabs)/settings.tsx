import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {
  Bell,
  ChevronRight,
  Folder,
  Info,
  RotateCcw,
  Shield,
  Trash2,
  Video,
  X,
} from 'lucide-react-native';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { LogoEmblem } from '@/components/common/LogoEmblem';
import { useDownloads } from '@/hooks/useDownloads';

export default function SettingsScreen() {
  const { downloads, clearAll } = useDownloads();

  const [autoSaveGallery, setAutoSaveGallery] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [qualityPreference, setQualityPreference] = useState<'ask' | 'hd' | 'sd' | 'audio'>('ask');
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const getQualityText = () => {
    switch (qualityPreference) {
      case 'hd':
        return 'Always HD (1080p)';
      case 'sd':
        return 'Always SD (720p)';
      case 'audio':
        return 'Always Audio (MP3)';
      default:
        return 'Ask every time';
    }
  };

  const handleClearHistory = () => {
    if (downloads.length === 0) {
      Alert.alert('History Empty', 'There are no downloaded items in your history.');
      return;
    }

    Alert.alert(
      'Clear Download History',
      'Are you sure you want to clear your download history and delete all saved files?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAll();
            Alert.alert('Cleared', 'Download history has been cleared.');
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Top Header matching Reference Screen 8 */}
          <Text style={styles.screenTitle}>Settings</Text>

          {/* Group 1: Storage & Format */}
          <View style={styles.settingsGroup}>
            {/* Download Location */}
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Download Location',
                  'Files are securely stored in Internal Storage under ReelFetch and accessible in your device media gallery.'
                );
              }}
              style={({ pressed }) => [styles.settingItem, pressed && styles.itemPressed]}
              accessibilityLabel="View Download Location"
            >
              <View style={styles.iconCircle}>
                <Folder size={18} color="#7138F5" />
              </View>
              <View style={styles.itemTextCol}>
                <Text style={styles.itemTitle}>Download Location</Text>
                <Text style={styles.itemSubtitle}>Internal Storage/ReelFetch</Text>
              </View>
              <ChevronRight size={18} color="#969EB5" />
            </Pressable>

            <View style={styles.divider} />

            {/* Video Quality Preference */}
            <Pressable
              onPress={() => setShowQualityModal(true)}
              style={({ pressed }) => [styles.settingItem, pressed && styles.itemPressed]}
              accessibilityLabel="Select Video Quality Preference"
            >
              <View style={styles.iconCircle}>
                <Video size={18} color="#7138F5" />
              </View>
              <View style={styles.itemTextCol}>
                <Text style={styles.itemTitle}>Video Quality</Text>
                <Text style={styles.itemSubtitle}>{getQualityText()}</Text>
              </View>
              <ChevronRight size={18} color="#969EB5" />
            </Pressable>
          </View>

          {/* Group 2: Notifications & Gallery Auto-save */}
          <View style={styles.settingsGroup}>
            {/* Notifications */}
            <View style={styles.settingItem}>
              <View style={styles.iconCircle}>
                <Bell size={18} color="#7138F5" />
              </View>
              <View style={styles.itemTextCol}>
                <Text style={styles.itemTitle}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#D9D5EE', true: '#7138F5' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            {/* Auto Save to Gallery */}
            <View style={styles.settingItem}>
              <View style={styles.iconCircle}>
                <RotateCcw size={18} color="#7138F5" />
              </View>
              <View style={styles.itemTextCol}>
                <Text style={styles.itemTitle}>Auto Save to Gallery</Text>
              </View>
              <Switch
                value={autoSaveGallery}
                onValueChange={setAutoSaveGallery}
                trackColor={{ false: '#D9D5EE', true: '#7138F5' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Group 3: History & Legal */}
          <View style={styles.settingsGroup}>
            {/* Clear Download History */}
            <Pressable
              onPress={handleClearHistory}
              style={({ pressed }) => [styles.settingItem, pressed && styles.itemPressed]}
              accessibilityLabel="Clear Download History"
            >
              <View style={styles.iconCircle}>
                <Trash2 size={18} color="#7138F5" />
              </View>
              <View style={styles.itemTextCol}>
                <Text style={styles.itemTitle}>Clear Download History</Text>
              </View>
              <ChevronRight size={18} color="#969EB5" />
            </Pressable>

            <View style={styles.divider} />

            {/* Privacy Policy */}
            <Pressable
              onPress={() => setShowPrivacyModal(true)}
              style={({ pressed }) => [styles.settingItem, pressed && styles.itemPressed]}
              accessibilityLabel="View Privacy Policy"
            >
              <View style={styles.iconCircle}>
                <Shield size={18} color="#7138F5" />
              </View>
              <View style={styles.itemTextCol}>
                <Text style={styles.itemTitle}>Privacy Policy</Text>
              </View>
              <ChevronRight size={18} color="#969EB5" />
            </Pressable>

            <View style={styles.divider} />

            {/* About ReelFetch */}
            <Pressable
              onPress={() => setShowAboutModal(true)}
              style={({ pressed }) => [styles.settingItem, pressed && styles.itemPressed]}
              accessibilityLabel="About ReelFetch"
            >
              <View style={styles.iconCircle}>
                <Info size={18} color="#7138F5" />
              </View>
              <View style={styles.itemTextCol}>
                <Text style={styles.itemTitle}>About ReelFetch</Text>
              </View>
              <Text style={styles.versionText}>v1.0.0</Text>
              <ChevronRight size={18} color="#969EB5" style={{ marginLeft: 6 }} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Quality Preference Modal */}
      <Modal
        visible={showQualityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQualityModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowQualityModal(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeaderTitle}>Default Quality</Text>
            {[
              { id: 'ask', label: 'Ask every time' },
              { id: 'hd', label: 'Always HD (1080p MP4)' },
              { id: 'sd', label: 'Always SD (720p MP4)' },
              { id: 'audio', label: 'Always Audio Only (MP3)' },
            ].map((opt) => (
              <Pressable
                key={opt.id}
                onPress={() => {
                  setQualityPreference(opt.id as 'ask' | 'hd' | 'sd' | 'audio');
                  setShowQualityModal(false);
                }}
                style={styles.modalOptionRow}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    qualityPreference === opt.id && styles.modalOptionTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
                {qualityPreference === opt.id && <View style={styles.selectedDot} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '75%' }]}>
            <View style={styles.modalTopBar}>
              <Text style={styles.modalHeaderTitle}>Privacy Policy</Text>
              <Pressable onPress={() => setShowPrivacyModal(false)}>
                <X size={20} color="#17152A" />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.policyBody}>
                {`ReelFetch values your privacy. This application operates entirely on your device.\n\n` +
                  `1. No Personal Data Collection: We do not collect, store, or transmit your personal data, credentials, or browsing history.\n\n` +
                  `2. Media Storage: Downloaded videos and audio files are stored in your device's local storage and media library. ReelFetch does not upload your files to any external server.\n\n` +
                  `3. Permissions: Storage and media-library permissions are requested solely to save videos and audio directly to your device gallery.\n\n` +
                  `4. Third-Party Services: Video links are processed directly from authorized public sources. ReelFetch is not affiliated with or endorsed by Instagram.`}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* About ReelFetch Modal */}
      <Modal
        visible={showAboutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { alignItems: 'center', paddingVertical: 28 }]}>
            <LogoEmblem size={64} />
            <Text style={[styles.modalHeaderTitle, { marginTop: 14 }]}>ReelFetch</Text>
            <Text style={styles.aboutSubtitle}>Instagram Reels Saver</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <Text style={styles.aboutDesc}>
              A clean, modern mobile utility designed for fast, high-quality Instagram Reel downloads.
            </Text>
            <Pressable
              onPress={() => setShowAboutModal(false)}
              style={styles.closeAboutBtn}
            >
              <Text style={styles.closeAboutBtnText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#17152A',
    marginBottom: 20,
    letterSpacing: -0.4,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EDEBF8',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemPressed: {
    backgroundColor: '#FAFAFD',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  itemTextCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#17152A',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#68708A',
    marginTop: 2,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F0FF',
    marginLeft: 66,
  },
  versionText: {
    fontSize: 13,
    color: '#969EB5',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 21, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  modalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#17152A',
    marginBottom: 14,
  },
  modalOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F0FF',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#17152A',
    fontWeight: '600',
  },
  modalOptionTextSelected: {
    color: '#7138F5',
    fontWeight: '700',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7138F5',
  },
  policyBody: {
    fontSize: 14,
    lineHeight: 22,
    color: '#68708A',
  },
  aboutSubtitle: {
    fontSize: 14,
    color: '#68708A',
    marginTop: 4,
    fontWeight: '500',
  },
  aboutVersion: {
    fontSize: 13,
    color: '#7138F5',
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 12,
  },
  aboutDesc: {
    fontSize: 14,
    color: '#68708A',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  closeAboutBtn: {
    width: '100%',
    height: 46,
    borderRadius: 12,
    backgroundColor: '#7138F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeAboutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
