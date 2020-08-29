const path = require('path');
const sveltePreprocess = require('svelte-preprocess');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';
const dev = !prod;

module.exports = {
  entry: {
    bundle: ['./src/main.ts'],
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte'),
    },
    extensions: ['.mjs', '.js', '.svelte', '.ts'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  output: {
    path: __dirname + '/public',
    filename: '[name].js',
    chunkFilename: '[name].[id].js',
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader-hot',
          options: {
            dev,
            hotReload: true,
            preprocess: sveltePreprocess({}),
            hotOptions: {
              noPreserveState: false, // let variables too or only public props
              optimistic: true,
            },
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          prod ? MiniCssExtractPlugin.loader : 'style-loader', // no HMR in MiniCssExtractPlugin
          'css-loader',
        ],
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  devtool: prod ? false : 'source-map',
  devServer: {
    contentBase: 'public',
    hot: true,
    overlay: true,
    stats: {
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
    },
  },
};
