module.exports = function(grunt) {
	const ignores = [
		'!assets/**',
		'!node_modules/**',
		'!release/**',
		'!.git/**',
		'!.sass-cache/**',
		'!.gitignore',
		'!.gitmodules',
		'!tests/**',
		'!bin/**',
		'!.travis.yml',
		'!phpunit.xml',
		'!vendor/**',
		'!composer.json',
		'!composer.lock',
		'!package.json',
		'!package-lock.json',
	];

	const browserifyTransforms = [
		[
			'envify',
			{
				global: true,
			},
		],
		[
			'babelify',
			{
				presets: ['env', 'react'],
				plugins: [
					'add-module-exports',
					'transform-class-properties',
					'transform-object-rest-spread',
				],
			},
		],
		[
			'extensify',
			{
				extensions: ['jsx'],
			},
		],
	];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		env: {
			prod: {
				NODE_ENV: 'production',
			},
			dev: {
				NODE_ENV: 'development',
			},
		},

		browserify: {
			options: {
				paths: ['../node_modules'],
				watch: true,
			},
			dev: {
				files: {
					'js/scoutdocs.min.js': 'js/scoutdocs.jsx',
					'js/support.min.js': 'js/support.jsx',
				},
				options: {
					browserifyOptions: {
						standalone: 'ScoutDocs',
						debug: true,
					},
					transform: browserifyTransforms,
				},
			},
			prod: {
				files: {
					'js/scoutdocs.min.js': 'js/scoutdocs.jsx',
					'js/support.min.js': 'js/support.jsx',
				},
				options: {
					browserifyOptions: {
						standalone: 'ScoutDocs',
						debug: false,
					},
					transform: [
						...browserifyTransforms,
						[
							'uglifyify',
							{
								global: true,
							},
						],
					],
				},
			},
		},

		sass: {
			default: {
				options: {
					style: 'expanded',
				},
				files: {
					'css/scoutdocs.css': 'sass/scoutdocs.sass',
					'css/app.css': 'sass/app.sass',
				},
			},
		},

		postcss: {
			dev: {
				src: 'css/*.css',
				options: {
					map: true,
					processors: [require('autoprefixer')],
				},
			},
			prod: {
				src: 'css/*.css',
				options: {
					map: true,
					processors: [require('autoprefixer'), require('cssnano')],
				},
			},
		},

		phpunit: {
			default: {},
		},

		watch: {
			php: {
				files: ['**/*.php', ...ignores],
				tasks: ['phpunit'],
				options: {
					debounceDelay: 5000,
				},
			},
			sass: {
				files: ['sass/**/*.sass', ...ignores],
				tasks: ['sass', 'postcss:dev'],
				options: {
					debounceDelay: 500,
				},
			},
			package: {
				files: ['package.json'],
				tasks: ['replace'],
			},
		},

		clean: {
			release: [
				'release/<%= pkg.version %>/',
				'release/latest/',
				'release/svn/',
			],
		},

		copy: {
			release: {
				src: ['**', ...ignores],
				dest: 'release/<%= pkg.version %>/',
			},
			latest: {
				cwd: 'release/<%= pkg.version %>/',
				src: ['**'],
				dest: 'release/latest/',
			},
			svn: {
				cwd: 'release/<%= pkg.version %>/',
				src: ['**'],
				dest: 'release/svn/',
			},
		},

		replace: {
			header: {
				src: ['<%= pkg.name %>.php'],
				overwrite: true,
				replacements: [
					{
						from: /Version:(\s*?)[a-zA-Z0-9.-]+$/m,
						to: 'Version:$1<%= pkg.version %>',
					},
					{
						from: /Copyright \(c\) 2017-20[0-9]{2} .*$/m,
						to:
							'Copyright (c) 2017-' +
							new Date().getFullYear() +
							' <%= pkg.author.name %> (email: <%= pkg.author.email %>)',
					},
				],
			},
			plugin: {
				src: ['classes/plugin.php'],
				overwrite: true,
				replacements: [
					{
						from: /^(\s*?)const(\s+?)VERSION(\s*?)=(\s+?)'[^']+';/m,
						to: "$1const$2VERSION$3=$4'<%= pkg.version %>';",
					},
					{
						from: /^(\s*?)const(\s+?)CSS_JS_VERSION(\s*?)=(\s+?)'[^']+';/m,
						to: "$1const$2CSS_JS_VERSION$3=$4'<%= pkg.version %>';",
					},
				],
			},
			readme: {
				src: ['readme.txt'],
				overwrite: true,
				replacements: [
					{
						from: /Stable tag:(\s*?)[a-zA-Z0-9.-]+$/im,
						to: 'Stable tag:$1<%= pkg.version %>',
					},
				],
			},
		},

		compress: {
			default: {
				options: {
					mode: 'zip',
					archive: './release/<%= pkg.name %>.<%= pkg.version %>.zip',
				},
				expand: true,
				cwd: 'release/<%= pkg.version %>/',
				src: ['**/*'],
				dest: '<%= pkg.name %>/',
			},
		},

		notify_hooks: {
			options: {
				success: true,
			},
		},

		prettier: {
			options: {
				singleQuote: true,
				useTabs: true,
				trailingComma: 'es5',
			},
			default: {
				src: ['js/**/*.jsx'],
			},
		},

		wp_deploy: {
			deploy: {
				options: {
					plugin_slug: '<%= pkg.name %>',
					svn_user: '<%= pkg.name %>',
					build_dir: 'release/svn',
					assets_dir: 'assets',
					max_buffer: 5000 * 1024,
				},
			},
		},
	});

	require('load-grunt-tasks')(grunt);

	grunt.task.run('notify_hooks');

	grunt.registerTask('default', [
		'env:dev',
		'replace',
		'prettier',
		'browserify:dev',
		'sass',
		'postcss:dev',
	]);

	grunt.registerTask('dev', [
		'default',
		'watch',
	]);

	grunt.registerTask('default:prod', [
		'env:prod',
		'replace',
		'browserify:prod',
		'sass',
		'postcss:prod',
	]);

	grunt.registerTask('build', [
		'default:prod',
		'clean',
		'copy:release',
		'copy:latest',
		'copy:svn',
	]);

	grunt.registerTask('release', ['build', 'wp_deploy']);

	grunt.util.linefeed = '\n';
};
