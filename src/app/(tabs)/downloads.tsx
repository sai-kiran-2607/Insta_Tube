import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import {
  FolderDown,
  HardDrive,
  MoreHorizontal,
  Music,
  Play,
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
    shareFile,
    exportToGallery,
  } = useDownloads();

  const [selectedItem, setSelectedItem] = useState<DownloadItem | null>(null);

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
      item.fileUri.toLowerCase().endsWith('.m4a') ||
      item.fileUri.toLowerCase().endsWith('.mp3');
    await shareFile(item.fileUri, isAudio ? 'audio/mp4' : 'video/mp4');
  };

  const handleSaveToGallery = async (item: DownloadItem) => {
    if (!item.fileUri) return;
    const isAudio =
      item.fileUri.toLowerCase().endsWith('.m4a') ||
      item.fileUri.toLowerCase().endsWith('.mp3');
    const res = await exportToGallery(item.fileUri);
    if (res.success) {
      Alert.alert(
        'Saved to Device',
        isAudio
          ? 'Audio is now saved to your device media library!'
          : 'Video is now in your device photo gallery!'
      );
    } else {
      Alert.alert('Save to Device', res.error || 'Failed to save to device library.');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Download', 'Are you sure you want to delete this downloaded file?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteDownload(id, true);
          setSelectedItem(null);
        },
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
      item.title?.toLowerCase().includes('(audio)');

    const qualityLabel = isAudio ? 'Audio' : 'HD';

    return (
      <Pressable
        onPress={() => isCompleted && handleOpenMedia(item)}
        style={({ pressed }) => [
          styles.downloadCard,
          pressed && styles.cardPressed,
        ]}
        accessibilityLabel={`Download ${item.title}`}
      >
        {/* Left Thumbnail or Icon */}
        <View style={styles.thumbnailBox}>
          {item.thumbnailUrl ? (
            <Image
              source={{ uri: item.thumbnailUrl }}
              style={styles.thumbnailImage}
              contentFit="cover"
            />
          ) : isAudio ? (
            <View style={styles.iconFallback}>
              <Music size={22} color="#7138F5" />
            </View>
          ) : (
            <View style={styles.iconFallback}>
              <Video size={22} color="#7138F5" />
            </View>
          )}

          {isCompleted && (
            <View style={styles.playIconOverlay}>
              <Play size={12} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 1 }} />
            </View>
          )}
        </View>

        {/* Middle Details */}
        <View style={styles.itemInfoCol}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title || 'Instagram Reel'}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>00:28</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>
              {item.fileSizeFormatted || (isAudio ? '1.2 MB' : '5.4 MB')}
            </Text>
            <Text style={styles.metaDot}>•</Text>
            <View style={styles.qualityPill}>
              <Text style={styles.qualityPillText}>{qualityLabel}</Text>
            </View>

            {isDownloading && (
              <Text style={styles.downloadingPercent}>
                {Math.round((item.progress || 0) * 100)}%
              </Text>
            )}

            {isFailed && <Text style={styles.failedBadge}>Failed</Text>}
          </View>
        </View>

        {/* Right 3-Dots Action Button */}
        <Pressable
          onPress={() => setSelectedItem(item)}
          style={({ pressed }) => [
            styles.dotsBtn,
            pressed && styles.dotsBtnPressed,
          ]}
          accessibilityLabel="Open item options"
        >
          <MoreHorizontal size={20} color="#68708A" />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Top Header matching Reference Screen 7 */}
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>My Downloads</Text>

          {downloads.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{downloads.length}</Text>
            </View>
          )}
        </View>

        {/* Downloads List or Empty State */}
        {downloads.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <FolderDown size={34} color="#7138F5" />
            </View>
            <Text style={styles.emptyTitle}>No downloads yet</Text>
            <Text style={styles.emptySubtitle}>
              Downloaded Instagram Reels will be saved here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={downloads}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Item Action Sheet Modal */}
        {selectedItem && (
          <Modal
            transparent
            animationType="fade"
            visible={!!selectedItem}
            onRequestClose={() => setSelectedItem(null)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setSelectedItem(null)}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {selectedItem.title || 'Media File'}
                </Text>

                {/* Actions */}
                <Pressable
                  onPress={() => {
                    handleOpenMedia(selectedItem);
                    setSelectedItem(null);
                  }}
                  style={styles.modalActionRow}
                >
                  <Play size={18} color="#7138F5" />
                  <Text style={styles.modalActionText}>Play File</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    handleShare(selectedItem);
                    setSelectedItem(null);
                  }}
                  style={styles.modalActionRow}
                >
                  <Share2 size={18} color="#7138F5" />
                  <Text style={styles.modalActionText}>Share File</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    handleSaveToGallery(selectedItem);
                    setSelectedItem(null);
                  }}
                  style={styles.modalActionRow}
                >
                  <HardDrive size={18} color="#7138F5" />
                  <Text style={styles.modalActionText}>Save to Media Library</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleDelete(selectedItem.id)}
                  style={[styles.modalActionRow, styles.deleteActionRow]}
                >
                  <Trash2 size={18} color={colors.error} />
                  <Text style={[styles.modalActionText, styles.deleteActionText]}>
                    Delete Download
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Modal>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#17152A',
    letterSpacing: -0.4,
  },
  countBadge: {
    backgroundColor: '#F5F0FF',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7138F5',
  },
  listContent: {
    paddingBottom: 24,
    gap: 12,
  },
  downloadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EDEBF8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: '#FAFAFD',
  },
  thumbnailBox: {
    width: 52,
    height: 52,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F5F0FF',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  iconFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfoCol: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#17152A',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#68708A',
    fontWeight: '500',
  },
  metaDot: {
    fontSize: 10,
    color: '#969EB5',
  },
  qualityPill: {
    backgroundColor: '#F5F0FF',
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  qualityPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7138F5',
  },
  downloadingPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7138F5',
    marginLeft: 4,
  },
  failedBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.error,
    marginLeft: 4,
  },
  dotsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsBtnPressed: {
    backgroundColor: '#F5F0FF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#17152A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#68708A',
    textAlign: 'center',
    maxWidth: 260,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 21, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D9D5EE',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#17152A',
    marginBottom: 16,
  },
  modalActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F0FF',
  },
  modalActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#17152A',
  },
  deleteActionRow: {
    borderBottomWidth: 0,
  },
  deleteActionText: {
    color: colors.error,
  },
});
