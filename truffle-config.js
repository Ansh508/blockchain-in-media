module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default)
      port: 7545,        // Ganache's default port
      network_id: "*",   // Any network (to match Ganache)
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",  // Your Solidity version
    },
  },
};
