import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const DOWNLOADS_SUBDIR = 'downloads/';

/**
 * Safely resolves the MediaLibrary module if native bindings are present in the current runtime.
 * Avoids throwing `Cannot find native module 'ExpoMediaLibraryNext'` in Expo Go or non-prebuilt runtimes.
 */
async function getMediaLibraryModule() {
  try {
    return await import('expo-media-library/legacy');
  } catch {
    try {
      return await import('expo-media-library');
    } catch {
      return null;
    }
  }
}

export const fileStorageService = {
  /**
   * Root directory where completed and active downloads are kept.
   */
  getDownloadsDirectory(): string {
    const base = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';
    return `${base}${DOWNLOADS_SUBDIR}`;
  },

  /**
   * Ensures the local downloads directory exists.
   */
  async ensureDirectoryExists(): Promise<string> {
    const dir = this.getDownloadsDirectory();
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
    return dir;
  },

  /**
   * Checks whether a file exists at the given URI and returns info.
   */
  async checkFileExists(uri: string): Promise<{ exists: boolean; size?: number }> {
    if (!uri) return { exists: false };
    try {
      const info = await FileSystem.getInfoAsync(uri);
      return {
        exists: info.exists,
        size: info.exists && 'size' in info ? info.size : undefined,
      };
    } catch {
      return { exists: false };
    }
  },

  /**
   * Generates a safe, sanitized, unique destination URI inside the downloads directory.
   */
  async createDestinationUri(suggestedName: string): Promise<{ uri: string; fileName: string }> {
    const dir = await this.ensureDirectoryExists();
    // Sanitize filename to alphanumeric, dots, dashes, underscores
    let safeName = suggestedName.replace(/[^a-zA-Z0-9._-]/g, '_');
    if (!safeName.includes('.')) {
      safeName += '.mp4';
    }

    let targetUri = `${dir}${safeName}`;
    const existsCheck = await FileSystem.getInfoAsync(targetUri);

    // If file already exists, append unique timestamp to prevent overwriting
    if (existsCheck.exists) {
      const parts = safeName.split('.');
      const ext = parts.pop();
      const base = parts.join('.');
      safeName = `${base}_${Date.now()}.${ext}`;
      targetUri = `${dir}${safeName}`;
    }

    return { uri: targetUri, fileName: safeName };
  },

  /**
   * Saves a downloaded media file to the user-accessible Android MediaStore / Gallery.
   * If native MediaLibrary is unavailable in the current runtime (e.g. Expo Go),
   * fails gracefully without crashing the app.
   */
  async exportToMediaLibrary(
    fileUri: string
  ): Promise<{ success: boolean; assetUri?: string; error?: string }> {
    try {
      const exists = await this.checkFileExists(fileUri);
      if (!exists.exists) {
        return { success: false, error: 'Source file does not exist on disk.' };
      }

      const MediaLibrary = await getMediaLibraryModule();
      if (!MediaLibrary) {
        return {
          success: false,
          error:
            'MediaLibrary native module is not available in this runtime. You can still use the "Share" button to view or export the video.',
        };
      }

      // Request media library write permission
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== 'granted') {
        return {
          success: false,
          error: 'Storage permission denied. File remains safely stored in app documents.',
        };
      }

      // Create asset in Android MediaStore
      const asset = await MediaLibrary.createAssetAsync(fileUri);

      // Attempt optional placement in dedicated "ReelFetch" album without throwing unhandled warnings
      try {
        const currentPerms = await MediaLibrary.getPermissionsAsync();
        if (currentPerms.status === 'granted') {
          const album = await MediaLibrary.getAlbumAsync('ReelFetch');
          if (!album) {
            await MediaLibrary.createAlbumAsync('ReelFetch', asset, false);
          } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          }
        }
      } catch {
        // Non-critical: asset is already created in the device gallery
      }

      return { success: true, assetUri: asset.uri };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save to gallery.';
      return { success: false, error: message };
    }
  },

  /**
   * Shares the file using Android system share sheet.
   */
  async shareFile(fileUri: string, mimeType = 'video/mp4'): Promise<boolean> {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) return false;

      const isAudio =
        fileUri.toLowerCase().endsWith('.m4a') ||
        fileUri.toLowerCase().endsWith('.mp3') ||
        fileUri.toLowerCase().endsWith('.aac') ||
        fileUri.toLowerCase().endsWith('.wav');

      const effectiveMime =
        mimeType !== 'video/mp4'
          ? mimeType
          : isAudio
          ? fileUri.toLowerCase().endsWith('.mp3')
            ? 'audio/mpeg'
            : 'audio/mp4'
          : 'video/mp4';

      await Sharing.shareAsync(fileUri, {
        mimeType: effectiveMime,
        dialogTitle: isAudio ? 'Share audio file' : 'Share video file',
      });
      return true;
    } catch (err) {
      console.warn('[fileStorageService] Share file error:', err);
      return false;
    }
  },

  /**
   * Deletes a local file.
   */
  async deleteFile(fileUri: string): Promise<boolean> {
    try {
      if (!fileUri) return false;
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
      return true;
    } catch (err) {
      console.warn('[fileStorageService] Delete file error:', err);
      return false;
    }
  },
};
