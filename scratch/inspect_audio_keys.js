const fs = require('fs');

async function inspectAudio() {
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

  console.log('Scripts count:', scripts.length);

  for (let i = 0; i < scripts.length; i++) {
    const s = scripts[i];
    if (s.includes('audio') || s.includes('music') || s.includes('dash')) {
      const cleanJson = s.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
      try {
        const parsed = JSON.parse(cleanJson);
        const str = JSON.stringify(parsed);
        // Look for url patterns with audio, mp3, m4a or similar
        const audioMatches = str.match(/https?:\\\/\\\/[^"]+?\.(?:mp3|m4a|aac)[^"]*/g) || [];
        console.log(`Script ${i}: found ${audioMatches.length} audio url matches`);
        if (audioMatches.length > 0) {
          console.log('Matches:', audioMatches);
        }
        
        // Find keys containing audio
        function findAudioKeys(obj, path = '') {
          if (!obj || typeof obj !== 'object') return;
          for (const k of Object.keys(obj)) {
            if (/audio|music|dash_manifest|playback_url/i.test(k)) {
              console.log('Key:', path + '.' + k, typeof obj[k] === 'object' ? Object.keys(obj[k] || {}) : String(obj[k]).slice(0, 100));
            }
            findAudioKeys(obj[k], path + '.' + k);
          }
        }
        findAudioKeys(parsed);
      } catch (e) {
      }
    }
  }
}

inspectAudio().catch(console.error);
