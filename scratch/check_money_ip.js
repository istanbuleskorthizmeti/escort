import dns from 'dns';

dns.resolve4('istanbulescdrkcn.com', (err, addresses) => {
  if (err) {
    console.error('Failed to resolve istanbulescdrkcn.com:', err);
  } else {
    console.log('IP addresses for istanbulescdrkcn.com:', addresses);
  }
});
