const express = require('express');
const cors = require('cors');

const ServiceDiscovery = require('./service-discovery');
const config = require('./config');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Ok',
    config
  });
});

app.get('/services', (req, res) => {

  const result = ServiceDiscovery.all();

  res.status(200).json(result);
});

app.get('/service/find/:name/:version', (req, res) => {
  const {name, version} = req.params;

  const result = ServiceDiscovery.get({name: name.toLowerCase().trim(), version});

  res.status(200).json(result);
});

app.delete('/service/register/:name/:version/:port', (req, res) => {
  const {name, version, port} = req.params;

  let ipV6 = null;
  let ipV4 = null;

  if (isIpV6) {
    ipV6 = `[${req.connection.remoteAddress}]`;
    ipV4 = req.connection.remoteAddress.replace('::ffff:', '');
  } else {
    ipV4 = req.connection.remoteAddress;
  }

  const ip = {
    ipV6,
    ipV4
  };

  const result = ServiceDiscovery.deregister({ip, name: name.toLowerCase().trim(), version, port});

  res.status(200).json(result);
});

app.put('/service/register/:name/:version/:port', (req, res) => {
  const {name, version, port} = req.params;
  let ipV6 = null;
  let ipV4 = null;

  const isIpV6 = req.connection.remoteAddress.includes('::');

  if (isIpV6) {
    ipV6 = `[${req.connection.remoteAddress}]`;
    ipV4 = req.connection.remoteAddress.replace('::ffff:', '');
  } else {
    ipV4 = req.connection.remoteAddress;
  }

  const ip = {
    ipV6,
    ipV4
  };

  const result = ServiceDiscovery.register({ip, name: name.toLowerCase().trim(), version, port});

  res.status(200).json(result);
});

app.get('*', (req, res) => {
  res.status(404).json({
    message: 'Page not found'
  });
});

app.listen(config.PORT, () => console.log(`Service discovery listens on port ${config.PORT}. Process pid: ${process.pid}.
  Config file: 
    NAME: ${config.NAME}
    PORT: ${config.PORT}
    NODE_ENV: ${config.NODE_ENV}
    MONGO_DB_URL: ${config.MONGO_DB_URL}
    SECRET: ${config.SECRET}
`));

process
  .on('SIGINT', () => {
    console.log('Close with SIGINT');
    process.exit(0);
  })
  .on('SIGTERM', () => {
    console.log('Close with SIGTERM');
    process.exit(0);
  })
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
    process.exit(1);
  })
  .on('uncaughtException', (error) => {
    console.log(`uncaughtException`, error);
    process.exit(1);
  });
