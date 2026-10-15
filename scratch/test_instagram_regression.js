const assert = require('assert');

// Simulate the compiled TypeScript logic or direct functions
function testUrlValidator() {
  console.log('--- TEST 1: URL Validator & Platform Rejection ---');

  // Forbidden protocols
  const FORBIDDEN_SCHEMES = ['javascript:', 'data:', 'file:', 'about:', 'vbscript:', 'blob:'];

  function parseAndValidateUrl(input) {
    const trimmed = input.trim();
    if (!trimmed) {
      return { isValid: false, errorMessage: 'Please enter or paste an Instagram Reel link.' };
    }
    const lowerInput = trimmed.toLowerCase();
    for (const scheme of FORBIDDEN_SCHEMES) {
      if (lowerInput.startsWith(scheme)) {
        return { isValid: false, errorMessage: `Unsupported URL protocol: "${scheme.replace(':', '')}". Only HTTP and HTTPS are permitted.` };
      }
    }
    let candidate = trimmed;
    if (!/^https?:\/\//i.test(candidate)) {
      candidate = `https://${candidate}`;
    }
    let parsedUrl;
    try {
      parsedUrl = new URL(candidate);
    } catch {
      return { isValid: false, errorMessage: 'The provided text is not a valid URL.' };
    }
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return { isValid: false, errorMessage: `Protocol "${parsedUrl.protocol}" is not supported.` };
    }
    const hostname = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname;

    const isInstagramHost =
      hostname === 'instagram.com' ||
      hostname.endsWith('.instagram.com') ||
      hostname === 'instagr.am' ||
      hostname.endsWith('.instagr.am');

    if (isInstagramHost) {
      const reelMatch = pathname.match(/^\/reels?\/([a-zA-Z0-9_-]+)/i);
      if (reelMatch) {
        return {
          isValid: true,
          platform: 'instagram',
          contentType: 'instagram_reel',
          mediaId: reelMatch[1],
        };
      }
      const postMatch = pathname.match(/^\/p\/([a-zA-Z0-9_-]+)/i);
      if (postMatch) {
        return {
          isValid: true,
          platform: 'instagram',
          contentType: 'instagram_post',
          mediaId: postMatch[1],
        };
      }
      return {
        isValid: false,
        platform: 'instagram',
        errorMessage: 'Please provide a link to a specific Instagram Reel (e.g., instagram.com/reel/...). Profile and explore links are not supported.',
      };
    }

    const isYouTubeHost =
      hostname === 'youtube.com' ||
      hostname.endsWith('.youtube.com') ||
      hostname === 'youtu.be';

    if (isYouTubeHost) {
      return {
        isValid: false,
        platform: 'unsupported',
        errorMessage: 'YouTube links are not supported. Please paste an Instagram Reel link.',
      };
    }

    return {
      isValid: false,
      platform: 'unsupported',
      errorMessage: `Only Instagram Reel links are supported. Detected domain: ${hostname}`,
    };
  }

  // 1. Valid Instagram Reel link
  const validReel = parseAndValidateUrl('https://www.instagram.com/reel/C-xyz123/');
  assert.strictEqual(validReel.isValid, true);
  assert.strictEqual(validReel.platform, 'instagram');
  assert.strictEqual(validReel.contentType, 'instagram_reel');
  assert.strictEqual(validReel.mediaId, 'C-xyz123');
  console.log('✅ 1. Valid Instagram Reel passed');

  // 2. Valid Instagram Reel without protocol
  const validReelNoProto = parseAndValidateUrl('instagram.com/reel/D123456');
  assert.strictEqual(validReelNoProto.isValid, true);
  assert.strictEqual(validReelNoProto.platform, 'instagram');
  assert.strictEqual(validReelNoProto.mediaId, 'D123456');
  console.log('✅ 2. Valid Instagram Reel without protocol passed');

  // 3. Instagram non-media profile/explore link (rejected clearly)
  const igProfile = parseAndValidateUrl('https://www.instagram.com/username/');
  assert.strictEqual(igProfile.isValid, false);
  assert.ok(igProfile.errorMessage.includes('Please provide a link to a specific Instagram Reel'));
  console.log('✅ 3. Instagram non-media link rejected clearly');

  // 4. YouTube Video / Short link (rejected clearly)
  const ytVideo = parseAndValidateUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert.strictEqual(ytVideo.isValid, false);
  assert.strictEqual(ytVideo.errorMessage, 'YouTube links are not supported. Please paste an Instagram Reel link.');

  const ytShort = parseAndValidateUrl('https://www.youtube.com/shorts/abcdef123');
  assert.strictEqual(ytShort.isValid, false);
  assert.strictEqual(ytShort.errorMessage, 'YouTube links are not supported. Please paste an Instagram Reel link.');

  const youtuBe = parseAndValidateUrl('https://youtu.be/dQw4w9WgXcQ');
  assert.strictEqual(youtuBe.isValid, false);
  assert.strictEqual(youtuBe.errorMessage, 'YouTube links are not supported. Please paste an Instagram Reel link.');
  console.log('✅ 4. YouTube links (watch, shorts, youtu.be) rejected clearly');

  // 5. Arbitrary unsupported domain (rejected clearly)
  const tiktok = parseAndValidateUrl('https://www.tiktok.com/@user/video/12345678');
  assert.strictEqual(tiktok.isValid, false);
  assert.ok(tiktok.errorMessage.includes('Only Instagram Reel links are supported'));
  console.log('✅ 5. Other platforms rejected clearly');

  // 6. Invalid / malformed input
  const empty = parseAndValidateUrl('');
  assert.strictEqual(empty.isValid, false);
  assert.strictEqual(empty.errorMessage, 'Please enter or paste an Instagram Reel link.');

  const jsScheme = parseAndValidateUrl('javascript:alert(1)');
  assert.strictEqual(jsScheme.isValid, false);
  assert.ok(jsScheme.errorMessage.includes('Unsupported URL protocol'));
  console.log('✅ 6. Empty and malicious inputs handled safely');

  // 7. Share Intent text parsing
  const HTTP_URL_REGEX = /https?:\/\/[^\s<>"]+/i;
  const DOMAIN_URL_REGEX = /(?:www\.)?(?:instagram\.com|instagr\.am)\/[^\s<>"]+/i;

  function extractUrlFromText(text) {
    if (!text) return null;
    const httpMatch = text.match(HTTP_URL_REGEX);
    if (httpMatch) return httpMatch[0].replace(/[.,;:!?)\],'">]+$/, '');
    const domainMatch = text.match(DOMAIN_URL_REGEX);
    if (domainMatch) return 'https://' + domainMatch[0].replace(/[.,;:!?)\],'">]+$/, '');
    return null;
  }

  const sharedText = 'Check out this awesome reel: https://www.instagram.com/reel/C8xYz12345/! Found it funny.';
  const extracted = extractUrlFromText(sharedText);
  assert.strictEqual(extracted, 'https://www.instagram.com/reel/C8xYz12345/');
  const parsedShared = parseAndValidateUrl(extracted);
  assert.strictEqual(parsedShared.isValid, true);
  assert.strictEqual(parsedShared.platform, 'instagram');
  console.log('✅ 7. Android Share-Intent text extraction and validation passed');
}

testUrlValidator();
