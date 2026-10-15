import { useEffect, useState } from 'react';
import { downloadManager } from '@/services/downloadManager';
import { fileStorageService } from '@/services/fileStorageService';
import { DownloadItem } from '@/types/download';
import { ContentType, SupportedPlatform } from '@/types/link';

export function useDownloads() {
  const [downloads, setDownloads] = useState<DownloadItem[]>(() =>
    downloadManager.getItems()
  );

  useEffect(() => {
    const unsubscribe = downloadManager.subscribe((updated) => {
      setDownloads(updated);
    });
    return unsubscribe;
  }, []);

  const startDownload = async (params: {
    url: string;
    title?: string;
    platform?: SupportedPlatform;
    contentType?: ContentType;
    suggestedFileName?: string;
  }) => {
    return downloadManager.startDownload(params);
  };

  const cancelDownload = async (id: string) => {
    return downloadManager.cancelDownload(id);
  };

  const retryDownload = async (id: string) => {
    return downloadManager.retryDownload(id);
  };

  const deleteDownload = async (id: string, deleteFile = true) => {
    return downloadManager.deleteDownload(id, deleteFile);
  };

  const clearAll = async () => {
    return downloadManager.clearAllDownloads();
  };

  const shareFile = async (fileUri: string, mimeType = 'video/mp4') => {
    return fileStorageService.shareFile(fileUri, mimeType);
  };

  const exportToGallery = async (fileUri: string) => {
    return fileStorageService.exportToMediaLibrary(fileUri);
  };

  return {
    downloads,
    startDownload,
    cancelDownload,
    retryDownload,
    deleteDownload,
    clearAll,
    shareFile,
    exportToGallery,
  };
}
