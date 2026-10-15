/**
 * URL parsing and validation utility for Instagram Reels.
 */
import { LinkParseResult } from '@/types/link';

// Forbidden protocols that must be strictly rejected
const FORBIDDEN_SCHEMES = [
  'javascript:',
  'data:',
  'file:',
  'about:',
  'vbscript:',
  'blob:',
];

/**
 * Validates, normalizes, and classifies a user-provided URL.
 */
export function parseAndValidateUrl(input: string): LinkParseResult {
  const trimmed = input.trim();

  // 1. Handle empty input
  if (!trimmed) {
    return {
      rawUrl: input,
      normalizedUrl: '',
      isValid: false,
      platform: 'unsupported',
      contentType: 'unknown',
      isReelOrShort: false,
      errorMessage: 'Please enter or paste an Instagram Reel link.',
    };
  }

  // 2. Reject malicious / forbidden protocols explicitly
  const lowerInput = trimmed.toLowerCase();
  for (const scheme of FORBIDDEN_SCHEMES) {
    if (lowerInput.startsWith(scheme)) {
      return {
        rawUrl: input,
        normalizedUrl: '',
        isValid: false,
        platform: 'unsupported',
        contentType: 'unknown',
        isReelOrShort: false,
        errorMessage: `Unsupported URL protocol: "${scheme.replace(':', '')}". Only HTTP and HTTPS are permitted.`,
      };
    }
  }

  // 3. Normalize scheme: prepend https:// if missing
  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    // If it looks like a domain or domain/path, prepend https://
    candidate = `https://${candidate}`;
  }

  // 4. Parse using URL constructor
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(candidate);
  } catch {
    return {
      rawUrl: input,
      normalizedUrl: '',
      isValid: false,
      platform: 'unsupported',
      contentType: 'unknown',
      isReelOrShort: false,
      errorMessage: 'The provided text is not a valid URL.',
    };
  }

  // Strictly enforce http or https
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return {
      rawUrl: input,
      normalizedUrl: '',
      isValid: false,
      platform: 'unsupported',
      contentType: 'unknown',
      isReelOrShort: false,
      errorMessage: `Protocol "${parsedUrl.protocol}" is not supported. Only http:// or https:// links are supported.`,
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const pathname = parsedUrl.pathname;

  // 5. Check direct media file extensions (.mp4, .webm, .mov, etc.)
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
  const isDirectMedia = DIRECT_MEDIA_EXTENSIONS.some((ext) =>
    pathname.toLowerCase().endsWith(ext)
  );
  if (isDirectMedia) {
    return {
      rawUrl: input,
      normalizedUrl: parsedUrl.toString(),
      isValid: true,
      platform: 'direct',
      contentType: 'direct_media',
      isReelOrShort: false,
      path: pathname,
    };
  }

  // 6. Check Instagram hostnames
  const isInstagramHost =
    hostname === 'instagram.com' ||
    hostname.endsWith('.instagram.com') ||
    hostname === 'instagr.am' ||
    hostname.endsWith('.instagr.am');

  if (isInstagramHost) {
    return classifyInstagramUrl(input, parsedUrl);
  }

  // 7. Reject YouTube explicitly
  const isYouTubeHost =
    hostname === 'youtube.com' ||
    hostname.endsWith('.youtube.com') ||
    hostname === 'youtu.be';

  if (isYouTubeHost) {
    return {
      rawUrl: input,
      normalizedUrl: parsedUrl.toString(),
      isValid: false,
      platform: 'unsupported',
      contentType: 'unknown',
      isReelOrShort: false,
      path: pathname,
      errorMessage: 'YouTube links are not supported. Please paste an Instagram Reel link.',
    };
  }

  // 8. Unsupported platform
  return {
    rawUrl: input,
    normalizedUrl: parsedUrl.toString(),
    isValid: false,
    platform: 'unsupported',
    contentType: 'unknown',
    isReelOrShort: false,
    path: pathname,
    errorMessage: `Only Instagram Reel links are supported. Detected domain: ${hostname}`,
  };
}

/**
 * Classifies an Instagram URL into Reel, Post, or rejects non-media pages.
 */
function classifyInstagramUrl(rawInput: string, parsed: URL): LinkParseResult {
  const pathname = parsed.pathname;

  // Match /reel/{id} or /reels/{id}
  const reelMatch = pathname.match(/^\/reels?\/([a-zA-Z0-9_-]+)/i);
  if (reelMatch) {
    return {
      rawUrl: rawInput,
      normalizedUrl: parsed.toString(),
      isValid: true,
      platform: 'instagram',
      contentType: 'instagram_reel',
      mediaId: reelMatch[1],
      path: pathname,
      isReelOrShort: true,
    };
  }

  // Match /p/{id} (Instagram video posts)
  const postMatch = pathname.match(/^\/p\/([a-zA-Z0-9_-]+)/i);
  if (postMatch) {
    return {
      rawUrl: rawInput,
      normalizedUrl: parsed.toString(),
      isValid: true,
      platform: 'instagram',
      contentType: 'instagram_post',
      mediaId: postMatch[1],
      path: pathname,
      isReelOrShort: false,
    };
  }

  // All other Instagram URLs (profile, explore, stories, etc.)
  return {
    rawUrl: rawInput,
    normalizedUrl: parsed.toString(),
    isValid: false,
    platform: 'instagram',
    contentType: 'unknown',
    path: pathname,
    isReelOrShort: false,
    errorMessage:
      'Please provide a link to a specific Instagram Reel (e.g., instagram.com/reel/...). Profile and explore links are not supported.',
  };
}
