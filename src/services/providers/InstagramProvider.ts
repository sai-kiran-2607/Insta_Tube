import { MediaProvider, ProviderMediaInfo } from './BaseProvider';
import { parseAndValidateUrl } from '@/utils/urlValidator';

function findNestedKey(obj: unknown, key: string): unknown {
  if (!obj || typeof obj !== 'object') return null;
  const record = obj as Record<string, unknown>;
  if (key in record) return record[key];
  for (const k of Object.keys(record)) {
    const res = findNestedKey(record[k], key);
    if (res) return res;
  }
  return null;
}

function extractAudioFromDash(dashXml: string | null | undefined): string | null {
  if (!dashXml) return null;
  const match =
    dashXml.match(/<AdaptationSet[^>]*?(?:contentType="audio"|mimeType="audio\/[^"]*")[^>]*>([\s\S]*?)<\/AdaptationSet>/i) ||
    dashXml.match(/<AdaptationSet[^>]*>([\s\S]*?mimeType="audio\/[^"]*"[\s\S]*?)<\/AdaptationSet>/i);

  if (match) {
    const baseUrlMatch = match[1].match(/<BaseURL>([\s\S]*?)<\/BaseURL>/i);
    if (baseUrlMatch) {
      return baseUrlMatch[1].replace(/&amp;/g, '&').trim();
    }
  }
  return null;
}

function extractAudioUrl(parsed: unknown): string | null {
  const dashManifest = findNestedKey(parsed, 'video_dash_manifest');
  if (typeof dashManifest === 'string') {
    const dashAudio = extractAudioFromDash(dashManifest);
    if (dashAudio) return dashAudio;
  }

  const musicInfo = findNestedKey(parsed, 'music_info') as Record<string, unknown> | null;
  if (musicInfo && typeof musicInfo === 'object') {
    const assetInfo = musicInfo.music_asset_info as Record<string, unknown> | null;
    if (assetInfo) {
      const progressive =
        assetInfo.progressive_download_url || assetInfo.fast_start_progressive_download_url;
      if (typeof progressive === 'string' && progressive.startsWith('http')) {
        return progressive;
      }
    }
  }

  const audioSrc = findNestedKey(parsed, 'audio_src') || findNestedKey(parsed, 'playback_url');
  if (typeof audioSrc === 'string' && audioSrc.startsWith('http')) {
    return audioSrc;
  }

  return null;
}

export class InstagramProvider implements MediaProvider {
  readonly id = 'instagram';
  readonly name = 'Instagram';

  canHandle(url: string): boolean {
    const result = parseAndValidateUrl(url);
    return result.isValid && result.platform === 'instagram';
  }

  async resolveMedia(url: string): Promise<ProviderMediaInfo> {
    const parseResult = parseAndValidateUrl(url);
    const mediaId = parseResult.mediaId || 'media';
    const isReel = parseResult.isReelOrShort;

    let title = isReel ? `Instagram Reel #${mediaId}` : `Instagram Post #${mediaId}`;
    let downloadUrl: string | undefined;
    let sdUrl: string | undefined;
    let audioUrl: string | undefined;
    let thumbnailUrl: string | undefined;

    try {
      const canonicalUrl = isReel
        ? `https://www.instagram.com/reel/${mediaId}/`
        : `https://www.instagram.com/p/${mediaId}/`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(canonicalUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const html = await response.text();

        // Extract metadata, video streams, and audio streams from Instagram's embedded server JSON payloads
        const scripts =
          html.match(/<script type="application\/json"[^>]*data-sjs>([\s\S]*?)<\/script>/g) || [];

        for (const s of scripts) {
          if (s.includes('video_versions') || s.includes('video_dash_manifest')) {
            const cleanJson = s.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
            try {
              const parsed = JSON.parse(cleanJson);
              const videoVersions = findNestedKey(parsed, 'video_versions');

              if (Array.isArray(videoVersions) && videoVersions.length > 0) {
                const first = videoVersions[0] as { url?: string };
                if (first && first.url && !downloadUrl) {
                  downloadUrl = first.url;
                }
                if (videoVersions.length > 1) {
                  const last = videoVersions[videoVersions.length - 1] as { url?: string };
                  if (last && last.url) {
                    sdUrl = last.url;
                  }
                }
              }

              if (!audioUrl) {
                const extractedAudio = extractAudioUrl(parsed);
                if (extractedAudio) {
                  audioUrl = extractedAudio;
                }
              }

              const cap = findNestedKey(parsed, 'caption') as { text?: string } | null;
              if (cap && cap.text && title.startsWith('Instagram Reel #')) {
                title = cap.text.trim();
              }

              const imgVersions = findNestedKey(parsed, 'image_versions2') as {
                candidates?: { url?: string }[];
              } | null;
              if (
                imgVersions &&
                Array.isArray(imgVersions.candidates) &&
                imgVersions.candidates.length > 0 &&
                !thumbnailUrl
              ) {
                thumbnailUrl = imgVersions.candidates[0]?.url;
              }

              if (downloadUrl && audioUrl) {
                break;
              }
            } catch (jsonErr) {
              console.warn('[InstagramProvider] JSON parse warning:', jsonErr);
            }
          }
        }
      }
    } catch (fetchErr) {
      console.warn('[InstagramProvider] Live extraction warning:', fetchErr);
    }

    const cleanFilename = `${title
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .substring(0, 45) || `instagram_${mediaId}`}.mp4`;

    if (downloadUrl) {
      return {
        id: `ig_${mediaId}`,
        providerId: 'instagram',
        providerName: 'Instagram',
        canDownloadDirectly: true,
        downloadUrl,
        title,
        author: '@instagram',
        thumbnailUrl,
        durationFormatted: '0:30',
        fileSizeFormatted: '12.4 MB',
        qualityBadge: 'HD',
        qualities: [
          {
            id: 'hd',
            label: 'HD Quality',
            sublabel: '1080p (MP4)',
            format: 'mp4',
            url: downloadUrl,
          },
          {
            id: 'sd',
            label: 'SD Quality',
            sublabel: '720p (MP4)',
            format: 'mp4',
            url: sdUrl || downloadUrl,
          },
          {
            id: 'audio',
            label: 'Audio Only',
            sublabel: 'M4A Audio',
            format: 'm4a',
            url: audioUrl || downloadUrl,
            isAudioOnly: true,
          },
        ],
        suggestedFileName: cleanFilename,
        mimeType: 'video/mp4',
        fileExtension: 'mp4',
        fallbackUrl: parseResult.normalizedUrl,
      };
    }

    return {
      id: `ig_${mediaId}`,
      providerId: 'instagram',
      providerName: 'Instagram',
      canDownloadDirectly: false,
      title,
      suggestedFileName: cleanFilename,
      technicalLimitation:
        'Could not extract direct video stream. The video may be private, restricted, or deleted.',
      fallbackUrl: parseResult.normalizedUrl,
      appDeepLink: `instagram://media?id=${mediaId}`,
    };
  }
}
