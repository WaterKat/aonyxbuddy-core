const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: 'production',
  target: 'web',

  entry: "./src/index.ts",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
  },

  module: {
    "rules": [
      {
        "test": /\.([cm]?ts|tsx)$/,
        "exclude": /node_modules/,
        "use": {
          "loader": "ts-loader",
          "options": {
            "projectReferences": true
          }
        }
      }
    ]
  },

  resolve: {
    extensions: [".tsx", ".ts", ".mjs", ".js"]
  },

  plugins: [
    new webpack.NormalModuleReplacementPlugin(/.*/, function (resource) {
      const lowerCaseRequest = resource.request.toLowerCase();

      if (
        !lowerCaseRequest.includes("node_modules") &&
        lowerCaseRequest.endsWith(".js") &&
        lowerCaseRequest[0] === "." &&
        resource.context.startsWith(path.resolve(__dirname)) &&
        !resource.context.toLowerCase().includes("node_modules")
      ) {
        resource.request = resource.request.substr(0, resource.request.length - 3) + ".ts";
        resource.request
      }
    })]
};
