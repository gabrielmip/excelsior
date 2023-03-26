// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

module.exports = {
  mount: {
    src: "/",
    public: "/",
  },
  plugins: [
    /* ... */
    "@snowpack/plugin-svelte",
    "@snowpack/plugin-dotenv",
    "@snowpack/plugin-typescript",
  ],
  optimize: {
    bundle: true,
    minify: true,
    target: "es2017",
  },
};
