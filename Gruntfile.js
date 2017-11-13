'use strict';

module.exports = function(grunt) {

    require('time-grunt')(grunt);
    var proxy = require('http-proxy-middleware');
    grunt.loadNpmTasks('grunt-connect-proxy');

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin',
        ngtemplates: 'grunt-angular-templates',
        ngconstant: 'grunt-ng-constant',
        angularFileLoader: 'angular-file-loader'
    });

    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        modules: 'ubin',
        appJSFilePath: 'app.js',
        test: 'test',
        dist: 'dist'
    };

    //Set default module to ubin
    grunt.config.set('ubin.modules', '');

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        ubin: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= ubin.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all', 'newer:jscs:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            css: {
                files: ['<%= ubin.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['sass:server', 'postcss:server']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= ubin.app %>/{,*/,**/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= ubin.app %>/img/{,*/,**/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        // The actual grunt server settings
        connect: {
            options: {
                port: 2205,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function(connect) {
                        return [
                            connect.static('data'),
                            connect.static('.tmp'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect().use(
                                '/app/styles',
                                connect.static('./app/styles')
                            ),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            }
        },

        // Make sure there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= ubin.app %>/scripts/{,*/}*.js'
                ]
            }
        },

        // Make sure code styles are up to par
        jscs: {
            options: {
                config: '.jscsrc',
                verbose: true
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= ubin.app %>/scripts/{,*/}*.js'
                ]
            }
        },

        // Empties folders to start fresh
        clean: {
          dist: {
            files: [{
              dot: true,
              src: [
                '.tmp',
                '<%= ubin.dist %>/<%= ubin.modules %>',
                '!<%= ubin.dist %>/<%= ubin.modules %>/.git{,*/}*'
              ]
            }]
          },
	        server: {
	        	files: [{
	            dot: true,
	            src: [
	          		'.tmp',
	          		'.sass-cache'
	            ]
	          }]
	        },
	        main: {
            files: [{
              dot: true,
              src: [
              	'<%= ubin.dist %>/main'
              ]
            }]
	        }
        },

        // Add vendor prefixed styles
        postcss: {
            options: {
                processors: [
                    require('autoprefixer-core')({
                        browsers: ['> 2%', 'iOS 8']
                    })
                ]
            },
            server: {
                options: {
                    map: true
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Angular components into the app
        angularFileLoader: {
            options: {
                scripts: [
                    '<%= ubin.app %>/scripts/<%= ubin.appJSFilePath%>',
                    '<%= ubin.app %>/scripts/directives/**/*.js',
                    '<%= ubin.app %>/scripts/controllers/**/*.js',
                    '<%= ubin.app %>/scripts/services/**/*.js',
                    '<%= ubin.app %>/scripts/filters/**/*.js',
                    '<%= ubin.app %>/common/**/*.js',
                    '<%= ubin.app %>/common/**/*.json'
                ]
            },
            target: {
                src: ['<%= ubin.app %>/index.html']
            },
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= ubin.app %>/index.html'],
                ignorePath: /\.\.\//
            },
            sass: {
                src: ['<%= ubin.app %>/styles/{,*/}*.{scss,sass}'],
                ignorePath: /(\.\.\/){1,2}bower_components\//
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
        	dist: {
        		files: {
        			'.tmp/styles/main.css': '<%= ubin.app %>/styles/main.scss'
        		}
        	},
        	server: {
        		options: {
        			sourcemap: true
            },
            files: {
        			'.tmp/styles/main.css': '<%= ubin.app %>/styles/main.scss'
        		}
        	}
		    },
        useminPrepare: {
            html: '<%= ubin.app %>/index.html',
            options: {
                dest: '<%= ubin.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= ubin.dist %>/{,*/}*.html'],
            css: ['<%= ubin.dist %>/styles/{,*/}*.css'],
            js: ['<%= ubin.dist %>/scripts/{,*/}*.js'],
            options: {
                assetsDirs: [
                    '<%= ubin.dist %>',
                    '<%= ubin.dist %>/img',
                    '<%= ubin.dist %>/styles'
                ],
                patterns: {
                    js: [
                        [/(img\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']
                    ]
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= ubin.dist %>/<%= ubin.modules %>/scripts/scripts.js': [
                        '<%= ubin.dist %>/<%= ubin.modules %>/scripts/scripts.js'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= ubin.dist %>',
                    src: ['*.html'],
                    dest: '<%= ubin.dist %>'
                }]
            }
        },

        ngtemplates: {
            dist: {
                options: {
                    module: 'ubin-ui',
                    htmlmin: '<%= htmlmin.dist.options %>',
                    usemin: '<%= ubin.dist %>/scripts/scripts.js'
                },
                cwd: '<%= ubin.app %>',
                src: ['views/**/*.html', 'common/templates/**/*.html'],
                dest: '.tmp/templates.js'
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= ubin.app %>',
                    dest: '<%= ubin.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '*.html',
                        'img/{,*/,**/}*.{png,jpg,jpeg,gif,webp,svg}',
                        'app/common/json/*.json'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/styles',
                    dest: '<%= ubin.dist %>/styles',
                    src: ['*.css']
                }, {
                    expand: true,
                    cwd: '.tmp/img',
                    dest: '<%= ubin.dist %>/img',
                    src: ['generated/*']
                }, {
                		expand: true,
                    cwd: 'bower_components/components-font-awesome',
                    dest: '<%= ubin.dist %>',
                    src: ['fonts/*']
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= ubin.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },
        injector: {
            options: {
                // Task-specific options go here.
                transform: function(filepath) {
                    var path = require('path');
                    var tempPath = filepath.replace('/.tmp/', '');

                    var extension = path.extname(filepath).slice(1);
                    var injectString = '';
                    switch (extension) {
                        case 'css':
                            injectString = '<link rel="stylesheet" href="' + tempPath + '">';
                            break;
                        case 'js':
                            injectString = '<script src="' + tempPath + '"></script>';
                            break;
                        case 'json':
                            break;
                        case 'html':
                            injectString = '<link rel="import" href="' + tempPath + '">';
                            break;
                        default:
                            injectString = '';
                    }
                    return injectString;
                }
            },
            dependencies: {
                // Target-specific file lists and/or options go here.
                files: {
                    '<%= ubin.app %>/index.html': ['.tmp/styles/main.css', '.tmp/styles/main.css', 'app/common/json/*.json'],
                }
            },
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'sass:server'
            ],
            dist: [
                'sass:dist'
            ]
        },

        //constants
        ngconstant: {
            // Options for all targets
            options: {
                space: ' ',
                wrap: '"use strict";\n\n {%= __ngModule %}',
                name: 'config',
            },
            corda: {
                options: {
                    dest: '<%= ubin.app %>/scripts/services/environment.js'
                },
                constants: {
                    ENV: {
                        name: 'prod',
                        platform: 'corda',
                        currency: "SGD",
                    }
                }
            },
            fabric: {
                options: {
                    dest: '<%= ubin.app %>/scripts/services/environment.js'
                },
                constants: {
                    ENV: {
                        name: 'prod',
                        platform: 'fabric',
                        currency: "SGD",
                    }
                }
            },
            quorum: {
                options: {
                    dest: '<%= ubin.app %>/scripts/services/environment.js'
                },
                constants: {
                    ENV: {
                        name: 'prod',
                        platform: 'quorum',
                        currency: "SGD",
                    }
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-scss-lint');
    var env = grunt.option('env') || 'test';

    grunt.registerTask('serve', 'Compile then start a connect web server', function(module, target) {

        var param = grunt.option('env');
        console.log('env -> ', env);

        grunt.task.run([
            'injector',
            'clean:server',
            'angularFileLoader',
            'wiredep',
            'ngconstant:' + env,
            'concurrent:server',
            'postcss:server',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', 'Prepares a distribution package', function(module) {

        //grunt.config.set('pii.modules', module);

        grunt.task.run([
            'clean:dist',
            'angularFileLoader',
            'wiredep',
            'ngconstant:' + env,
            'useminPrepare',
            'concurrent:dist',
            'postcss:dist',
            'ngtemplates',
            'concat',
            'ngAnnotate',
            'copy:dist',
            'cssmin',
            'uglify',
            'usemin',
            'htmlmin',
            'clean:main'
        ]);
    });

};