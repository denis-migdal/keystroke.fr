//import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './sticky-footer-navbar.css';
//import 'webpack-icons-installer/bootstrap'; // https://www.npmjs.com/package/webpack-icons-installer

import './main.css';


const $ = require('./jquery_base.js');

$( () => {

	$('.dropdown-toggle').on('click', (ev) => {

		ev.preventDefault();

		let menu = $(ev.currentTarget).parent().find('.dropdown-menu');
		menu.toggleClass('show');
	});
});