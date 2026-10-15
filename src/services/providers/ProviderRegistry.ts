import { MediaProvider, ProviderMediaInfo } from './BaseProvider';
import { DirectMediaProvider } from './DirectMediaProvider';
import { InstagramProvider } from './InstagramProvider';
import { parseAndValidateUrl } from '@/utils/urlValidator';

class ProviderRegistry {
  private providers: MediaProvider[] = [];

  constructor() {
    // Registered in priority order: direct media streams first, then platform handlers
    this.providers.push(new DirectMediaProvider());
    this.providers.push(new InstagramProvider());
  }

  registerProvider(provider: MediaProvider): void {
    this.providers.unshift(provider);
  }

  findProvider(url: string): MediaProvider | null {
    for (const provider of this.providers) {
      if (provider.canHandle(url)) {
        return provider;
      }
    }
    return null;
  }

  async resolve(url: string): Promise<ProviderMediaInfo> {
    const provider = this.findProvider(url);
    if (provider) {
      return provider.resolveMedia(url);
    }

    const parseResult = parseAndValidateUrl(url);
    return {
      id: `unsupported_${Date.now()}`,
      providerId: 'unsupported',
      providerName: 'Unsupported Source',
      canDownloadDirectly: false,
      title: parseResult.normalizedUrl || url,
      suggestedFileName: 'media.mp4',
      policyNotice:
        'This domain or link format does not match any currently supported or permitted media providers.',
      fallbackUrl: parseResult.normalizedUrl || url,
    };
  }
}

export const providerRegistry = new ProviderRegistry();
