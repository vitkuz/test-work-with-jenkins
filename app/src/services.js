const axios = require('axios');
const config = require('./config');

function services(name, version ='1.x.x') {

  if (!name) {
    console.log(`ERROR: no name`);
    return;
  }

  const url = `${config.SERVICE_DISCOVERY_URL}/service/find/${name}/${version}`;

  console.log(url);

  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        console.log(response);

        const { data } = response;

        const { ip: { ipV4, ipV6 }, port } = data;

        resolve({
          ipV6,
          ipV4,
          port
        });

      })
      .catch(error => {
        console.log(error);
        reject(error);
      })
  });
}

module.exports = services;

