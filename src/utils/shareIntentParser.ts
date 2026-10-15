import { parseAndValidateUrl } from './urlValidator';
import { LinkParseResult } from '@/types/link';

export type SharedIntentFailureReason =
  | 'EMPTY_TEXT'
  | 'NO_URL_FOUND'
  | 'FORBIDDEN_SCHEME'
  | 'INVALID_URL'
  | 'UNSUPPORTED_PLATFORM';

export interface SharedIntentResult {
  success: boolean;
  rawText: string;
  extractedUrl?: string;
  parseResult?: LinkParseResult;
  reason?: SharedIntentFailureReason;
  errorMessage?: string;
}

// Regex to capture candidate http/https web URLs from arbitrary text
const HTTP_URL_REGEX = /https?:\/\/[^\s<>"]+/i;

// Fallback regex for URLs shared without protocol (e.g. "instagram.com/reel/xyz")
const DOMAIN_URL_REGEX = /(?:www\.)?(?:instagram\.com|instagr\.am)\/[^\s<>"]+/i;

/**
 * Cleans trailing punctuation (dots, commas, parentheses, quotes) often appended in shared prose.
 */
function cleanUrlCandidate(candidate: string): string {
  let cleaned = candidate.trim();
  // Strip trailing punctuation like '.', ',', ';', '!', '?', ')', ']', '"', "'"
  while (/[.,;:!?)\],'">]$/.test(cleaned)) {
    cleaned = cleaned.slice(0, -1);
  }
  // Strip opening bracket if candidate started after an opening bracket that wasn't stripped
  if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
    cleaned = cleaned.slice(1, -1);
  }
  return cleaned;
}

/**
 * Extracts a valid web URL from shared text, or returns null if no valid URL exists.
 */
export function extractUrlFromText(text: string | null | undefined): string | null {
  if (!text || typeof text !== 'string') return null;

  const trimmed = text.trim();
  if (!trimmed) return null;

  // 1. Try finding an http/https URL
  const httpMatch = trimmed.match(HTTP_URL_REGEX);
  if (httpMatch && httpMatch[0]) {
    const cleaned = cleanUrlCandidate(httpMatch[0]);
    if (isValidHttpUrl(cleaned)) {
      return cleaned;
    }
  }

  // 2. Try finding recognized domain URLs without protocol
  const domainMatch = trimmed.match(DOMAIN_URL_REGEX);
  if (domainMatch && domainMatch[0]) {
    const cleaned = cleanUrlCandidate(domainMatch[0]);
    const withProto = `https://${cleaned}`;
    if (isValidHttpUrl(withProto)) {
      return withProto;
    }
  }

  // 3. If entire trimmed text is a candidate URL
  if (!/\s/.test(trimmed)) {
    const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    if (isValidHttpUrl(candidate)) {
      return candidate;
    }
  }

  return null;
}

function isValidHttpUrl(str: string): boolean {
  try {
    const parsed = new URL(str);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Parses and validates shared intent text (from Android ACTION_SEND).
 * Accurately extracts the target URL and runs validation without falsely treating arbitrary prose as a URL.
 */
export function parseSharedIntent(rawText: string | null | undefined): SharedIntentResult {
  if (!rawText || !rawText.trim()) {
    return {
      success: false,
      rawText: rawText || '',
      reason: 'EMPTY_TEXT',
      errorMessage: 'Shared content was empty.',
    };
  }

  const trimmed = rawText.trim();
  const extractedUrl = extractUrlFromText(trimmed);

  if (!extractedUrl) {
    return {
      success: false,
      rawText: trimmed,
      reason: 'NO_URL_FOUND',
      errorMessage:
        'No valid web link was found in the shared text. Please share a valid Instagram Reel link.',
    };
  }

  const parseResult = parseAndValidateUrl(extractedUrl);

  if (!parseResult.isValid) {
    return {
      success: false,
      rawText: trimmed,
      extractedUrl,
      parseResult,
      reason: 'INVALID_URL',
      errorMessage: parseResult.errorMessage || 'Invalid URL found in shared text.',
    };
  }

  return {
    success: true,
    rawText: trimmed,
    extractedUrl: parseResult.normalizedUrl,
    parseResult,
  };
}
