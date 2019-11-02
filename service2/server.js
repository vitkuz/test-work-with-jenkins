const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

const PORT = 4000;

app.listen(PORT, async () => {

  const registerService = () => axios.put(`http://localhost:3000/service/register/${'sevice2'}/${'0.0.0'}/${PORT}`);
  const deregisterService = () => axios.delete(`http://localhost:3000/service/register/${'sevice2'}/${'0.0.0'}/${PORT}`);

  const response = await registerService();
  const timeout = response && response.data && response.data.timeout;

  const interval = setInterval(registerService, timeout || 30000);
  const cleanup = () => {
    clearInterval(interval);
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

  console.log(`Service1 is running on ${PORT}. Process pid: ${process.pid}`)
});
