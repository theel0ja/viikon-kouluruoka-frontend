/* tslint:disable */
/* eslint-disable */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const SRC_FOLDER = path.resolve(__dirname, "client-src");
const DIST_FOLDER = path.resolve(__dirname, "client-dist");
const NODE_MODULES_FOLDER = path.resolve(__dirname, "node_modules");

// const devMode = process.env.NODE_ENV !== 'production';
const devMode = false;

module.exports = {
  entry: {
    filename: SRC_FOLDER + "/index.ts"
  },

  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "bundle.css",
      // chunkFilename: "[id].css"
    })
  ],

  module: {
    rules: [
      // ts-loader: convert typescript (es6) to javascript (es6),
      // babel-loader: converts javascript (es6) to javascript (es5)
      {
        test: /\.tsx?$/,
        loaders: ["babel-loader?presets[]=babel-preset-env", "ts-loader"],
        exclude: [/node_modules/, NODE_MODULES_FOLDER]
      },
      // babel-loader for pure javascript (es6) => javascript (es5)
      {
        test: /\.(jsx?)$/,
        loaders: ["babel"],
        exclude: [/node_modules/, NODE_MODULES_FOLDER]
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },

  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ]
  },

  /*
  devServer: {
    contentBase: [PUBLIC_FOLDER, DIST_FOLDER],
    compress: true,
    port: 9000,
    open: true
  },
  */

  output: {
    filename: "bundle.js",
    path: DIST_FOLDER
  }
};
