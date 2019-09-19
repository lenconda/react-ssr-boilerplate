const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackBaseConfig = require('./webpack.base');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(webpackBaseConfig, {
  output: {
    publicPath: '/',
    filename: 'static/js/[name]-routes.js',
    chunkFilename: 'static/js/[name].chunk.js'
  },

  devServer: {
    port: 8080,
    hot: true,
    inline: true
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
      chunkFilename: 'static/css/[id].css'
    })
  ]
});
