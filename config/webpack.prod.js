const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const webpackBaseConfig = require('./webpack.base');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(webpackBaseConfig, {
  output: {
    publicPath: '/',
    filename: 'static/js/[name]-routes.[contenthash].js',
    chunkFilename: 'static/js/[name].[contenthash].chunk.js'
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      chunkFilename: 'static/css/[id].[contenthash].css'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/client/public'),
        to: path.resolve(__dirname, '../dist/assets/public')
      }
    ]),
    new LoadablePlugin({
      filename: 'manifest.json',
    })
  ]
});
