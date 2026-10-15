import { storageService } from './storageService';
import { RecentActivityItem } from '@/types/activity';
import { LinkParseResult } from '@/types/link';

type Listener = (items: RecentActivityItem[]) => void;

class RecentActivityService {
  private items: RecentActivityItem[] = [];
  private listeners: Set<Listener> = new Set();
  private initialized = false;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    try {
      const persisted = await storageService.getRecentLinks();
      this.items = persisted;
      this.initialized = true;
      this.notify();
    } catch (e) {
      console.warn('[RecentActivityService] init error:', e);
    }
  }

  getItems(): RecentActivityItem[] {
    return [...this.items];
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async addFromParseResult(result: LinkParseResult): Promise<RecentActivityItem | null> {
    if (!result.isValid) {
      return null;
    }

    // Check if the URL already exists; if so, bump to top
    const existingIndex = this.items.findIndex(
      (item) => item.url.toLowerCase() === result.normalizedUrl.toLowerCase()
    );

    if (existingIndex !== -1) {
      const existing = this.items[existingIndex];
      const updated: RecentActivityItem = {
        ...existing,
        timestamp: Date.now(),
      };
      this.items.splice(existingIndex, 1);
      this.items.unshift(updated);
      this.notify();
      await storageService.saveRecentLinks(this.items);
      return updated;
    }

    const newItem: RecentActivityItem = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      url: result.normalizedUrl,
      platform: result.platform,
      contentType: result.contentType,
      mediaId: result.mediaId,
      timestamp: Date.now(),
    };

    // Keep up to 30 most recent
    this.items.unshift(newItem);
    if (this.items.length > 30) {
      this.items.pop();
    }

    this.notify();
    await storageService.saveRecentLinks(this.items);
    return newItem;
  }

  async clear(): Promise<void> {
    this.items = [];
    this.notify();
    await storageService.clearRecentLinks();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Emit initial snapshot immediately
    listener(this.getItems());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const snapshot = this.getItems();
    this.listeners.forEach((l) => l(snapshot));
  }
}

export const recentActivityService = new RecentActivityService();
