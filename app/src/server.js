const express = require('express');
const cors = require('cors');
const axios = require('axios');

const config = require('./config');
const services = require('./services');
const UserService = require('./users.service');
const ArticleService = require('./users.service');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({config})
});

app.get('/users', async (req, res) => {
  try {
    const result = await services('users');

    const response = await UserService.getUsers();

    res.status(200).json({
      users: 'Not implemented',
      result,
      response
    })
  }
  catch (e) {

    console.error(e);

    res.status(200).json({
      users: 'Not implemented',
      e
    })
  }




});

app.get('/articles', async (req, res) => {

  try {
    const result = await services('articles');

    const response = await ArticleService.getArticles();

    res.status(200).json({
      articles: 'Not implemented',
      result,
      response
    })
  }
  catch (e) {

    console.error(e);

    res.status(200).json({
      articles: 'Not implemented',
      e
    })
  }

});

app.listen(config.PORT, async () => {

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
      // cleanup();
      process.exit(1);
    })
    .on('uncaughtException', (error) => {
      // console.log(error);
      console.error('ERROR: uncaughtException');
      // cleanup();
      process.exit(1);
    });

  console.log(`App is running on ${config.PORT}. Process pid: ${process.pid}`)
});


