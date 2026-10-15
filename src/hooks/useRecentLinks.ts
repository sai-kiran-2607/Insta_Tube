import { useEffect, useState } from 'react';
import { recentActivityService } from '@/services/recentActivityService';
import { RecentActivityItem } from '@/types/activity';
import { LinkParseResult } from '@/types/link';

export function useRecentLinks() {
  const [items, setItems] = useState<RecentActivityItem[]>(() =>
    recentActivityService.getItems()
  );

  useEffect(() => {
    const unsubscribe = recentActivityService.subscribe((updated) => {
      setItems(updated);
    });
    return unsubscribe;
  }, []);

  const addLink = (result: LinkParseResult) => {
    return recentActivityService.addFromParseResult(result);
  };

  const clearRecent = () => {
    recentActivityService.clear();
  };

  return {
    recentLinks: items,
    addLink,
    clearRecent,
  };
}
