import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Clock,
  Copy,
  Download,
  Eye,
  HardDrive,
  Music,
  Play,
  Share2,
  Video,
  X,
} from 'lucide-react-native';
import { InstagramIcon } from '@/components/common/BrandIcons';
import { colors } from '@/theme/colors';
import { ProviderMediaInfo } from '@/services/providers/BaseProvider';
import { DownloadItem } from '@/types/download';

interface MediaPreviewCardProps {
  mediaInfo: ProviderMediaInfo;
  activeDownload: DownloadItem | null;
  onDownload: (qualityId: string) => void;
  onCancelDownload: (id: string) => void;
  onPreview: () => void;
  onCopyLink: () => void;
  onShare: () => void;
}

export const MediaPreviewCard: React.FC<MediaPreviewCardProps> = ({
  mediaInfo,
  activeDownload,
  onDownload,
  onCancelDownload,
  onPreview,
  onCopyLink,
  onShare,
}) => {
  const [selectedQuality, setSelectedQuality] = useState<'hd' | 'sd' | 'audio'>('hd');

  const isDownloading = !!activeDownload;
  const progressPercent = activeDownload?.progress
    ? Math.round(activeDownload.progress * 100)
    : 0;

  const getQualityButtonLabel = () => {
    switch (selectedQuality) {
      case 'hd':
        return 'Download Now (HD)';
      case 'sd':
        return 'Download Now (SD)';
      case 'audio':
        return 'Download Now (Audio)';
      default:
        return 'Download Now';
    }
  };

  return (
    <View style={styles.card}>
      {/* Top Media Info Row */}
      <View style={styles.topRow}>
        {/* Video Thumbnail with Play Overlay & Duration */}
        <View style={styles.thumbnailWrapper}>
          {mediaInfo.thumbnailUrl ? (
            <Image
              source={{ uri: mediaInfo.thumbnailUrl }}
              style={styles.thumbnail}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.thumbnailFallback}>
              <Video size={28} color={colors.primaryPurple} />
            </View>
          )}

          {/* Center Play Button Overlay */}
          <View style={styles.playOverlay}>
            <Play size={16} color="#FFFFFF" fill="#FFFFFF" style={styles.playIcon} />
          </View>
        </View>

        {/* Media Title & Meta Details */}
        <View style={styles.detailsCol}>
          <Text style={styles.mediaTitle} numberOfLines={2}>
            {mediaInfo.title || 'Instagram Reel'}
          </Text>

          {/* Author / Platform Row */}
          <View style={styles.authorRow}>
            {mediaInfo.providerId === 'instagram' ? (
              <View style={styles.instagramBadge}>
                <InstagramIcon size={13} color="#F044C8" />
              </View>
            ) : null}
            <Text style={styles.authorText} numberOfLines={1}>
              {mediaInfo.author || '@instagram'}
            </Text>
          </View>

          {/* Meta Info: Duration & Size */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={12} color="#68708A" />
              <Text style={styles.metaText}>
                {mediaInfo.durationFormatted || '00:28'}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <HardDrive size={12} color="#68708A" />
              <Text style={styles.metaText}>
                {mediaInfo.fileSizeFormatted || '5.4 MB'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Screen 5: Dedicated Download Progress Mode */}
      {isDownloading && activeDownload ? (
        <View style={styles.downloadProgressSection}>
          <View style={styles.progressHeaderRow}>
            <Text style={styles.downloadingTitle}>Downloading...</Text>
            <Text style={styles.progressPercentText}>{progressPercent}%</Text>
          </View>

          <Text style={styles.progressBytesText}>
            {activeDownload.fileSizeFormatted || 'Streaming data...'}
          </Text>

          {/* Smooth Progress Bar */}
          <View style={styles.progressBarTrack}>
            <LinearGradient
              colors={['#7138F5', '#F044C8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressBarFill,
                { width: `${Math.min(100, Math.max(4, progressPercent))}%` },
              ]}
            />
          </View>

          {/* Speed & Estimated Time */}
          <View style={styles.speedTimeRow}>
            <Text style={styles.speedText}>1.2 MB/s</Text>
            <Text style={styles.timeText}>
              {progressPercent >= 90 ? 'Finishing up...' : 'Saving to storage'}
            </Text>
          </View>

          {/* Cancel Download Button matching Reference Screen 5 */}
          <Pressable
            onPress={() => onCancelDownload(activeDownload.id)}
            style={({ pressed }) => [
              styles.cancelDownloadBtn,
              pressed && styles.buttonPressed,
            ]}
            accessibilityLabel="Cancel Download"
          >
            <X size={16} color={colors.error} strokeWidth={2.4} />
            <Text style={styles.cancelDownloadText}>Cancel Download</Text>
          </Pressable>
        </View>
      ) : (
        /* Screen 4: Choose Quality & Actions Mode */
        <View style={styles.optionsSection}>
          <Text style={styles.qualitySectionTitle}>Choose Quality</Text>

          {/* Quality Cards Stack */}
          <View style={styles.qualityStack}>
            {/* HD Quality Card */}
            <Pressable
              onPress={() => setSelectedQuality('hd')}
              style={[
                styles.qualityCard,
                selectedQuality === 'hd' && styles.qualityCardSelected,
              ]}
              accessibilityLabel="Select HD Quality 1080p MP4"
            >
              <View
                style={[
                  styles.qualityIconContainer,
                  selectedQuality === 'hd' && styles.qualityIconContainerSelected,
                ]}
              >
                <Video
                  size={18}
                  color={selectedQuality === 'hd' ? '#7138F5' : '#68708A'}
                />
              </View>
              <View style={styles.qualityCardTextCol}>
                <Text
                  style={[
                    styles.qualityCardLabel,
                    selectedQuality === 'hd' && styles.qualityCardLabelSelected,
                  ]}
                >
                  HD Quality
                </Text>
                <Text style={styles.qualityCardSublabel}>1080p • MP4</Text>
              </View>
              <View style={styles.bestBadge}>
                <Text style={styles.bestBadgeText}>Best</Text>
              </View>
            </Pressable>

            {/* SD Quality Card */}
            <Pressable
              onPress={() => setSelectedQuality('sd')}
              style={[
                styles.qualityCard,
                selectedQuality === 'sd' && styles.qualityCardSelected,
              ]}
              accessibilityLabel="Select SD Quality 720p MP4"
            >
              <View
                style={[
                  styles.qualityIconContainer,
                  selectedQuality === 'sd' && styles.qualityIconContainerSelected,
                ]}
              >
                <Video
                  size={18}
                  color={selectedQuality === 'sd' ? '#7138F5' : '#68708A'}
                />
              </View>
              <View style={styles.qualityCardTextCol}>
                <Text
                  style={[
                    styles.qualityCardLabel,
                    selectedQuality === 'sd' && styles.qualityCardLabelSelected,
                  ]}
                >
                  SD Quality
                </Text>
                <Text style={styles.qualityCardSublabel}>720p • MP4</Text>
              </View>
            </Pressable>

            {/* Audio Only Card */}
            <Pressable
              onPress={() => setSelectedQuality('audio')}
              style={[
                styles.qualityCard,
                selectedQuality === 'audio' && styles.qualityCardSelected,
              ]}
              accessibilityLabel="Select Audio Only MP3"
            >
              <View
                style={[
                  styles.qualityIconContainer,
                  selectedQuality === 'audio' && styles.qualityIconContainerSelected,
                ]}
              >
                <Music
                  size={18}
                  color={selectedQuality === 'audio' ? '#7138F5' : '#68708A'}
                />
              </View>
              <View style={styles.qualityCardTextCol}>
                <Text
                  style={[
                    styles.qualityCardLabel,
                    selectedQuality === 'audio' && styles.qualityCardLabelSelected,
                  ]}
                >
                  Audio Only
                </Text>
                <Text style={styles.qualityCardSublabel}>MP3</Text>
              </View>
            </Pressable>
          </View>

          {/* Primary Download Button */}
          <Pressable
            onPress={() => onDownload(selectedQuality)}
            style={({ pressed }) => [
              styles.primaryDownloadButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityLabel={getQualityButtonLabel()}
          >
            <LinearGradient
              colors={['#7138F5', '#4C1DCE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryDownloadGradient}
            >
              <Download size={18} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.primaryDownloadText}>{getQualityButtonLabel()}</Text>
            </LinearGradient>
          </Pressable>

          {/* Secondary Actions Row: Preview, Copy Link, Share */}
          <View style={styles.secondaryActionsRow}>
            <Pressable
              onPress={onPreview}
              style={({ pressed }) => [
                styles.secondaryActionBtn,
                pressed && styles.buttonPressed,
              ]}
              accessibilityLabel="Preview video"
            >
              <Eye size={15} color="#7138F5" />
              <Text style={styles.secondaryActionText}>Preview</Text>
            </Pressable>

            <Pressable
              onPress={onCopyLink}
              style={({ pressed }) => [
                styles.secondaryActionBtn,
                pressed && styles.buttonPressed,
              ]}
              accessibilityLabel="Copy video link"
            >
              <Copy size={14} color="#7138F5" />
              <Text style={styles.secondaryActionText}>Copy Link</Text>
            </Pressable>

            <Pressable
              onPress={onShare}
              style={({ pressed }) => [
                styles.secondaryActionBtn,
                pressed && styles.buttonPressed,
              ]}
              accessibilityLabel="Share media"
            >
              <Share2 size={14} color="#7138F5" />
              <Text style={styles.secondaryActionText}>Share</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EDEBF8',
    padding: 16,
    shadowColor: '#7138F5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginTop: 16,
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  thumbnailWrapper: {
    width: 76,
    height: 76,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F2FD',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F0FF',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  playIcon: {
    marginLeft: 2,
  },
  detailsCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  mediaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#17152A',
    lineHeight: 20,
    marginBottom: 4,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  instagramBadge: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: '#FDF2FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#68708A',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#68708A',
    fontWeight: '500',
  },
  optionsSection: {
    marginTop: 4,
  },
  qualitySectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#17152A',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  qualityStack: {
    gap: 10,
    marginBottom: 16,
  },
  qualityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#EDEBF8',
    backgroundColor: '#FFFFFF',
  },
  qualityCardSelected: {
    borderColor: '#7138F5',
    backgroundColor: '#FBF9FF',
  },
  qualityIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F5F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  qualityIconContainerSelected: {
    backgroundColor: '#F0EAFE',
  },
  qualityCardTextCol: {
    flex: 1,
  },
  qualityCardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#17152A',
    marginBottom: 2,
  },
  qualityCardLabelSelected: {
    color: '#7138F5',
  },
  qualityCardSublabel: {
    fontSize: 12,
    color: '#68708A',
    fontWeight: '500',
  },
  bestBadge: {
    backgroundColor: '#7138F5',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  bestBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  primaryDownloadButton: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  primaryDownloadGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryDownloadText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  secondaryActionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F5F0FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7138F5',
  },
  downloadProgressSection: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  downloadingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#17152A',
  },
  progressPercentText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#7138F5',
  },
  progressBytesText: {
    fontSize: 13,
    color: '#68708A',
    marginBottom: 12,
    fontWeight: '500',
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F0EAFE',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  speedTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  speedText: {
    fontSize: 12,
    color: '#68708A',
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
    color: '#68708A',
    fontWeight: '500',
  },
  cancelDownloadBtn: {
    width: '100%',
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(220, 53, 69, 0.3)',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  cancelDownloadText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
