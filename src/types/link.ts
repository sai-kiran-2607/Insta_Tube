/**
 * Strongly typed definitions for supported media links.
 */

export type SupportedPlatform = 'instagram' | 'direct' | 'unsupported';

export type ContentType =
  | 'instagram_reel'
  | 'instagram_post'
  | 'instagram_story'
  | 'direct_media'
  | 'unknown';

export interface LinkParseResult {
  /** The original string provided by the user or intent */
  rawUrl: string;
  /** Trimmed and protocol-normalized URL (or empty if invalid) */
  normalizedUrl: string;
  /** Whether the string is a syntactically valid HTTP/HTTPS URL */
  isValid: boolean;
  /** Recognized platform */
  platform: SupportedPlatform;
  /** Specific content category */
  contentType: ContentType;
  /** Extracted media/video identifier if available */
  mediaId?: string;
  /** Extracted canonical path */
  path?: string;
  /** Human-friendly error or rejection message if invalid */
  errorMessage?: string;
  /** Convenience flag if this is a Reel or Short specifically */
  isReelOrShort: boolean;
}
