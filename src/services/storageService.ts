import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecentActivityItem } from '@/types/activity';
import { DownloadItem } from '@/types/download';

const STORAGE_KEYS = {
  RECENT_LINKS: '@reelfetch:recent_links_v1',
  DOWNLOADS: '@reelfetch:downloads_v1',
  LEGACY_RECENT_LINKS: '@instatube:recent_links_v1',
  LEGACY_DOWNLOADS: '@instatube:downloads_v1',
} as const;

export const storageService = {
  async getRecentLinks(): Promise<RecentActivityItem[]> {
    try {
      let raw = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_LINKS);
      if (!raw) {
        raw = await AsyncStorage.getItem(STORAGE_KEYS.LEGACY_RECENT_LINKS);
      }
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn('[storageService] Failed to load recent links:', err);
      return [];
    }
  },

  async saveRecentLinks(items: RecentActivityItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.RECENT_LINKS,
        JSON.stringify(items.slice(0, 50)) // Persist top 50
      );
    } catch (err) {
      console.warn('[storageService] Failed to save recent links:', err);
    }
  },

  async clearRecentLinks(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.RECENT_LINKS);
      await AsyncStorage.removeItem(STORAGE_KEYS.LEGACY_RECENT_LINKS);
    } catch (err) {
      console.warn('[storageService] Failed to clear recent links:', err);
    }
  },

  async getDownloads(): Promise<DownloadItem[]> {
    try {
      let raw = await AsyncStorage.getItem(STORAGE_KEYS.DOWNLOADS);
      if (!raw) {
        raw = await AsyncStorage.getItem(STORAGE_KEYS.LEGACY_DOWNLOADS);
      }
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn('[storageService] Failed to load downloads:', err);
      return [];
    }
  },

  async saveDownloads(items: DownloadItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(items));
    } catch (err) {
      console.warn('[storageService] Failed to save downloads:', err);
    }
  },

  async clearDownloads(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.DOWNLOADS);
      await AsyncStorage.removeItem(STORAGE_KEYS.LEGACY_DOWNLOADS);
    } catch (err) {
      console.warn('[storageService] Failed to clear downloads:', err);
    }
  },
};
