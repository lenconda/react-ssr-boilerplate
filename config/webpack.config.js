const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const env = require('./env');
const cssLoaders = require('./css_loaders');
const LoadablePlugin = require('@loadable/webpack-plugin');
const portsConfig = require('./ports.config');

function getEntries(searchPath, root) {
  const files = glob.sync(searchPath);

  const entries = files.map((value, index) => {
    const relativePath = path.relative(root, value);
    return {
      name: value.split('/')[value.split('/').length - 2],
      path: path.resolve('./', value),
      route: relativePath.split('/').filter((value, index) => value !== 'index.tsx').join('/')
    };
  });

  return entries;
}

const entries = getEntries(
  path.join(__dirname, '../src/client/pages/**/index.tsx'),
  path.join(__dirname, '../src/client/pages')
);

const plugins = [
  new MiniCssExtractPlugin({
    filename: 'static/css/' + (env.isDev ? '[name].css' : '[name].[contenthash].css'),
    chunkFilename: 'static/css/' + (env.isDev ? '[id].css' : '[id].[contenthash].css')
  }),

  new TerserWebpackPlugin(),

  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../src/client/public'),
      to: path.resolve(__dirname, '../dist/assets/public')
    }
  ]),

  new CleanWebpackPlugin()
];

module.exports = {
  entry: {
    'app__root': [path.join(__dirname, '../src/client/index.tsx')],
    ...Object.assign(...entries.map((value, index) => {
      const entryObject = {};
      entryObject[value.route.split('/').join('_')] = [value.path];
      return entryObject;
    }))
  },

  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'static/js/' + (env.isDev ? '[name]-routes.js' : '[name]-routes.[contenthash].js'),
    chunkFilename: 'static/js/' + (env.isDev ? '[name].chunk.js' : '[name].[contenthash].chunk.js'),
    publicPath: '/'
  },

  devServer: {
    port: portsConfig.port.bundle,
    hot: true,
    inline: true
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

  plugins: env.isProduction
    ? [
      ...plugins,

      new LoadablePlugin({
        filename: 'manifest.json',
      })
    ]
    : [...plugins]
};
