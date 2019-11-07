const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

const SERVICE_DISCOVERY_URL = 'http://container-lb-1082559559.us-east-1.elb.amazonaws.com';
const SERVICE_NAME = 'users';
const SERVICE_VERSION = '1.0.0';
const PORT = 5000;

app.listen(PORT, async () => {
  let interval;

  const registerUrl = `${SERVICE_DISCOVERY_URL}/service/register/${SERVICE_NAME}/${SERVICE_VERSION}/${PORT}`;
  const deregisterUrl = `${SERVICE_DISCOVERY_URL}/service/register/${SERVICE_NAME}/${SERVICE_VERSION}/${PORT}`;

  const registerService = () => axios.put(registerUrl);
  const deregisterService = () => axios.delete(deregisterUrl);

  registerService()
    .then((response) => {
      const timeToMakeRequest = response && response.data && response.data.timeout;
      interval = setInterval(registerService, timeToMakeRequest / 3);
    })
    .catch(error => {
      console.log(`Unable to register service on ${registerUrl}`, error);
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
      console.error(reason, 'Unhandled Rejection at Promise', p);
      cleanup();
      process.exit(1);
    })
    .on('uncaughtException', (error) => {
      console.log(error);
      cleanup();
      process.exit(1);
    });

  console.log(`Service is running on ${PORT}. Process pid: ${process.pid}`)
});


