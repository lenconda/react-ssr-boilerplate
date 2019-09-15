const axios = require('axios');

axios.defaults.baseURL = '';
axios.defaults.timeout = 3600000;
axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.data.message) { console.log(error.response.data.message) }
});

exports = module.exports = axios;
