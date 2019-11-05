const express = require('express');
const cors = require('cors');

const ServiceDiscovery = require('./service-discovery');

const app = express();

app.use(cors());

app.get('/services', (req, res) => {

  const result = ServiceDiscovery.log();

  res.status(200).json(result);
});

app.get('/service/find/:name/:version', (req, res) => {
    const { name, version } = req.params;

    const result = ServiceDiscovery.get({ name, version });

    res.status(200).json(result);
});

app.delete('/service/register/:name/:version/:port', (req, res) => {
    const { name, version, port } = req.params;

    const ip = req.connection.remoteAddress.includes('::') ?  `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

    const result = ServiceDiscovery.deregister({ ip, name, version, port });

    res.status(200).json(result);
});

app.put('/service/register/:name/:version/:port', (req, res) => {
    const { name, version, port } = req.params;

    const ip = req.connection.remoteAddress.includes('::') ?  `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

    const result = ServiceDiscovery.register({ ip, name, version, port });

    res.status(200).json(result);
});

const PORT = process.env.PORT || 3000;

app.listen(3000, () => console.log(`Service discovery listens on port ${PORT}. Proccess pid: ${process.pid}`));

process
  .on('SIGINT', () => {
    console.log('Close with SIGINT');
    cleanup();
    process.exit(0);
  })
  .on('SIGTERM', () => {
    console.log('Close with SIGTERM');
    cleanup();
    process.exit(0);
  })
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
    cleanup();
    process.exit(1);
  })
  .on('uncaughtException', (error) => {
    console.log(`uncaughtException`,error);
    cleanup();
    process.exit(1);
  });
