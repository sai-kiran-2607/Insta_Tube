const fs = require('fs');

async function testAudioDownload() {
  const mediaId = 'DcNrAxjJGM0';
  const canonicalUrl = `https://www.instagram.com/reel/${mediaId}/`;
  const response = await fetch(canonicalUrl, {
    headers: {
      'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  const html = await response.text();
  const scripts = html.match(/<script type="application\/json"[^>]*data-sjs>([\s\S]*?)<\/script>/g) || [];

  function findKey(obj, key) {
    if (!obj || typeof obj !== 'object') return null;
    if (key in obj) return obj[key];
    for (const k of Object.keys(obj)) {
      const res = findKey(obj[k], key);
      if (res) return res;
    }
    return null;
  }

  function extractAudioFromDash(dashXml) {
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

  let audioUrl = null;
  let videoUrl = null;

  for (const s of scripts) {
    if (s.includes('video_versions') || s.includes('video_dash_manifest')) {
      try {
        const cleanJson = s.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
        const parsed = JSON.parse(cleanJson);
        const dash = findKey(parsed, 'video_dash_manifest');
        if (dash && !audioUrl) {
          audioUrl = extractAudioFromDash(dash);
        }
        const vvs = findKey(parsed, 'video_versions');
        if (Array.isArray(vvs) && vvs.length > 0 && !videoUrl) {
          videoUrl = vvs[0]?.url;
        }
      } catch (e) {}
    }
  }

  console.log('Video URL:', videoUrl ? videoUrl.slice(0, 60) + '...' : null);
  console.log('Audio URL:', audioUrl ? audioUrl.slice(0, 60) + '...' : null);

  if (audioUrl) {
    const audioRes = await fetch(audioUrl);
    const audioBuffer = Buffer.from(await audioRes.arrayBuffer());
    console.log('Audio downloaded byte length:', audioBuffer.length);
    console.log('First 16 bytes hex:', audioBuffer.slice(0, 16).toString('hex'));
    console.log('First 16 bytes ascii:', audioBuffer.slice(0, 16).toString('ascii'));

    // Check if it's MP4/M4A container (ftyp box)
    const isM4A = audioBuffer.slice(4, 8).toString('ascii') === 'ftyp';
    console.log('Is valid ISO/M4A container:', isM4A);
  }
}

testAudioDownload().catch(console.error);
