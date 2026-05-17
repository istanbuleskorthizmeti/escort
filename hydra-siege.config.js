module.exports = {
  apps: [
    {
      name: 'hydra-siege-engine',
      script: 'siege-runner.js',
      autorestart: true,
      restart_delay: 15000,
      error_file: 'logs/siege-error.log',
      out_file: 'logs/siege-out.log',
    },
  ],
};






