'use strict';

const Path = require('path');

module.exports = {
	entry  : './app/index.js',
	output :{
		filename:'public/bundle.js'
	},
	resolve: {
		root:[Path.resolve('./app')]
	},
	module :{
		loaders:[
			{
				test    : /\.jsx?$/,
				exclude : /(node_modules|bower_components)/,
				loader  : 'babel',
				query   : {
					presets: ['react', 'es2015', 'stage-1']
				}
			}
		]
	}
}