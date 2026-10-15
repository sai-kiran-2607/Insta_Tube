/**
 * Base provider interfaces and data structures for extensible media resolution.
 */

export interface MediaQualityOption {
  id: string;
  label: string;
  sublabel: string;
  format: string;
  url?: string;
  isAudioOnly?: boolean;
}

export interface ProviderMediaInfo {
  id: string;
  providerId: 'instagram' | 'direct' | 'unsupported';
  providerName: string;
  canDownloadDirectly: boolean;
  downloadUrl?: string;
  title: string;
  author?: string;
  thumbnailUrl?: string;
  durationFormatted?: string;
  fileSizeFormatted?: string;
  qualityBadge?: string;
  qualities?: MediaQualityOption[];
  mimeType?: string;
  fileExtension?: string;
  suggestedFileName: string;
  policyNotice?: string;
  technicalLimitation?: string;
  requiresAuthorization?: boolean;
  fallbackUrl?: string;
  appDeepLink?: string;
}

export interface MediaProvider {
  readonly id: string;
  readonly name: string;
  canHandle(url: string): boolean;
  resolveMedia(url: string): Promise<ProviderMediaInfo>;
}
