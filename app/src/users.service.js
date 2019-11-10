const axios = require('axios');
const services = require('./services');

async function getUsers() {
  const { ipV4, port } = await services('users');

  const response = await axios.get(`http://${ipV4}:${port}/users`);

  return response.data;
}

module.exports = {
  getUsers
};
