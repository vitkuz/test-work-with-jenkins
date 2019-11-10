const axios = require('axios');
const services = require('./services');

async function getArticles() {
  const { ipV4, port } = await services('users', '1.x.x');

  const response = await axios.get(`http://${ipV4}:${port}/articles`);
  return response.data;
}

module.exports = {
  getArticles
};
