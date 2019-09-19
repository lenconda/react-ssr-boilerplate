const env = process.env.NODE_ENV || 'development';
const isProduction = env.toLowerCase() === 'production';
const isDev = env.toLowerCase() === 'development';
const isTest = env.toLowerCase() === 'test';

exports = module.exports = {
  env: env,
  isProduction,
  isDev,
  isTest
};
