import { ContentType, SupportedPlatform } from './link';

export interface RecentActivityItem {
  id: string;
  url: string;
  platform: SupportedPlatform;
  contentType: ContentType;
  mediaId?: string;
  timestamp: number;
}
