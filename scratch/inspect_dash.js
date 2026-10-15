const fs = require('fs');

async function inspectDash() {
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

  for (const s of scripts) {
    if (s.includes('video_dash_manifest')) {
      const cleanJson = s.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
      const parsed = JSON.parse(cleanJson);
      function findKey(obj, key) {
        if (!obj || typeof obj !== 'object') return null;
        if (key in obj) return obj[key];
        for (const k of Object.keys(obj)) {
          const res = findKey(obj[k], key);
          if (res) return res;
        }
        return null;
      }
      const manifest = findKey(parsed, 'video_dash_manifest');
      console.log('--- DASH MANIFEST ---');
      console.log(manifest);

      const musicInfo = findKey(parsed, 'music_info');
      console.log('--- MUSIC INFO ---');
      console.log(JSON.stringify(musicInfo, null, 2));

      const origSound = findKey(parsed, 'original_sound_info');
      console.log('--- ORIGINAL SOUND INFO ---');
      console.log(JSON.stringify(origSound, null, 2));
    }
  }
}

inspectDash().catch(console.error);
