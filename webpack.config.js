const fs = require('fs');

const website_builder = require('./src/main.js');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

let {build_website} = require('prehtml-loader/webpack_helper.js');



module.exports = (_, {mode}) => {


	let is_production = mode === 'production';
	let path_suffix = is_production ? 'prod' : 'dev';

	// pre-clean
	if( fs.existsSync(`${__dirname}/dist/${path_suffix}`) )
		fs.rmdirSync(`${__dirname}/dist/${path_suffix}`, { recursive: true });

	if( fs.existsSync(`${__dirname}/out`) )
		fs.rmdirSync(`${__dirname}/out`, { recursive: true });

	let website = website_builder(is_production, path_suffix);

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

	let js_config = (dst_path, src, html_targets) => {

		let css_purge = {

			loader: '@americanexpress/purgecss-loader',
            options: { paths: html_targets }
		};

		css_purge = {

			loader: '@fullhuman/purgecss-loader',
			options: { content: html_targets }
		}

		return {
			module: {
				rules: [{
					test: /\.css$/,
					use: is_production ? ['style-loader', 'css-loader', css_purge] : ['style-loader', 'css-loader']
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


	let webpack_plugins = [
		new CopyWebpackPlugin({patterns: [
			{ from: 'assets', to: `dist/${path_suffix}/__assets` },
			{ from: 'src/template/img', to: `dist/${path_suffix}/__templates/__default/img` }
		]})
	];

	// post-clean
	if( is_production )
		webpack_plugins.push( new RemovePlugin({
			after: {
				test: [{
	                folder: `dist/${path_suffix}/`,
	                method: (path) => path.endsWith('/bundle.js.LICENSE.txt'),
	                recursive: true
	            }]
			}
		}));

	return build_website(website, html_config, js_config, webpack_plugins);
};