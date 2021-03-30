const CopyWebpackPlugin = require('copy-webpack-plugin');

var path = require('path');

let website = require('./src/main.js');

let {build_website} = require('prehtml-loader/webpack_helper.js');

let html_config = (dst_path, src) => {

	return {
		module: {
			rules: [{
				enforce: 'post',
				test: /\.html$/,
				use: {
					loader: 'file-loader',
					options: {
						outputPath: './../', // required
						name: dst_path
					}
				}
			},{
				test: /\.html$/,
				use: ['prehtml-loader'],
			}
		]},
		entry: { 
			main: src
		},
		output: {
			path: path.resolve(__dirname, 'out'),
			publicPath: '',
			filename: `${dst_path}.junk`,
			//clean: true
		}
	};
};

let js_config = (dst_path, src) => {

	return {
		module: {
			rules: [{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}, {
				test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
				loader: 'url-loader'
			}
			]
		},
		entry: {
			main: src
		},
		output: {
			path: path.resolve(__dirname),
			publicPath: '',
			filename: dst_path,
			//clean: true
		}
	};
};


let config = build_website(website, html_config, js_config);

let lconfig = config[config.length-1];
lconfig.plugins = lconfig.plugins ?? [];

lconfig.plugins.push( new CopyWebpackPlugin({patterns: [
												{ from: 'assets', to: 'dist/__assets' },
												{ from: 'src/template/img', to: 'dist/__templates/__default/img' }
											]} ));

module.exports = config;