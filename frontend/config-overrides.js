module.exports = function override(config) {
  config.resolve.fallback = {
    url: false,
    http: false,
    https: false,
    crypto: false,
    stream: false,
    assert: false,
    os: false,
    buffer: false,
  };

  return config;
};