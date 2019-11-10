const express = require('express');
const cors = require('cors');
const axios = require('axios');

const config = require('./config');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.json(config)
});

app.get('/articles', () => {
  const articles = [
    {
      title: 'title 1',
      body: 'lorem',
    },
    {
      title: 'title 2',
      body: 'lorem',
    },
    {
      title: 'title 3',
      body: 'lorem',
    }
  ];

  res.json(articles)

});

app.listen(config.PORT, async () => {
  let interval;

  const registerUrl = `${config.SERVICE_DISCOVERY_URL}/service/register/${config.SERVICE_NAME}/${config.SERVICE_VERSION}/${config.PORT}`;
  const deregisterUrl = `${config.SERVICE_DISCOVERY_URL}/service/register/${config.SERVICE_NAME}/${config.SERVICE_VERSION}/${config.PORT}`;

  const registerService = () => axios.put(registerUrl);
  const deregisterService = () => axios.delete(deregisterUrl);

  registerService()
    .then((response) => {

      console.log(response.data);

      const timeToMakeRequest = response && response.data && response.data.timeout;
      interval = setInterval(registerService, timeToMakeRequest / 3);
    })
    .catch(error => {
      // console.log(`Unable to register service on ${registerUrl}`, error);
      console.error(`ERROR: Unable to register service on ${registerUrl}`);
    });

  const cleanup = () => {
    if (interval) {
      clearInterval(interval);
    }
    deregisterService();
  };


  process
    .on('SIGINT', () => {
      console.log('Close');
      cleanup();
      process.exit(0);
    })
    .on('SIGTERM', () => {
      console.log('Close');
      cleanup();
      process.exit(0);
    })
    .on('unhandledRejection', (reason, p) => {
      // console.error(reason, 'Unhandled Rejection at Promise', p);
      console.error('ERROR: Unhandled Rejection at Promise');
      cleanup();
      process.exit(1);
    })
    .on('uncaughtException', (error) => {
      // console.log(error);
      console.error('ERROR: uncaughtException');
      cleanup();
      process.exit(1);
    });

  console.log(`Service is running on ${config.PORT}. Process pid: ${process.pid}`)
});


