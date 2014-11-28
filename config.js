var config = {
  port: 8000,
  secret: 'k3yb0ardca7m3ow',
  redisHost: 'localhost',
  redisPort: 6379,
  routes: {
    login: '/login',
    logout: '/logout'
  }
};

module.exports = config;