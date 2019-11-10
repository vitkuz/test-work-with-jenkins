const services = require('./services');

async function getUsers() {
  const { ipV4: ip, port } = await services('users', '1.x.x');

  const response = await axios.get(`http://${ip}:${port}/articles`);
  return response.data;
}

module.exports = {
  getUsers
};
