const dotenv = require('dotenv');

const result = dotenv.config();

if (result.error) {
  console.log(`Cant find .env file`);
  console.error(result.error);
}

console.log(result.parsed);

const sharedConfig = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_DB_URL: 'mongodb_URL',
  SECRET: process.env.MONGO_DB_URL ||'<not set>'
};

const config = {
  development: {
    NAME: 'Development',
    ...sharedConfig
  },
  production: {
    NAME: 'Production',
    ...sharedConfig
  }
};

function get(env) {

  const settings = config[env];

  if (!settings) {
    console.error(`Cant get settings for NODE_ENV`);
    return {};
  }

  return settings;
}

module.exports = get((process.env.NODE_ENV ||'development'));


