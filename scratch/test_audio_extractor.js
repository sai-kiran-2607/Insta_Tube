function extractAudioFromDash(dashXml) {
  if (!dashXml) return null;
  // AdaptationSet with contentType="audio" or mimeType starting with audio/
  const match = dashXml.match(/<AdaptationSet[^>]*?(?:contentType="audio"|mimeType="audio\/[^"]*")[^>]*>([\s\S]*?)<\/AdaptationSet>/i)
    || dashXml.match(/<AdaptationSet[^>]*>([\s\S]*?mimeType="audio\/[^"]*"[\s\S]*?)<\/AdaptationSet>/i);

  if (match) {
    const baseUrlMatch = match[1].match(/<BaseURL>([\s\S]*?)<\/BaseURL>/i);
    if (baseUrlMatch) {
      return baseUrlMatch[1].replace(/&amp;/g, '&').trim();
    }
  }
  return null;
}

async function testExtract() {
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

  for (const s of scripts) {
    if (s.includes('video_dash_manifest') || s.includes('video_versions')) {
      const cleanJson = s.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
      try {
        const parsed = JSON.parse(cleanJson);
        const dash = findKey(parsed, 'video_dash_manifest');
        const audioUrl = extractAudioFromDash(dash);
        console.log('Audio URL extracted:', audioUrl ? audioUrl.slice(0, 80) + '...' : 'None');
      } catch (e) {
      }
    }
  }
}

testExtract().catch(console.error);
