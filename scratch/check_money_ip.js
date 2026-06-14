import dns from 'dns';

dns.resolve4('istanbulescort.blog', (err, addresses) => {
  if (err) {
    console.error('Failed to resolve istanbulescort.blog:', err);
  } else {
    console.log('IP addresses for istanbulescort.blog:', addresses);
  }
});
