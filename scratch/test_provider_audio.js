const { InstagramProvider } = require('../src/services/providers/InstagramProvider');

async function testProvider() {
  const provider = new InstagramProvider();
  console.log('Testing InstagramProvider.resolveMedia with real reel...');
  const res = await provider.resolveMedia('https://www.instagram.com/reel/DcNrAxjJGM0/');
  console.log('Title:', res.title);
  console.log('Can download directly:', res.canDownloadDirectly);
  console.log('Qualities count:', res.qualities?.length);
  for (const q of res.qualities || []) {
    console.log(`- [${q.id}] ${q.label} (${q.sublabel}, format: ${q.format}, audioOnly: ${!!q.isAudioOnly})`);
    console.log(`  URL: ${q.url.slice(0, 75)}...`);
  }

  const audioQuality = res.qualities?.find(q => q.id === 'audio');
  const videoQuality = res.qualities?.find(q => q.id === 'hd');

  if (!audioQuality || !videoQuality) {
    throw new Error('Missing audio or video quality!');
  }

  if (audioQuality.url === videoQuality.url) {
    console.error('❌ Audio URL is identical to Video URL!');
    process.exit(1);
  } else {
    console.log('✅ Success: Audio URL is a distinct dedicated audio stream!');
  }

  if (audioQuality.format !== 'm4a') {
    console.error(`❌ Unexpected audio format: ${audioQuality.format}`);
    process.exit(1);
  } else {
    console.log('✅ Success: Audio format is correctly configured as m4a!');
  }
}

testProvider().catch(err => {
  console.error(err);
  process.exit(1);
});
