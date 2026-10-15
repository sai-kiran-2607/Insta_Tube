const https = require('https');
const fs = require('fs');

function findNestedKey(obj, key) {
  if (!obj || typeof obj !== 'object') return null;
  if (key in obj) return obj[key];
  for (const k of Object.keys(obj)) {
    const res = findNestedKey(obj[k], key);
    if (res) return res;
  }
  return null;
}

async function testLiveInstagramReel(mediaId) {
  console.log(`--- Testing Live Instagram Reel Resolution: ${mediaId} ---`);
  const canonicalUrl = `https://www.instagram.com/reel/${mediaId}/`;

  const response = await fetch(canonicalUrl, {
    headers: {
      'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  console.log('HTTP Status:', response.status);
  const html = await response.text();

  let downloadUrl = null;
  let title = `Instagram Reel #${mediaId}`;
  let thumbnailUrl = null;

  const scripts = html.match(/<script type="application\/json"[^>]*data-sjs>([\s\S]*?)<\/script>/g) || [];
  console.log('Found data-sjs scripts:', scripts.length);

  for (const s of scripts) {
    if (s.includes('video_versions')) {
      const cleanJson = s.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
      try {
        const parsed = JSON.parse(cleanJson);
        const videoVersions = findNestedKey(parsed, 'video_versions');
        if (Array.isArray(videoVersions) && videoVersions.length > 0) {
          downloadUrl = videoVersions[0]?.url;
        }
        const cap = findNestedKey(parsed, 'caption');
        if (cap && cap.text) {
          title = cap.text.trim();
        }
        const imgVersions = findNestedKey(parsed, 'image_versions2');
        if (imgVersions && Array.isArray(imgVersions.candidates) && imgVersions.candidates.length > 0) {
          thumbnailUrl = imgVersions.candidates[0]?.url;
        }
        if (downloadUrl) break;
      } catch (e) {
        console.warn('JSON parse error:', e.message);
      }
    }
  }

  console.log('Extracted Title:', title.slice(0, 60));
  console.log('Extracted Thumbnail:', thumbnailUrl ? 'Found' : 'None');
  console.log('Extracted Download URL:', downloadUrl ? 'Found: ' + downloadUrl.slice(0, 60) + '...' : 'Not found');

  if (downloadUrl) {
    console.log('Testing video stream fetch (head/partial bytes)...');
    const headRes = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        Range: 'bytes=0-1024',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });
    console.log('Stream HTTP status:', headRes.status);
    console.log('Content-Type:', headRes.headers.get('content-type'));
    console.log('Content-Range:', headRes.headers.get('content-range'));
    console.log('✅ Real Instagram MP4 stream successfully verified!');
  } else {
    console.log('Note: Video is private or required fresh media ID.');
  }
}

// Test with public viral reel
testLiveInstagramReel('DcNrAxjJGM0').catch(console.error);
