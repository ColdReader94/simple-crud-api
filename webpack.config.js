const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = () => ({
  entry: './app.js',
  target: 'node',
  mode: 'production',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext]',
  },
  module: {
  },
  plugins: [
    new ESLintPlugin({ fix: true, extensions: ['js'] }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
  ],
  resolve: {
    extensions: ['.js'],
  },
});