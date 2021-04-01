const fs = require('fs');


module.exports = function(is_production, path_suffix) {

	function* listPages(dir) {


		for(let file of fs.readdirSync(dir) ) {

			let path = `${dir}/${file}`;

			if( file === 'index.html' )
				yield path;
			if( fs.lstatSync(path).isDirectory() )
				yield * listPages(path);
		}

	}

	let pages = {
		"": { __src: './src/homepage', __template_args: {title: 'Home'} } // homepage
	};

	for(let page of [... listPages('./src/pages') ] ) {

		page = page.slice( 0, - '/index.html'.length );
		let pagename = page.slice( './src/pages/'.length );
		pages[pagename] = { __src: page, __template_args: {title: pagename} };
	}

	return {

		templates_input_dir: `${__dirname}/`,
		templates_output_dir: `./dist/${path_suffix}/__templates/`, // optionnal
		templates: {
			__default:{ __src: 'template', __args: { base_url: `file:///home/demigda//Data/Git/keystroke.fr/dist/${path_suffix}` } }
		},

		pages_output_dir: `./dist/${path_suffix}/`, // optionnal
		pages
	};
}