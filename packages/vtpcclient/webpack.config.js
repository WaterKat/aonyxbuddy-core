const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      "url": require.resolve("url/")
    },
    alias: {
      '@aonyxbuddy/streamevents': path.resolve(__dirname, '../streamevents'),
      '@aonyxbuddy/subscriptions': path.resolve(__dirname, '../subscriptions'),
      '@aonyxbuddy/tools': path.resolve(__dirname, '../tools'),
      '@aonyxbuddy/websockets': path.resolve(__dirname, '../websockets')
    }
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
};
