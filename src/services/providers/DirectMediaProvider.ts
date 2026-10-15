import { MediaProvider, ProviderMediaInfo } from './BaseProvider';

const DIRECT_MEDIA_EXTENSIONS = [
  '.mp4',
  '.webm',
  '.mov',
  '.m4v',
  '.3gp',
  '.mp3',
  '.m4a',
  '.wav',
  '.aac',
  '.ogg',
];

export class DirectMediaProvider implements MediaProvider {
  readonly id = 'direct';
  readonly name = 'Direct Media Stream';

  canHandle(url: string): boolean {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      const pathname = parsed.pathname.toLowerCase();
      return DIRECT_MEDIA_EXTENSIONS.some((ext) => pathname.endsWith(ext));
    } catch {
      return false;
    }
  }

  async resolveMedia(url: string): Promise<ProviderMediaInfo> {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const filename = pathname.split('/').filter(Boolean).pop() || `media_${Date.now()}.mp4`;
    const cleanFilename = filename.split('?')[0].replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = cleanFilename.includes('.') ? cleanFilename.split('.').pop() || 'mp4' : 'mp4';

    return {
      id: `direct_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      providerId: 'direct',
      providerName: 'Direct Media Stream',
      canDownloadDirectly: true,
      downloadUrl: url,
      title: cleanFilename,
      author: 'Direct Link',
      durationFormatted: '0:45',
      fileSizeFormatted: '8.5 MB',
      qualityBadge: ext.toUpperCase(),
      qualities: [
        {
          id: 'hd',
          label: 'Original Quality',
          sublabel: `${ext.toUpperCase()} Stream`,
          format: ext,
          url,
        },
      ],
      mimeType: ext === 'mp3' || ext === 'm4a' || ext === 'wav' ? 'audio/mpeg' : 'video/mp4',
      fileExtension: ext,
      suggestedFileName: cleanFilename,
      fallbackUrl: url,
    };
  }
}
