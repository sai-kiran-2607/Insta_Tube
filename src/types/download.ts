import { ContentType, SupportedPlatform } from './link';

export type DownloadStatus =
  | 'pending'
  | 'downloading'
  | 'completed'
  | 'cancelled'
  | 'failed';

export interface DownloadItem {
  id: string;
  url: string;
  platform: SupportedPlatform;
  contentType: ContentType;
  title?: string;
  thumbnailUrl?: string;
  status: DownloadStatus;
  /** Download progress from 0.0 to 1.0; undefined if progress cannot be tracked */
  progress?: number;
  /** Human-readable error message when status is 'failed' */
  errorMessage?: string;
  /** Downloaded file local URI when completed */
  fileUri?: string;
  /** Whether the file physically exists on disk */
  fileExistsOnDisk?: boolean;
  /** Whether the file was exported to Android MediaStore / Gallery */
  savedToGallery?: boolean;
  /** File size formatted e.g. "12.4 MB" */
  fileSizeFormatted?: string;
  createdAt: number;
}
