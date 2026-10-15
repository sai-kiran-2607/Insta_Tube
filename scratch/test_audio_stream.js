async function testAudioStream() {
  const url = 'https://instagram.fhyd2-2.fna.fbcdn.net/o1/v/t2/f2/m78/AQNLAyip24BvSvpfbxGtzNwWPbp3CbrKS6Lg0lUQmFiSxu9geTiyVVs0HAn84RHkW7svnPqccp6fB7Hty9bmHpdJKcyKIPOHs1lwlhg.mp4?_nc_cat=109&_nc_oc=AdpjPKVp_5d4MANh7qJT6IoUmCJamEKLs5DbjYGshJHQ9OnTQGZ7byy5HTb1WmgeEs4&_nc_sid=9ca052&_nc_ht=instagram.fhyd2-2.fna.fbcdn.net&_nc_ohc=iWqSv4b6-oAQ7kNvwE_6EXF&efg=eyJ2ZW5jb2RlX3RhZyI6ImlnLXhwdmRzLmNsaXBzLmlnd3d3LUMzLmRhc2hfbG5faGVhYWNfdmJyM19hdWRpbyIsInZpZGVvX2lkIjpudWxsLCJvaWxfdXJsZ2VuX2FwcF9pZCI6OTM2NjE5NzQzMzkyNDU5LCJjbGllbnRfbmFtZSI6ImlnIiwieHB2X2Fzc2V0X2lkIjoxNzU5NjEyNzg4NTkzMzA0LCJhc3NldF9hZ2VfZGF5cyI6NTYsInZpX3VzZWNhc2VfaWQiOjEwMDk5LCJkdXJhdGlvbl9zIjoxMCwiYml0cmF0ZSI6NzQ4MTgsInVybGdlbl9zb3VyY2UiOiJ3d3cifQ%3D%3D&ccb=17-1&_nc_gid=TBaMJdGwd8_XssXprTpl2g&_nc_ss=7c689&_nc_map=urlgen_bucketless&_nc_zt=28&oh=00_AQNRyfRRnlDRGLX9UsH5AnviUbmy2jCTFgpL8AI1JzWzeQ&oe=6AD2580E';

  const res = await fetch(url, {
    headers: {
      Range: 'bytes=0-1024',
      'User-Agent': 'Mozilla/5.0',
    },
  });

  console.log('Audio stream status:', res.status);
  console.log('Content-Type:', res.headers.get('content-type'));
  console.log('Content-Length:', res.headers.get('content-length'));
  console.log('Content-Range:', res.headers.get('content-range'));
}

testAudioStream().catch(console.error);
