var path = require('path');
var React = require('react');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var friendlyFormatter = require('eslint-friendly-formatter');
var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true', './src/js/render.js', './src/index.html'
  ],
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'app.js',
    publicPath: 'http://localhost:3002/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'react-hot'
      }, {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['react', 'es2015']
        }
      }, {
        test: /\.(jpg|png)$/,
        loader: 'url?limit=25000'
      }, {
        test: /\.css$/,
        loader: 'style!css'
      }, {
        test: /\.scss$/,
        loader: 'style!css!postcss!sass'
      }, {
        test: /\.html$/,
        loader: "html-loader"
      }, {
        test: /\.svg$/,
        loader: 'svg-inline'
      }
    ]
  },
  postcss: function() {
    return [autoprefixer({browsers: ['last 3 versions']})];
  },
  eslint: {
    formatter: friendlyFormatter
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({title: 'Good Gaming', template: './src/index.html', scriptFilename: 'app.js'})
  ],
  target: 'web'
};
