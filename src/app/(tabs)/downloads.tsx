import React from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {
  FolderDown,
  HardDrive,
  Music,
  Play,
  RotateCcw,
  Share2,
  Trash2,
  Video,
} from 'lucide-react-native';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { useDownloads } from '@/hooks/useDownloads';
import { colors } from '@/theme/colors';
import { DownloadItem } from '@/types/download';

export default function DownloadsScreen() {
  const {
    downloads,
    deleteDownload,
    clearAll,
    shareFile,
    exportToGallery,
    retryDownload,
  } = useDownloads();

  const handleOpenMedia = async (item: DownloadItem) => {
    if (!item.fileUri) return;
    try {
      await WebBrowser.openBrowserAsync(item.fileUri);
    } catch {
      Alert.alert('Open Media', 'Could not open media file.');
    }
  };

  const handleShare = async (item: DownloadItem) => {
    if (!item.fileUri) return;
    const isAudio =
      item.fileUri?.toLowerCase().endsWith('.m4a') ||
      item.fileUri?.toLowerCase().endsWith('.mp3');
    await shareFile(item.fileUri, isAudio ? 'audio/mp4' : 'video/mp4');
  };

  const handleSaveToGallery = async (item: DownloadItem) => {
    if (!item.fileUri) return;
    const isAudio =
      item.fileUri?.toLowerCase().endsWith('.m4a') ||
      item.fileUri?.toLowerCase().endsWith('.mp3');
    const res = await exportToGallery(item.fileUri);
    if (res.success) {
      Alert.alert(
        'Saved to Device',
        isAudio
          ? 'Audio is now saved to your device media library!'
          : 'Video is now in your device photo gallery!'
      );
    } else {
      Alert.alert('Save to Device', res.error || 'Failed to save to media library.');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Download', 'Are you sure you want to delete this downloaded video?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteDownload(id, true),
      },
    ]);
  };

  const handleClearAll = () => {
    if (downloads.length === 0) return;
    Alert.alert('Clear All Downloads', 'Delete all downloaded files from storage?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: () => clearAll(),
      },
    ]);
  };

  const renderItem = ({ item }: { item: DownloadItem }) => {
    const isCompleted = item.status === 'completed' && item.fileExistsOnDisk;
    const isDownloading = item.status === 'downloading' || item.status === 'pending';
    const isFailed = item.status === 'failed';
    const isAudio =
      item.fileUri?.toLowerCase().endsWith('.m4a') ||
      item.fileUri?.toLowerCase().endsWith('.mp3') ||
      item.fileUri?.toLowerCase().endsWith('.aac') ||
      item.fileUri?.toLowerCase().endsWith('.wav') ||
      item.title?.toLowerCase().includes('(audio)');

    return (
      <View style={styles.downloadCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.iconBox}>
            {isAudio ? (
              <Music size={20} color={colors.primaryPurple} />
            ) : (
              <Video size={20} color={colors.primaryPurple} />
            )}
          </View>
          <View style={styles.cardInfoCol}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title || (item.fileUri ? item.fileUri.split('/').pop() : 'Media')}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.cardMetaText}>
                {item.fileSizeFormatted || (isAudio ? 'Audio file' : 'Video file')}
              </Text>
              <Text style={styles.metaDot}>•</Text>
              <Text
                style={[
                  styles.statusBadge,
                  isCompleted
                    ? styles.statusSuccess
                    : isDownloading
                    ? styles.statusActive
                    : styles.statusError,
                ]}
              >
                {isCompleted
                  ? 'Completed'
                  : isDownloading
                  ? `${Math.round((item.progress || 0) * 100)}%`
                  : 'Failed'}
              </Text>
            </View>
          </View>
        </View>

        {/* Card Action Buttons */}
        <View style={styles.cardActionsRow}>
          {isCompleted && item.fileUri && (
            <>
              <Pressable
                onPress={() => handleOpenMedia(item)}
                style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
                accessibilityLabel={isAudio ? 'Play audio' : 'Play video'}
              >
                <Play size={14} color={colors.primaryPurple} />
                <Text style={styles.actionBtnText}>{isAudio ? 'Play Audio' : 'Play'}</Text>
              </Pressable>

              <Pressable
                onPress={() => handleShare(item)}
                style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
                accessibilityLabel={isAudio ? 'Share audio' : 'Share video'}
              >
                <Share2 size={14} color={colors.primaryPurple} />
                <Text style={styles.actionBtnText}>Share</Text>
              </Pressable>

              <Pressable
                onPress={() => handleSaveToGallery(item)}
                style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
                accessibilityLabel={isAudio ? 'Save audio to device' : 'Save to Gallery'}
              >
                <HardDrive size={14} color={colors.primaryPurple} />
                <Text style={styles.actionBtnText}>{isAudio ? 'Library' : 'Gallery'}</Text>
              </Pressable>
            </>
          )}

          {isFailed && (
            <Pressable
              onPress={() => retryDownload(item.id)}
              style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
              accessibilityLabel="Retry download"
            >
              <RotateCcw size={14} color={colors.primaryPurple} />
              <Text style={styles.actionBtnText}>Retry</Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => handleDelete(item.id)}
            style={({ pressed }) => [
              styles.actionBtn,
              styles.deleteBtn,
              pressed && styles.pressed,
            ]}
            accessibilityLabel="Delete video"
          >
            <Trash2 size={14} color={colors.error} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenTitle}>Downloads</Text>
            <Text style={styles.screenSubtitle}>
              {downloads.length} {downloads.length === 1 ? 'file' : 'files'} saved on device
            </Text>
          </View>

          {downloads.length > 0 && (
            <Pressable
              onPress={handleClearAll}
              style={({ pressed }) => [styles.clearAllBtn, pressed && styles.pressed]}
              accessibilityLabel="Clear all downloads"
            >
              <Text style={styles.clearAllText}>Clear All</Text>
            </Pressable>
          )}
        </View>

        {/* Downloads List or Empty State */}
        {downloads.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <FolderDown size={32} color={colors.primaryPurple} />
            </View>
            <Text style={styles.emptyTitle}>No downloads yet</Text>
            <Text style={styles.emptySubtitle}>
              Downloaded Instagram Reels and videos will be saved here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={downloads}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  clearAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
  },
  listContent: {
    paddingBottom: 24,
  },
  downloadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfoCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  metaDot: {
    marginHorizontal: 6,
    color: colors.textSecondary,
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusSuccess: {
    color: colors.success,
  },
  statusActive: {
    color: colors.primaryPurple,
  },
  statusError: {
    color: colors.error,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: '#FFFFFF',
    gap: 4,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryPurple,
  },
  deleteBtn: {
    marginLeft: 'auto',
    borderColor: '#FEE2E2',
    backgroundColor: '#FFF5F5',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
