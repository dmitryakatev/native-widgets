'use strict';

var DEVELOPMENT = 'development';
var PRODUCTION = 'production';

var webpack = require('webpack');
var path = require('path');

var CleanWebpackPlugin = require('clean-webpack-plugin');
var { CheckerPlugin } = require('awesome-typescript-loader');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");

var convertPathsToAliases = require("convert-tsconfig-paths-to-webpack-aliases").default;
var tsconfig = require("./tsconfig.json");

module.exports = (env) => ({
	mode: env.NODE_ENV,

	entry: {
		app: path.resolve(__dirname, './src/index.ts'),
	},
	output: {
		filename: './native-widgets.js',
		path: path.resolve(__dirname, './dist')
	},

	watch: env.NODE_ENV !== PRODUCTION,
	devtool: env.NODE_ENV === PRODUCTION ? false : 'source-map',

	resolve: {
		extensions: ['.ts', '.js'],
		alias: convertPathsToAliases(tsconfig),
	},

	module: {
		rules: [{
			test: /\.ts$/,
			loaders: ['awesome-typescript-loader']
		}, {
			test: /\.ts$/,
			enforce: 'pre',
			loader: 'tslint-loader',
			options: { }
		}, {
			test: /\.html$/,
			use: {
				loader: 'html-loader?interpolate'
			}
		}, {
			test: /\.(scss)$/,
			use: [{
				loader: MiniCssExtractPlugin.loader,
				options: {
					publicPath: './../'
				}
			}, {
				loader: 'css-loader'
			}, {
				loader: 'postcss-loader'
			}, {
				loader: 'sass-loader'
			}]
		}/*, {
			test: /\.(jpg|jpeg|gif|png|svg)$/,
			// exclude: /node_modules/,
			use: [{
				loader: 'file-loader',
				query: {
					name: 'img/[name].[hash].[ext]',
					limit: 100000
				}
			}]
		}*/]
	},

	plugins: [
		new CleanWebpackPlugin(['./dist']),
		new CheckerPlugin(),
		new MiniCssExtractPlugin({
			filename: './native-widgets.css'
		})
	]
});
