/**
 * This file handles the renderer part of the electron app
 */

import * as CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

const __DEV__ = process.env.NODE_ENV !== 'production';

const srcPath = path.resolve(__dirname, './#');
const distPath = path.resolve(__dirname, './dist');

const mainFile = ['./index.tsx'];

const config: webpack.Configuration = {
  mode: __DEV__ ? 'development' : 'production',
  target: 'electron-renderer',
  context: srcPath,
  entry: {
    main: mainFile,
  },
  devtool: 'cheap-module-source-map',
  output: {
    path: distPath,
    chunkFilename: 'chunk.[name].[chunkhash].js',
    filename: 'bundle.[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        loader: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              module: 'esnext',
            },
          },
        ],
      },
      {
        test: /\.svg?/,
        loader: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    modules: ['node_modules', './'],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  devServer: {
    port: 7979,
    stats: 'errors-only',
  },
};

module.exports = config;
