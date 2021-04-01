const fs = require('fs');

const website_builder = require('./src/main.js');

const CopyWebpackPlugin = require('copy-webpack-plugin');

let {build_website} = require('prehtml-loader/webpack_helper.js');



module.exports = (_, {mode}) => {


	let is_production = mode === 'production';

	let path_suffix = is_production ? 'prod' : 'dev';

	let website = website_builder(is_production, path_suffix);

	if( fs.existsSync(`${__dirname}/dist/${path_suffix}`) )
		fs.rmdirSync(`${__dirname}/dist/${path_suffix}`, { recursive: true });

	if( fs.existsSync(`${__dirname}/out`) )
		fs.rmdirSync(`${__dirname}/out`, { recursive: true });

	let html_config = (dst_path, src) => {

		return {
			module: {
				rules: [{
					enforce: 'post',
					test: /\.html$/,
					use: {
						loader: 'file-loader',
						options: { name: dst_path }
					}
				},{
					test: /\.html$/,
					use: is_production ? ['html-minifier-loader', 'prehtml-loader'] : ['prehtml-loader'],
				}
			]},
			entry: { 
				main: src
			},
			output: {
				path: __dirname,
				publicPath: '',
				filename: `./out/${dst_path}.junk`
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
				path: __dirname,
				publicPath: '',
				filename: `${dst_path}`,
			}
		};
	};


	let config = build_website(website, html_config, js_config);

	let lconfig = config[config.length-1];
	lconfig.plugins = lconfig.plugins ?? [];

	lconfig.plugins.push( new CopyWebpackPlugin({patterns: [
													{ from: 'assets', to: `dist/${path_suffix}/__assets` },
													{ from: 'src/template/img', to: `dist/${path_suffix}/__templates/__default/img` }
												]} ));



	return config;

};