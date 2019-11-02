const semver = require('semver');
const services = {};
const timeout = 30000;

function register(ops) {
  const { name, ip, version, port } = ops;
  const key = `${name}-${version}-${ip}-${port}`;

  if (!services[key]) {
    services[key] = {
      ...ops,
      createdAt: Date.now()
    };
    console.log(`Service register successfully`, key);
    return { key, service: services[key] };
  }

  console.log(`Service updated successfully`, key);
  services[key] = {
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

  const candidates = Object.values(services).filter((service) => service.name === name && semver.satisfies(service.version, version));

  const randomIndex = Math.floor(Math.random() * candidates.length);

  return candidates[randomIndex]
}

function log() {
  console.log(services);
}

module.exports = {
  register,
  deregister,
  get,
  log,
};
