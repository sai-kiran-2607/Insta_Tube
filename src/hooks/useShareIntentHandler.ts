import { useEffect, useRef } from 'react';
import { useShareIntent } from 'expo-share-intent';
import { parseSharedIntent } from '@/utils/shareIntentParser';

export function useShareIntentHandler(onUrlReceived?: (url: string) => void) {
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntent({
    debug: false,
    resetOnBackground: true,
  });

  const lastProcessedUrlRef = useRef<string | null>(null);
  const lastProcessedTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!hasShareIntent) return;

    // Retrieve shared text from native share intent
    const rawText = shareIntent.text || shareIntent.webUrl;
    if (!rawText) {
      resetShareIntent(true);
      return;
    }

    // Reset native intent state immediately to avoid re-triggering on re-render/re-focus
    resetShareIntent(true);

    const result = parseSharedIntent(rawText);

    if (result.success && result.parseResult) {
      const normalized = result.parseResult.normalizedUrl;
      const now = Date.now();

      // Prevent duplicate processing within 3 seconds
      if (lastProcessedUrlRef.current === normalized && now - lastProcessedTimeRef.current < 3000) {
        return;
      }

      lastProcessedUrlRef.current = normalized;
      lastProcessedTimeRef.current = now;

      if (onUrlReceived) {
        onUrlReceived(normalized);
      }
    } else if (result.extractedUrl) {
      const now = Date.now();
      if (lastProcessedUrlRef.current === result.extractedUrl && now - lastProcessedTimeRef.current < 3000) {
        return;
      }
      lastProcessedUrlRef.current = result.extractedUrl;
      lastProcessedTimeRef.current = now;

      if (onUrlReceived) {
        onUrlReceived(result.extractedUrl);
      }
    }
  }, [hasShareIntent, shareIntent, resetShareIntent, onUrlReceived]);
}
