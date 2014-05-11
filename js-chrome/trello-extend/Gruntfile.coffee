module.exports = (grunt)->

	grunt.initConfig

		pkg  : grunt.file.readJSON 'package.json'
		meta :
			key: 'trellum'
			dir:
				source : 'source'
				static : 'source/static'
				build  : 'Trellum'

		watch:
			scripts:
				files: [
					'<%= meta.dir.source %>/*.coffee',
					'<%= meta.dir.source %>/*.styl',
					'<%= meta.dir.static %>/**'
				]
				tasks: ['devel']

		# TASKS
		clean:
			['<%= meta.dir.build %>']
		copy:
			build: # default 'strategy'
				expand : true
				cwd    : '<%= meta.dir.static %>'
				src    : ['**']
				dest   : '<%= meta.dir.build %>/'
		coffee:
			build:
				options: bare : true
				files  :'<%= meta.dir.build %>/<%= meta.key %>.js': [
						'<%= meta.dir.source %>/trellum-core.coffee'
						'<%= meta.dir.source %>/trellum-lib.coffee'
						'<%= meta.dir.source %>/trellum.coffee'
				]
		stylus:
			build:
				options: compress: true
				files  : '<%= meta.dir.build %>/<%= meta.key %>.css': ['<%= meta.dir.source %>/*.styl']
			devel:
				options: compress: false
				files  : '<%= meta.dir.build %>/<%= meta.key %>.css': ['<%= meta.dir.source %>/*.styl']
		uglify:
			build:
				files  : '<%= meta.dir.build %>/<%= meta.key %>.js':'<%= meta.dir.build %>/<%= meta.key %>.js'

	grunt.loadNpmTasks 'grunt-contrib-clean'
	grunt.loadNpmTasks 'grunt-contrib-copy'
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-stylus'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-watch'

	grunt.registerTask 'build', ['clean','copy','stylus','coffee','uglify']
	grunt.registerTask 'devel', ['clean','copy','stylus:devel','coffee']
