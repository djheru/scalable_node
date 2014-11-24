var config = {
  port: 8000,
  secret: 'k3yb0ardca7m3ow',
  redisUrl: 'redis://localhost',
  routes: {
    login: '/login',
    logout: '/logout'
  }
};

module.exports = config;