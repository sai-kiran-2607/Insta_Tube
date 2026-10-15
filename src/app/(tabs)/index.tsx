import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import {
  AlertCircle,
  CheckCircle2,
  Clipboard as ClipboardIcon,
  Download,
  Link2,
  Settings,
  X,
} from 'lucide-react-native';
import { LogoEmblem } from '@/components/common/LogoEmblem';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { EmptyStateBox } from '@/components/home/EmptyStateBox';
import { HeroIllustration } from '@/components/home/HeroIllustration';
import { MediaPreviewCard } from '@/components/home/MediaPreviewCard';
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
    message: string;
  } | null>(null);
  const [downloadSuccessItem, setDownloadSuccessItem] = useState<DownloadItem | null>(null);

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
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 320,
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
        message: 'Please paste or enter an Instagram Reel link.',
      });
      return;
    }

    const parseResult = parseAndValidateUrl(targetUrl);
    if (!parseResult.isValid) {
      setNotice({
        type: 'error',
        message: parseResult.errorMessage || 'Invalid URL entered.',
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
          message:
            mediaInfo.technicalLimitation ||
            'Could not extract a downloadable video stream from this link.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Media resolution failed.';
      setNotice({
        type: 'error',
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
        setNotice({
          type: 'success',
          message: 'Video downloaded successfully to your device!',
        });
        // Auto-export to gallery if permissible
        if (latest.fileUri && !latest.savedToGallery) {
          exportToGallery(latest.fileUri).catch(() => {});
        }
      } else if (latest && latest.status === 'failed') {
        setNotice({
          type: 'error',
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
        message: 'Could not access clipboard.',
      });
    }
  };

  const handleClear = () => {
    setUrl('');
    setNotice(null);
    setResolvedMedia(null);
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
      Alert.alert('Preview', 'Could not open video preview.');
    }
  };

  const handleCopyLink = async () => {
    if (!resolvedMedia) return;
    const linkToCopy = resolvedMedia.fallbackUrl || resolvedMedia.downloadUrl || url;
    await Clipboard.setStringAsync(linkToCopy);
    setNotice({
      type: 'success',
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
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <LogoEmblem size={44} />
            <View style={styles.headerTitleCol}>
              <View style={styles.appNameRow}>
                <Text style={styles.appNameDark}>Reel</Text>
                <Text style={styles.appNamePurple}>Fetch</Text>
              </View>
              <Text style={styles.headerSubtitle}>Save videos you love</Text>
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
            <Settings size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextCol}>
            <Text style={styles.heroTitle}>
              Download your{' '}
              <Text style={styles.heroTitleHighlight}>video</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Paste an Instagram Reel link to get started.
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
            <Link2 size={18} color="#94A3B8" style={styles.inputLinkIcon} />
            <TextInput
              value={url}
              onChangeText={(val) => {
                setUrl(val);
                if (notice) setNotice(null);
              }}
              placeholder="Paste Instagram Reel link here"
              placeholderTextColor="#94A3B8"
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
                <X size={16} color="#94A3B8" />
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
                style={styles.pasteButton}
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
                {isResolving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" style={styles.getIcon} />
                ) : (
                  <Download size={18} color="#FFFFFF" strokeWidth={2.4} style={styles.getIcon} />
                )}
                <Text style={styles.getVideoButtonText}>
                  {isResolving ? 'Resolving...' : 'Get Video'}
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>

        {/* Inline Notice Banner (Errors, Warnings, Success) */}
        {notice && (
          <View
            style={[
              styles.noticeBanner,
              notice.type === 'error'
                ? styles.noticeError
                : notice.type === 'success'
                ? styles.noticeSuccess
                : styles.noticeWarning,
            ]}
          >
            {notice.type === 'error' ? (
              <AlertCircle size={16} color={colors.error} />
            ) : notice.type === 'success' ? (
              <CheckCircle2 size={16} color={colors.success} />
            ) : (
              <AlertCircle size={16} color={colors.warning} />
            )}
            <Text
              style={[
                styles.noticeText,
                notice.type === 'error'
                  ? styles.noticeTextError
                  : notice.type === 'success'
                  ? styles.noticeTextSuccess
                  : styles.noticeTextWarning,
              ]}
            >
              {notice.message}
            </Text>
          </View>
        )}

        {/* Dynamic Center Section: Empty State or Media Preview Card */}
        {resolvedMedia ? (
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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
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
    color: '#111827',
    letterSpacing: -0.3,
  },
  appNamePurple: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryPurple,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F5F9',
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
    color: '#111827',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  heroTitleHighlight: {
    color: colors.primaryPurple,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  heroIllustrationCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 25,
    height: 48,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  inputBoxError: {
    borderColor: colors.error,
  },
  inputLinkIcon: {
    marginRight: 10,
  },
  textInputField: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
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
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#C084FC',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  pasteButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryPurple,
  },
  getVideoButton: {
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primaryPurple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryPurple,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  getVideoButtonDisabled: {
    opacity: 0.5,
  },
  getIcon: {
    marginRight: 8,
  },
  getVideoButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  noticeError: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  noticeSuccess: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  noticeWarning: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  noticeTextError: {
    color: colors.error,
  },
  noticeTextSuccess: {
    color: colors.success,
  },
  noticeTextWarning: {
    color: colors.warning,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
  },
  emptyStateHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 6,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
});
