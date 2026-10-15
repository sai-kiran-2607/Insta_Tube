import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import {
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Eye,
  FileText,
  Info,
  Music,
  Play,
  Share2,
  Video,
  XCircle,
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
        return 'Download Video (HD)';
      case 'sd':
        return 'Download Video (SD)';
      case 'audio':
        return 'Download Audio Only';
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

          {/* Bottom-Right Duration Badge */}
          <View style={styles.durationBadge}>
            <Text style={styles.durationBadgeText}>
              {mediaInfo.durationFormatted || '0:28'}
            </Text>
          </View>
        </View>

        {/* Media Title & Meta Details */}
        <View style={styles.detailsCol}>
          <Text style={styles.mediaTitle} numberOfLines={2}>
            {mediaInfo.title || 'Instagram Video'}
          </Text>

          {/* Author / Platform Row */}
          <View style={styles.authorRow}>
            {mediaInfo.providerId === 'instagram' ? (
              <View style={styles.instagramBadge}>
                <InstagramIcon size={14} color="#E1306C" />
              </View>
            ) : null}
            <Text style={styles.authorText} numberOfLines={1}>
              {mediaInfo.author || '@instagram'}
            </Text>
          </View>

          {/* Meta Info: Duration, Size, Quality */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={12} color={colors.textSecondary} />
              <Text style={styles.metaText}>
                {mediaInfo.durationFormatted || '0:28'}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <FileText size={12} color={colors.textSecondary} />
              <Text style={styles.metaText}>
                {mediaInfo.fileSizeFormatted || '12.4 MB'}
              </Text>
            </View>

            <View style={styles.hdBadge}>
              <Text style={styles.hdBadgeText}>
                {mediaInfo.qualityBadge || 'HD'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quality Selection Header */}
      <View style={styles.qualityHeaderRow}>
        <Text style={styles.qualitySectionTitle}>Choose Quality</Text>
        <View style={styles.availableFormatsRow}>
          <Text style={styles.availableFormatsText}>Available formats</Text>
          <Info size={13} color={colors.textSecondary} style={styles.infoIcon} />
        </View>
      </View>

      {/* 3 Quality Cards Row */}
      <View style={styles.qualityCardsRow}>
        {/* HD Quality Card */}
        <Pressable
          onPress={() => setSelectedQuality('hd')}
          style={[
            styles.qualityCard,
            selectedQuality === 'hd' && styles.qualityCardSelected,
          ]}
          accessibilityLabel="Select HD Quality 1080p"
        >
          <View style={styles.qualityIconContainer}>
            <Video
              size={18}
              color={selectedQuality === 'hd' ? colors.primaryPurple : colors.textSecondary}
            />
          </View>
          <View style={styles.qualityCardTextCol}>
            <Text
              style={[
                styles.qualityCardLabel,
                selectedQuality === 'hd' && styles.qualityCardLabelSelected,
              ]}
              numberOfLines={1}
            >
              HD Quality
            </Text>
            <Text style={styles.qualityCardSublabel} numberOfLines={1}>
              1080p (MP4)
            </Text>
          </View>
          {selectedQuality === 'hd' ? (
            <CheckCircle2
              size={16}
              color={colors.primaryPurple}
              fill={colors.surfaceLightPurple}
              style={styles.radioIcon}
            />
          ) : (
            <View style={styles.radioHollow} />
          )}
        </Pressable>

        {/* SD Quality Card */}
        <Pressable
          onPress={() => setSelectedQuality('sd')}
          style={[
            styles.qualityCard,
            selectedQuality === 'sd' && styles.qualityCardSelected,
          ]}
          accessibilityLabel="Select SD Quality 720p"
        >
          <View style={styles.qualityIconContainer}>
            <Video
              size={18}
              color={selectedQuality === 'sd' ? colors.primaryPurple : colors.textSecondary}
            />
          </View>
          <View style={styles.qualityCardTextCol}>
            <Text
              style={[
                styles.qualityCardLabel,
                selectedQuality === 'sd' && styles.qualityCardLabelSelected,
              ]}
              numberOfLines={1}
            >
              SD Quality
            </Text>
            <Text style={styles.qualityCardSublabel} numberOfLines={1}>
              720p (MP4)
            </Text>
          </View>
          {selectedQuality === 'sd' ? (
            <CheckCircle2
              size={16}
              color={colors.primaryPurple}
              fill={colors.surfaceLightPurple}
              style={styles.radioIcon}
            />
          ) : (
            <View style={styles.radioHollow} />
          )}
        </Pressable>

        {/* Audio Only Card */}
        <Pressable
          onPress={() => setSelectedQuality('audio')}
          style={[
            styles.qualityCard,
            selectedQuality === 'audio' && styles.qualityCardSelected,
          ]}
          accessibilityLabel="Select Audio Only"
        >
          <View style={styles.qualityIconContainer}>
            <Music
              size={18}
              color={selectedQuality === 'audio' ? colors.primaryPurple : colors.textSecondary}
            />
          </View>
          <View style={styles.qualityCardTextCol}>
            <Text
              style={[
                styles.qualityCardLabel,
                selectedQuality === 'audio' && styles.qualityCardLabelSelected,
              ]}
              numberOfLines={1}
            >
              Audio Only
            </Text>
            <Text style={styles.qualityCardSublabel} numberOfLines={1}>
              M4A Audio
            </Text>
          </View>
          {selectedQuality === 'audio' ? (
            <CheckCircle2
              size={16}
              color={colors.primaryPurple}
              fill={colors.surfaceLightPurple}
              style={styles.radioIcon}
            />
          ) : (
            <View style={styles.radioHollow} />
          )}
        </Pressable>
      </View>

      {/* Live Download Progress Section (When actively downloading) */}
      {isDownloading && activeDownload && (
        <View style={styles.downloadProgressContainer}>
          <View style={styles.progressHeaderRow}>
            <Text style={styles.progressLabel}>DOWNLOADING</Text>
            <Pressable
              onPress={() => onCancelDownload(activeDownload.id)}
              style={styles.cancelButton}
              accessibilityLabel="Cancel download"
            >
              <XCircle size={15} color={colors.error} />
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>

          {/* Progress Bar Track */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(100, Math.max(0, progressPercent))}%` },
              ]}
            />
          </View>

          {/* Progress Percent & File Size */}
          <View style={styles.progressMetaRow}>
            <Text style={styles.progressPercentText}>{progressPercent}%</Text>
            <Text style={styles.progressBytesText}>
              {activeDownload.fileSizeFormatted || 'Streaming data...'}
            </Text>
          </View>
        </View>
      )}

      {/* Primary Download Button */}
      <Pressable
        onPress={() => onDownload(selectedQuality)}
        disabled={isDownloading}
        style={({ pressed }) => [
          styles.primaryDownloadButton,
          isDownloading && styles.primaryDownloadButtonDisabled,
          pressed && !isDownloading && styles.buttonPressed,
        ]}
        accessibilityLabel={getQualityButtonLabel()}
      >
        {isDownloading ? (
          <ActivityIndicator size="small" color="#FFFFFF" style={styles.buttonIcon} />
        ) : (
          <Download size={18} color="#FFFFFF" strokeWidth={2.4} style={styles.buttonIcon} />
        )}
        <Text style={styles.primaryDownloadText}>
          {isDownloading ? 'Downloading...' : getQualityButtonLabel()}
        </Text>
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
          <Eye size={15} color={colors.primaryPurple} />
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
          <Copy size={14} color={colors.primaryPurple} />
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
          <Share2 size={14} color={colors.primaryPurple} />
          <Text style={styles.secondaryActionText}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  thumbnailWrapper: {
    width: 82,
    height: 82,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E8FF',
  },
  playOverlay: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    marginLeft: 2,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  durationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  detailsCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 4,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  instagramBadge: {
    marginRight: 4,
  },
  authorText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  hdBadge: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  hdBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  qualityHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  qualitySectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  availableFormatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableFormatsText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoIcon: {
    marginLeft: 4,
  },
  qualityCardsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  qualityCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 12,
    padding: 10,
    position: 'relative',
    minHeight: 74,
    justifyContent: 'space-between',
  },
  qualityCardSelected: {
    backgroundColor: colors.surfaceLightPurple,
    borderColor: colors.primaryPurple,
    borderWidth: 1.5,
  },
  qualityIconContainer: {
    marginBottom: 6,
  },
  qualityCardTextCol: {
    width: '100%',
  },
  qualityCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  qualityCardLabelSelected: {
    color: colors.primaryPurple,
  },
  qualityCardSublabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  radioIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  radioHollow: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  downloadProgressContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 12,
    marginBottom: 14,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryPurple,
    letterSpacing: 0.5,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primaryPurple,
    borderRadius: 3,
  },
  progressMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryPurple,
  },
  progressBytesText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  primaryDownloadButton: {
    backgroundColor: colors.primaryPurple,
    borderRadius: 16,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.primaryPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryDownloadButtonDisabled: {
    opacity: 0.65,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryDownloadText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryActionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryPurple,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.85,
  },
});
