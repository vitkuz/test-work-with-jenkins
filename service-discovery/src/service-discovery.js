const semver = require('semver');
let services = {};
const timeout = 30000;

function register(ops) {
  cleanUp();
  const { name, ip, version, port } = ops;
  const key = `${name}-${version}-${ip}-${port}`;

  if (!services[key]) {
    services[key] = {
      key,
      ...ops,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    console.log(`Service register successfully`, key);
    return { key, service: services[key], timeout };
  }

  console.log(`Service updated successfully`, key);
  services[key] = {
    key,
    ...services[key],
    ...ops,
    updatedAt: Date.now()
  };
  return { key, service: services[key], timeout };
}

function deregister(ops) {
  const { name, ip, version, port } = ops;
  const key = `${name}-${version}-${ip}-${port}`;

  if (services[key]) {
    const deletedService = services[key];
    delete services[key];
    console.log(`Service was deregister successfully `, key);
    return { key, service: deletedService, timeout };
  }

  console.log(`Cant deregister service. Service is unknown`, key);
  return null;
}

function get({name, version}) {
  cleanUp();
  let candidates = Object.values(services);

  candidates = candidates.filter((service) => {
    if (service.name === name) {
      return semver.satisfies(service.version, version);
    }
  });

  const randomIndex = Math.floor(Math.random() * candidates.length);

  return candidates[randomIndex]
}

function all() {
  return services;
}

function cleanUp() {
  const currentTime = Date.now();

  let candidates = Object.values(services);

  const stillValid = candidates.filter((service) => {
    const serviceExpirationTime = service.updatedAt + timeout;
    return currentTime < serviceExpirationTime;
  });

  services = stillValid.reduce((acc, service) => {
    return {
      ...acc,
      [service.key]: service
    }
  }, {});
}

module.exports = {
  register,
  deregister,
  get,
  all,
};
