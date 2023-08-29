const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  target: "node", // <- NOT "web"
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@aonyxbuddy': path.resolve(__dirname, '../../libraries')
      // Add other aliases as needed
    },
    plugins: [new TsconfigPathsPlugin({ configFile: 'tsconfig.json' })],
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify"),
      "url": require.resolve("url"),
      "buffer": require.resolve("buffer/"),
      "util": require.resolve("util/"),
      "path": require.resolve("path-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "querystring": require.resolve("querystring-es3"),
      "fs": require.resolve('browserify-fs'),
      "async_hook" : false,
      "net" : false,
      //      "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
    }
  },
  output: {
    filename: 'bundle.cjs',
    globalObject: `typeof self !== 'undefined' ? self : this`,
    path: path.resolve(__dirname, 'dist'),
  }
};