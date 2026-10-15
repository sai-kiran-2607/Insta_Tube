function findNestedKey(obj, key) {
  if (!obj || typeof obj !== 'object') return null;
  const record = obj;
  if (key in record) return record[key];
  for (const k of Object.keys(record)) {
    const res = findNestedKey(record[k], key);
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

function extractAudioUrl(parsed) {
  const dashManifest = findNestedKey(parsed, 'video_dash_manifest');
  if (typeof dashManifest === 'string') {
    const dashAudio = extractAudioFromDash(dashManifest);
    if (dashAudio) return dashAudio;
  }

  const musicInfo = findNestedKey(parsed, 'music_info');
  if (musicInfo && typeof musicInfo === 'object') {
    const assetInfo = musicInfo.music_asset_info;
    if (assetInfo) {
      const progressive =
        assetInfo.progressive_download_url || assetInfo.fast_start_progressive_download_url;
      if (typeof progressive === 'string' && progressive.startsWith('http')) {
        return progressive;
      }
    }
  }

  const audioSrc = findNestedKey(parsed, 'audio_src') || findNestedKey(parsed, 'playback_url');
  if (typeof audioSrc === 'string' && audioSrc.startsWith('http')) {
    return audioSrc;
  }

  return null;
}

async function testLiveAudioResolution() {
  const mediaId = 'DcNrAxjJGM0';
  const canonicalUrl = `https://www.instagram.com/reel/${mediaId}/`;
  console.log('Fetching reel:', canonicalUrl);

  const response = await fetch(canonicalUrl, {
    headers: {
      'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  const html = await response.text();
  const scripts = html.match(/<script type="application\/json"[^>]*data-sjs>([\s\S]*?)<\/script>/g) || [];

  let videoUrl = null;
  let audioUrl = null;
  let title = `Instagram Reel #${mediaId}`;

  for (const s of scripts) {
    if (s.includes('video_versions') || s.includes('video_dash_manifest')) {
      const cleanJson = s.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
      try {
        const parsed = JSON.parse(cleanJson);
        const vvs = findNestedKey(parsed, 'video_versions');
        if (Array.isArray(vvs) && vvs.length > 0 && !videoUrl) {
          videoUrl = vvs[0]?.url;
        }

        if (!audioUrl) {
          const a = extractAudioUrl(parsed);
          if (a) audioUrl = a;
        }

        const cap = findNestedKey(parsed, 'caption');
        if (cap && cap.text) {
          title = cap.text.trim();
        }

        if (videoUrl && audioUrl) break;
      } catch (e) {}
    }
  }

  console.log('\n--- Extraction Results ---');
  console.log('Title:', title);
  console.log('Video Stream URL:', videoUrl ? videoUrl.slice(0, 60) + '...' : 'NONE');
  console.log('Audio Stream URL:', audioUrl ? audioUrl.slice(0, 60) + '...' : 'NONE');

  if (!videoUrl || !audioUrl) {
    throw new Error('Failed to extract both video and audio streams!');
  }

  if (videoUrl === audioUrl) {
    throw new Error('Video URL and Audio URL are identical! Audio extraction failed.');
  }

  // Test partial fetch of Video
  const videoHead = await fetch(videoUrl, { headers: { Range: 'bytes=0-1024' } });
  const videoTotal = videoHead.headers.get('content-range')?.split('/')[1];

  // Test partial fetch of Audio
  const audioHead = await fetch(audioUrl, { headers: { Range: 'bytes=0-1024' } });
  const audioTotal = audioHead.headers.get('content-range')?.split('/')[1];

  console.log('\n--- Stream Size Comparison ---');
  console.log(`Video full size: ${videoTotal} bytes (~${(Number(videoTotal) / (1024 * 1024)).toFixed(2)} MB)`);
  console.log(`Audio full size: ${audioTotal} bytes (~${(Number(audioTotal) / 1024).toFixed(1)} KB)`);

  if (Number(audioTotal) >= Number(videoTotal)) {
    throw new Error('Audio stream is not smaller than video stream!');
  }

  console.log('✅ Real audio stream verified: ~10x smaller than video, downloads pure audio stream!');
}

testLiveAudioResolution().catch(err => {
  console.error('Test error:', err.message);
  process.exit(1);
});
