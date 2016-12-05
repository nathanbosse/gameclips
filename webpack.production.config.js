var path = require('path');
var React = require('react');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var friendlyFormatter = require('eslint-friendly-formatter');
var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/js/render.js', './src/index.html'
  ],
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'app.js'
  },
  module: {
    loaders: [

      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015', 'react']
        }

      }, {
        test: /\.(jpg|png)$/,
        loader: 'url?limit=25000'
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
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({title: 'Good Gaming', template: './src/index.html', scriptFilename: 'app.js'}),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      minimize: true,
      compress: {
        warnings: false
      }
    })
  ],
  target: 'web'
};
