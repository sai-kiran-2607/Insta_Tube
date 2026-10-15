import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Clipboard as ClipboardIcon,
  Download,
  Link2,
  Settings,
  X,
} from 'lucide-react-native';
import { LogoEmblem } from '@/components/common/LogoEmblem';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { ErrorCard } from '@/components/common/ErrorCard';
import { PermissionModal } from '@/components/common/PermissionModal';
import { EmptyStateBox } from '@/components/home/EmptyStateBox';
import { HeroIllustration } from '@/components/home/HeroIllustration';
import { MediaPreviewCard } from '@/components/home/MediaPreviewCard';
import { ProcessingCard } from '@/components/home/ProcessingCard';
import { DownloadSuccessCard } from '@/components/home/DownloadSuccessCard';
import { useDownloads } from '@/hooks/useDownloads';
import { useShareIntentHandler } from '@/hooks/useShareIntentHandler';
import { ProviderMediaInfo } from '@/services/providers/BaseProvider';
import { providerRegistry } from '@/services/providers/ProviderRegistry';
import { colors } from '@/theme/colors';
import { DownloadItem } from '@/types/download';
import { parseAndValidateUrl } from '@/utils/urlValidator';

export default function HomeScreen() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedMedia, setResolvedMedia] = useState<ProviderMediaInfo | null>(null);
  const [notice, setNotice] = useState<{
    type: 'error' | 'warning' | 'success';
    title?: string;
    message: string;
  } | null>(null);
  const [downloadSuccessItem, setDownloadSuccessItem] = useState<DownloadItem | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Screen entrance animation (fade-in + slide-up)
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(18));

  // Button scale animations for tactile feedback
  const [pasteScale] = useState(() => new Animated.Value(1));
  const [getVideoScale] = useState(() => new Animated.Value(1));

  const {
    downloads,
    startDownload,
    cancelDownload,
    shareFile,
    exportToGallery,
  } = useDownloads();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleResolveMedia = async (urlToResolve?: string) => {
    Keyboard.dismiss();
    const targetUrl = (urlToResolve || url).trim();

    if (!targetUrl) {
      setNotice({
        type: 'error',
        title: 'Empty Link',
        message: 'Please paste or enter an Instagram Reel link.',
      });
      return;
    }

    const parseResult = parseAndValidateUrl(targetUrl);
    if (!parseResult.isValid) {
      setNotice({
        type: 'error',
        title: 'Invalid Link',
        message: parseResult.errorMessage || 'Please paste a valid Instagram Reel link.',
      });
      return;
    }

    setIsResolving(true);
    setNotice(null);
    setDownloadSuccessItem(null);

    try {
      const mediaInfo = await providerRegistry.resolve(targetUrl);

      if (mediaInfo.canDownloadDirectly && mediaInfo.downloadUrl) {
        setResolvedMedia(mediaInfo);
      } else {
        setResolvedMedia(null);
        setNotice({
          type: 'error',
          title: 'Retrieval Error',
          message:
            mediaInfo.technicalLimitation ||
            'Could not extract a downloadable video stream from this link.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Media resolution failed.';
      setNotice({
        type: 'error',
        title: 'Retrieval Error',
        message: msg,
      });
      setResolvedMedia(null);
    } finally {
      setIsResolving(false);
    }
  };

  // Handle incoming Android ACTION_SEND share intents
  useShareIntentHandler((sharedUrl) => {
    setUrl(sharedUrl);
    setNotice(null);
    setDownloadSuccessItem(null);
    // Automatically trigger resolution when shared via Android intent
    handleResolveMedia(sharedUrl);
  });

  // Track the most recent active download
  const activeDownload = useMemo(
    () => downloads.find((d) => d.status === 'downloading' || d.status === 'pending') || null,
    [downloads]
  );

  const prevActiveRef = useRef<DownloadItem | null>(null);

  // Detect completion or failure transition
  useEffect(() => {
    if (prevActiveRef.current && !activeDownload) {
      const finishedId = prevActiveRef.current.id;
      const latest = downloads.find((d) => d.id === finishedId);
      if (latest && latest.status === 'completed' && latest.fileExistsOnDisk) {
        setDownloadSuccessItem(latest);
        setNotice(null);
        // Auto-export to gallery if permissible
        if (latest.fileUri && !latest.savedToGallery) {
          exportToGallery(latest.fileUri).catch(() => {});
        }
      } else if (latest && latest.status === 'failed') {
        setNotice({
          type: 'error',
          title: 'Download Failed',
          message: latest.errorMessage || 'Download failed due to network error.',
        });
      }
    }
    prevActiveRef.current = activeDownload;
  }, [activeDownload, downloads, exportToGallery]);

  const animatePressIn = (val: Animated.Value) => {
    Animated.spring(val, {
      toValue: 0.95,
      speed: 30,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = (val: Animated.Value) => {
    Animated.spring(val, {
      toValue: 1,
      speed: 25,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePaste = async () => {
    try {
      const hasString = await Clipboard.hasStringAsync();
      if (!hasString) {
        setNotice({
          type: 'warning',
          title: 'Clipboard Empty',
          message: 'Clipboard is empty. Copy an Instagram Reel link first.',
        });
        return;
      }
      const text = await Clipboard.getStringAsync();
      if (text) {
        const cleaned = text.trim();
        setUrl(cleaned);
        setNotice(null);
        setDownloadSuccessItem(null);
      }
    } catch {
      setNotice({
        type: 'error',
        title: 'Clipboard Error',
        message: 'Could not access clipboard.',
      });
    }
  };

  const handleClear = () => {
    setUrl('');
    setNotice(null);
    setResolvedMedia(null);
    setDownloadSuccessItem(null);
  };

  const handleStartDownload = async (qualityId: string) => {
    if (!resolvedMedia || !resolvedMedia.downloadUrl) return;

    setNotice(null);
    setDownloadSuccessItem(null);

    // Find stream url if multiple formats exist
    const selectedFormat = resolvedMedia.qualities?.find((q) => q.id === qualityId);
    const targetDownloadUrl = selectedFormat?.url || resolvedMedia.downloadUrl;
    const isAudioOnly = selectedFormat?.isAudioOnly || qualityId === 'audio';

    // Compute safe, format-specific suggested filename:
    const baseName = (resolvedMedia.title || `media_${resolvedMedia.id}`)
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .substring(0, 40)
      .replace(/\.[^/.]+$/, '');

    const ext = isAudioOnly ? (selectedFormat?.format || 'm4a') : 'mp4';
    const finalFileName = isAudioOnly ? `${baseName}_audio.${ext}` : `${baseName}.${ext}`;
    const displayTitle = isAudioOnly
      ? `${resolvedMedia.title} (Audio)`
      : resolvedMedia.title;

    try {
      await startDownload({
        url: targetDownloadUrl,
        title: displayTitle,
        platform: resolvedMedia.providerId === 'direct' ? 'direct' : resolvedMedia.providerId,
        contentType: isAudioOnly
          ? 'direct_media'
          : resolvedMedia.providerId === 'instagram'
          ? 'instagram_reel'
          : 'direct_media',
        suggestedFileName: finalFileName,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Download initiation failed.';
      setNotice({
        type: 'error',
        title: 'Download Error',
        message: msg,
      });
    }
  };

  const handlePreviewVideo = async () => {
    if (!resolvedMedia?.downloadUrl && !resolvedMedia?.fallbackUrl) return;
    const previewUrl = resolvedMedia.fallbackUrl || resolvedMedia.downloadUrl;
    try {
      await WebBrowser.openBrowserAsync(previewUrl!);
    } catch {
      setNotice({
        type: 'error',
        title: 'Preview Error',
        message: 'Could not open video preview.',
      });
    }
  };

  const handleCopyLink = async () => {
    if (!resolvedMedia) return;
    const linkToCopy = resolvedMedia.fallbackUrl || resolvedMedia.downloadUrl || url;
    await Clipboard.setStringAsync(linkToCopy);
    setNotice({
      type: 'success',
      title: 'Copied',
      message: 'Video link copied to clipboard!',
    });
  };

  const handleShareMedia = async () => {
    if (downloadSuccessItem?.fileUri) {
      await shareFile(downloadSuccessItem.fileUri);
    } else if (resolvedMedia) {
      const shareUrl = resolvedMedia.fallbackUrl || resolvedMedia.downloadUrl || url;
      await Clipboard.setStringAsync(shareUrl);
      setNotice({
        type: 'success',
        title: 'Share Link',
        message: 'Link copied for sharing.',
      });
    }
  };

  return (
    <ScreenContainer>
      <Animated.View
        style={[
          styles.contentWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Top Header matching Reference Screen 2-5 */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <LogoEmblem size={44} />
            <View style={styles.headerTitleCol}>
              <View style={styles.appNameRow}>
                <Text style={styles.appNameDark}>Reel</Text>
                <Text style={styles.appNamePurple}>Fetch</Text>
              </View>
              <Text style={styles.headerSubtitle}>Instagram Reels Saver</Text>
            </View>
          </View>

          {/* Settings Circle Button */}
          <Pressable
            onPress={() => router.push('/(tabs)/settings')}
            style={({ pressed }) => [
              styles.settingsButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityLabel="Open Settings"
          >
            <Settings size={20} color="#68708A" />
          </Pressable>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextCol}>
            <Text style={styles.heroTitle}>
              Download your{' '}
              <Text style={styles.heroTitleHighlight}>Reels</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              {isResolving
                ? 'Fetching video details...'
                : 'Paste an Instagram Reel link to get started.'}
            </Text>
          </View>

          {/* Right Floating Download Illustration */}
          <View style={styles.heroIllustrationCol}>
            <HeroIllustration />
          </View>
        </View>

        {/* Link Input Card */}
        <View style={styles.inputCard}>
          {/* URL Input Box */}
          <View
            style={[
              styles.inputBox,
              notice?.type === 'error' && styles.inputBoxError,
            ]}
          >
            <Link2 size={18} color="#969EB5" style={styles.inputLinkIcon} />
            <TextInput
              value={url}
              onChangeText={(val) => {
                setUrl(val);
                if (notice) setNotice(null);
              }}
              placeholder="Paste Instagram Reel link here"
              placeholderTextColor="#969EB5"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              returnKeyType="go"
              onSubmitEditing={() => handleResolveMedia()}
              style={styles.textInputField}
              editable={!isResolving && !activeDownload}
            />
            {url.length > 0 && !isResolving && !activeDownload && (
              <Pressable
                onPress={handleClear}
                style={styles.clearBtn}
                accessibilityLabel="Clear input"
              >
                <X size={16} color="#969EB5" />
              </Pressable>
            )}
          </View>

          {/* Buttons Row below input */}
          <View style={styles.buttonsRow}>
            {/* Outlined Paste Button */}
            <Animated.View style={{ transform: [{ scale: pasteScale }] }}>
              <Pressable
                onPress={handlePaste}
                onPressIn={() => animatePressIn(pasteScale)}
                onPressOut={() => animatePressOut(pasteScale)}
                disabled={isResolving || !!activeDownload}
                style={[
                  styles.pasteButton,
                  (isResolving || !!activeDownload) && styles.pasteButtonDisabled,
                ]}
                accessibilityLabel="Paste link from clipboard"
              >
                <ClipboardIcon size={16} color={colors.primaryPurple} />
                <Text style={styles.pasteButtonText}>Paste</Text>
              </Pressable>
            </Animated.View>

            {/* Solid Purple Get Video Button */}
            <Animated.View style={[{ flex: 1 }, { transform: [{ scale: getVideoScale }] }]}>
              <Pressable
                onPress={() => handleResolveMedia()}
                onPressIn={() => animatePressIn(getVideoScale)}
                onPressOut={() => animatePressOut(getVideoScale)}
                disabled={isResolving || !!activeDownload || !url.trim()}
                style={[
                  styles.getVideoButton,
                  (!url.trim() || isResolving || !!activeDownload) &&
                    styles.getVideoButtonDisabled,
                ]}
                accessibilityLabel="Get video"
              >
                <LinearGradient
                  colors={
                    !url.trim() || isResolving || !!activeDownload
                      ? ['#E2DCF8', '#D3CCF5']
                      : ['#7138F5', '#4C1DCE']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.getVideoGradient}
                >
                  {isResolving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" style={styles.getIcon} />
                  ) : (
                    <Download size={18} color="#FFFFFF" strokeWidth={2.4} style={styles.getIcon} />
                  )}
                  <Text style={styles.getVideoButtonText}>
                    {isResolving ? 'Fetching...' : 'Get Video'}
                  </Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </View>
        </View>

        {/* Error Screen State (Screen 10) */}
        {notice?.type === 'error' && (
          <ErrorCard
            title={notice.title || 'Invalid Link'}
            message={notice.message}
          />
        )}

        {/* Dynamic Center Area: Screen 3 (Processing) -> Screen 6 (Success) -> Screen 4/5 (Preview) -> Screen 2 (Empty) */}
        {isResolving ? (
          <ProcessingCard />
        ) : downloadSuccessItem ? (
          <DownloadSuccessCard
            isAudio={
              downloadSuccessItem.fileUri?.endsWith('.m4a') ||
              downloadSuccessItem.fileUri?.endsWith('.mp3')
            }
            onViewInGallery={() => {
              if (downloadSuccessItem.fileUri) {
                WebBrowser.openBrowserAsync(downloadSuccessItem.fileUri).catch(() => {});
              }
            }}
            onDownloadAnother={() => {
              setDownloadSuccessItem(null);
              setResolvedMedia(null);
              setUrl('');
              setNotice(null);
            }}
          />
        ) : resolvedMedia ? (
          <MediaPreviewCard
            mediaInfo={resolvedMedia}
            activeDownload={activeDownload}
            onDownload={handleStartDownload}
            onCancelDownload={cancelDownload}
            onPreview={handlePreviewVideo}
            onCopyLink={handleCopyLink}
            onShare={handleShareMedia}
          />
        ) : (
          /* Empty State (Reference Screen 2) */
          <View style={styles.emptyStateContainer}>
            <EmptyStateBox />
            <Text style={styles.emptyStateHeading}>
              Your next download starts here.
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Paste an Instagram Reel link to preview and download.
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Permissions Screen/Modal (Reference Screen 9) */}
      <PermissionModal
        visible={showPermissionModal}
        onAllow={async () => {
          setShowPermissionModal(false);
          try {
            await Linking.openSettings();
          } catch {}
        }}
        onDismiss={() => setShowPermissionModal(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleCol: {
    marginLeft: 12,
  },
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appNameDark: {
    fontSize: 20,
    fontWeight: '800',
    color: '#17152A',
    letterSpacing: -0.4,
  },
  appNamePurple: {
    fontSize: 20,
    fontWeight: '800',
    color: '#7138F5',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#68708A',
    fontWeight: '500',
    marginTop: 2,
  },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FAFAFD',
    borderWidth: 1,
    borderColor: '#EDEBF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#17152A',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  heroTitleHighlight: {
    color: '#7138F5',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#68708A',
    marginTop: 6,
    lineHeight: 20,
    fontWeight: '400',
  },
  heroIllustrationCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EDEBF8',
    padding: 14,
    shadowColor: '#7138F5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBF8',
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  inputBoxError: {
    borderColor: 'rgba(220, 53, 69, 0.4)',
  },
  inputLinkIcon: {
    marginRight: 10,
  },
  textInputField: {
    flex: 1,
    fontSize: 14,
    color: '#17152A',
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pasteButton: {
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#7138F5',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  pasteButtonDisabled: {
    opacity: 0.45,
  },
  pasteButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7138F5',
  },
  getVideoButton: {
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
  },
  getVideoButtonDisabled: {
    opacity: 0.7,
  },
  getVideoGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  getIcon: {
    marginRight: 2,
  },
  getVideoButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
  },
  emptyStateHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#17152A',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#68708A',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.85,
  },
});
