import * as FileSystem from 'expo-file-system/legacy';
import { fileStorageService } from './fileStorageService';
import { storageService } from './storageService';
import { ContentType, SupportedPlatform } from '@/types/link';
import { DownloadItem, DownloadStatus } from '@/types/download';

type DownloadListener = (items: DownloadItem[]) => void;

function formatBytes(bytes: number): string {
  if (bytes <= 0 || isNaN(bytes)) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

class DownloadManager {
  private items: DownloadItem[] = [];
  private activeResumables: Map<string, FileSystem.DownloadResumable> = new Map();
  private listeners: Set<DownloadListener> = new Set();
  private initialized = false;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    try {
      const persisted = await storageService.getDownloads();
      // Verify disk presence for each completed file and clean up any interrupted states
      const verified = await Promise.all(
        persisted.map(async (item) => {
          if (item.status === 'downloading' || item.status === 'pending') {
            return {
              ...item,
              status: 'failed' as DownloadStatus,
              errorMessage: 'Download was interrupted when the app closed.',
              progress: undefined,
            };
          }
          if (item.status === 'completed' && item.fileUri) {
            const check = await fileStorageService.checkFileExists(item.fileUri);
            return {
              ...item,
              fileExistsOnDisk: check.exists,
            };
          }
          return item;
        })
      );

      this.items = verified;
      this.initialized = true;
      this.notify();
    } catch (err) {
      console.warn('[DownloadManager] init error:', err);
    }
  }

  getItems(): DownloadItem[] {
    return [...this.items];
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  subscribe(listener: DownloadListener): () => void {
    this.listeners.add(listener);
    listener(this.getItems());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const snapshot = this.getItems();
    this.listeners.forEach((l) => l(snapshot));
  }

  /**
   * Starts a real media file download with live progress tracking and MediaStore export.
   */
  async startDownload(params: {
    url: string;
    title?: string;
    platform?: SupportedPlatform;
    contentType?: ContentType;
    suggestedFileName?: string;
  }): Promise<DownloadItem> {
    const {
      url,
      title = 'Downloaded Media',
      platform = 'unsupported',
      contentType = 'unknown',
      suggestedFileName = 'media.mp4',
    } = params;

    // 1. Prevent duplicate active downloads for the exact same URL
    const existing = this.items.find(
      (item) => item.url.toLowerCase() === url.toLowerCase()
    );

    if (existing) {
      if (existing.status === 'downloading' || existing.status === 'pending') {
        return existing;
      }
      if (existing.status === 'completed' && existing.fileExistsOnDisk) {
        return existing;
      }
    }

    const downloadId = `dl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const { uri: destUri, fileName } = await fileStorageService.createDestinationUri(
      suggestedFileName
    );

    const newItem: DownloadItem = {
      id: downloadId,
      url,
      platform,
      contentType,
      title: title || fileName,
      status: 'pending',
      progress: 0,
      fileUri: destUri,
      createdAt: Date.now(),
    };

    this.items.unshift(newItem);
    this.notify();
    await storageService.saveDownloads(this.items);

    // 2. Setup real DownloadResumable
    let lastProgressNotify = 0;
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      destUri,
      {},
      (downloadProgress) => {
        const total = downloadProgress.totalBytesExpectedToWrite;
        const written = downloadProgress.totalBytesWritten;
        const progressVal = total > 0 ? Math.min(1, written / total) : 0;

        const now = Date.now();
        // Throttle progress emissions to every 250ms for performance
        if (now - lastProgressNotify > 250 || progressVal >= 1) {
          lastProgressNotify = now;
          this.updateItem(downloadId, {
            status: 'downloading',
            progress: progressVal,
            fileSizeFormatted: total > 0 ? formatBytes(total) : formatBytes(written),
          });
        }
      }
    );

    this.activeResumables.set(downloadId, downloadResumable);
    this.updateItem(downloadId, { status: 'downloading', progress: 0 });

    // 3. Execute download with a 60-second timeout guard
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Network request timed out after 60 seconds.')), 60000);
    });

    try {
      const result = await Promise.race([downloadResumable.downloadAsync(), timeoutPromise]);

      if (!result || !result.uri) {
        throw new Error('Download failed: No output file received.');
      }

      // Verify file presence and size
      const fileInfo = await fileStorageService.checkFileExists(result.uri);
      if (!fileInfo.exists || (fileInfo.size ?? 0) <= 0) {
        throw new Error('Downloaded file is empty or missing.');
      }

      const formattedSize = formatBytes(fileInfo.size || 0);

      // Attempt to export to Android MediaStore gallery
      const mediaExport = await fileStorageService.exportToMediaLibrary(result.uri);

      const completed = this.updateItem(downloadId, {
        status: 'completed',
        progress: 1,
        fileUri: result.uri,
        fileExistsOnDisk: true,
        savedToGallery: mediaExport.success,
        fileSizeFormatted: formattedSize,
      });

      this.activeResumables.delete(downloadId);
      await storageService.saveDownloads(this.items);
      return completed || newItem;
    } catch (err: unknown) {
      this.activeResumables.delete(downloadId);
      // Clean up any partially downloaded file
      await fileStorageService.deleteFile(destUri);

      const errorMessage =
        err instanceof Error ? err.message : 'Unknown network failure during download.';

      const failed = this.updateItem(downloadId, {
        status: 'failed',
        errorMessage,
        progress: undefined,
        fileExistsOnDisk: false,
      });

      await storageService.saveDownloads(this.items);
      return failed || newItem;
    }
  }

  /**
   * Cancels an ongoing download and cleans up temporary partial files.
   */
  async cancelDownload(id: string): Promise<void> {
    const resumable = this.activeResumables.get(id);
    if (resumable) {
      try {
        await resumable.cancelAsync();
      } catch (e) {
        console.warn('[DownloadManager] cancel error:', e);
      }
      this.activeResumables.delete(id);
    }

    const item = this.items.find((i) => i.id === id);
    if (item && item.fileUri) {
      await fileStorageService.deleteFile(item.fileUri);
    }

    this.updateItem(id, {
      status: 'cancelled',
      errorMessage: 'Download cancelled by user.',
      progress: undefined,
      fileExistsOnDisk: false,
    });
    await storageService.saveDownloads(this.items);
  }

  /**
   * Retries a failed or cancelled download.
   */
  async retryDownload(id: string): Promise<void> {
    const item = this.items.find((i) => i.id === id);
    if (!item) return;

    // Remove existing failed entry
    this.items = this.items.filter((i) => i.id !== id);
    this.notify();

    await this.startDownload({
      url: item.url,
      title: item.title,
      platform: item.platform,
      contentType: item.contentType,
      suggestedFileName: item.title,
    });
  }

  /**
   * Deletes a download record and optionally removes the downloaded file from disk.
   */
  async deleteDownload(id: string, removeFile = true): Promise<void> {
    const resumable = this.activeResumables.get(id);
    if (resumable) {
      try {
        await resumable.cancelAsync();
      } catch {}
      this.activeResumables.delete(id);
    }

    const item = this.items.find((i) => i.id === id);
    if (removeFile && item?.fileUri) {
      await fileStorageService.deleteFile(item.fileUri);
    }

    this.items = this.items.filter((i) => i.id !== id);
    this.notify();
    await storageService.saveDownloads(this.items);
  }

  async clearAllDownloads(): Promise<void> {
    // Cancel any active
    for (const [id, resumable] of this.activeResumables.entries()) {
      try {
        await resumable.cancelAsync();
      } catch {}
      this.activeResumables.delete(id);
    }

    // Clean up local files
    for (const item of this.items) {
      if (item.fileUri) {
        await fileStorageService.deleteFile(item.fileUri);
      }
    }

    this.items = [];
    this.notify();
    await storageService.clearDownloads();
  }

  private updateItem(id: string, updates: Partial<DownloadItem>): DownloadItem | null {
    const idx = this.items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    this.items[idx] = { ...this.items[idx], ...updates };
    this.notify();
    return this.items[idx];
  }
}

export const downloadManager = new DownloadManager();
