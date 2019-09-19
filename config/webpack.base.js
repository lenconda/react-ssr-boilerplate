const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const cssLoaders = require('./css_loaders');
const utils = require('./utils');

const entries = utils.getEntries(
  path.join(__dirname, '../src/client/pages/**/index.tsx'),
  path.join(__dirname, '../src/client/pages')
);

module.exports = {
  mode: 'none',

  entry: {
    'app__root': [path.join(__dirname, '../src/client/index.tsx')],
    ...Object.assign(...entries.map((entry, index) => {
      const entryObject = {};
      entryObject[entry.route.split('/').join('_')] = [entry.path];
      return entryObject;
    }))
  },

  output: {
    path: path.join(__dirname, '../dist')
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          name: 'app__common',
          chunks: 'all',
          minSize: 20,
          minChunks: 2
        }
      }
    },
    minimizer: [new UglifyJsPlugin()],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx']
  },

  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(ts|js|tsx|jsx)?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            },
          },
          {
            test: /\.(ts|js|tsx|jsx)?$/,
            exclude: /node_modules/,
            loader: require.resolve('babel-loader'),
            options: {
              customize: require.resolve('babel-preset-react-app/webpack-overrides'),
              cacheDirectory: true,
              cacheCompression: true,
              compact: true,
            }
          },
        ]
      },
      cssLoaders,
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },

  plugins: [
    new TerserWebpackPlugin(),
    new CleanWebpackPlugin()
  ]
};
