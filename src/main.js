let {list_html_index_files} = require('prehtml-loader/webpack_helper.js');


module.exports = function(is_production, path_suffix) {

	let pages = {
		"": { __src: './src/homepage', __template_args: {title: 'Home'} } // homepage
	};

	for(let [page_name, page_path] of [... list_html_index_files('./src/pages') ] )
		pages[page_name] = { __src: page_path, __template_args: {title: page_name.slice(1) } };


	let base_url = is_production ? 'https://keystroke.fr'
								 : `file://${__dirname}/../dist/${path_suffix}/`;


	return {

		templates_input_dir: `${__dirname}/`,
		templates_output_dir: `./dist/${path_suffix}/__templates/`, // optionnal
		templates: {
			__default:{ __src: 'template', __args: { base_url: base_url } }
		},

		pages_output_dir: `./dist/${path_suffix}/`, // optionnal
		pages
	};
}