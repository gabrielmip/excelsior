// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

module.exports = {
  mount: {
    src: '/dist',
    public: '/',
  },
  plugins: [
    /* ... */
    '@snowpack/plugin-svelte', '@snowpack/plugin-dotenv', '@snowpack/plugin-typescript'
  ],
};