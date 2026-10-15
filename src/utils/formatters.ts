import { ContentType, SupportedPlatform } from '@/types/link';

export function getPlatformDisplayName(platform: SupportedPlatform): string {
  switch (platform) {
    case 'instagram':
      return 'Instagram';
    case 'direct':
      return 'Direct Media';
    default:
      return 'Unsupported';
  }
}

export function getContentTypeDisplayName(contentType: ContentType): string {
  switch (contentType) {
    case 'instagram_reel':
      return 'Instagram Reel';
    case 'instagram_post':
      return 'Instagram Post';
    case 'instagram_story':
      return 'Instagram Story';
    case 'direct_media':
      return 'Direct Media File';
    default:
      return 'Media Link';
  }
}

export function truncateUrl(url: string, maxLength = 45): string {
  if (!url) return '';
  if (url.length <= maxLength) return url;
  return `${url.slice(0, maxLength - 3)}...`;
}

export function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
