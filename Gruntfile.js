/* global module, require */

module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            srcFiles: [
                'src/**/*'
            ],
            srcJsFiles: [
                'src/assets/js/sc.js',
                'src/assets/js/event.js',
                'src/assets/js/model/**/*.js',
                'src/assets/js/chart/**/*.js',
                'src/assets/js/menu/**/*.js',
                'src/assets/js/util/**/*.js',
                'src/assets/js/data/**/*.js',
                'src/assets/js/behavior/**/*.js',
                'src/assets/js/series/**/*.js',
                'src/assets/js/app.js',
                'src/assets/js/main.js'
            ],
            testJsFiles: [
                'test/**/*Spec.js'
            ],
            vendorJsFiles: [
                'node_modules/d3fc/node_modules/d3/d3.js',
                'node_modules/d3fc/node_modules/css-layout/dist/css-layout.js',
                'node_modules/d3fc/node_modules/svg-innerhtml/svg-innerhtml.js',
                'node_modules/d3fc/dist/d3fc.js',
                'node_modules/jquery/dist/jquery.min.js',
                'node_modules/bootstrap/dist/js/bootstrap.js'
            ],
            ourJsFiles: [
                'Gruntfile.js',
                '<%= meta.srcJsFiles %>',
                '<%= meta.testJsFiles %>'
            ],
            coverageDir: 'coverage'
        },

        jscs: {
            options: {
                config: '.jscsrc'
            },
            failOnError: {
                files: {
                    src: ['<%= meta.ourJsFiles %>']
                }
            },
            warnOnly: {
                options: {
                    force: true
                },
                files: {
                    src: ['<%= meta.ourJsFiles %>']
                }
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },
            failOnError: {
                files: {
                    src: ['<%= meta.ourJsFiles %>']
                }
            },
            warnOnly: {
                options: {
                    force: true
                },
                files: {
                    src: ['<%= meta.ourJsFiles %>']
                }
            }
        },

        watch: {
            files: ['<%= meta.srcFiles %>', '<%= meta.testJsFiles %>'],
            tasks: ['build:development'],
            options: {
                atBegin: true,
                livereload: true
            }
        },

        clean: {
            web: {
                src: ['dist']
            },
            mobile: {
                src: ['mobile/www']
            }
        },

        copy: {
            web: {
                files: [{
                    cwd: 'src',
                    src: ['index.html'],
                    dest: 'dist',
                    expand: true
                },
                {
                    cwd: 'node_modules/d3fc/node_modules/d3/',
                    src: ['d3.js'],
                    dest: 'dist/assets/js',
                    expand: true
                },
                {
                    cwd: 'node_modules/d3fc/node_modules/css-layout/dist/',
                    src: ['css-layout.js'],
                    dest: 'dist/assets/js',
                    expand: true
                },
                {
                    cwd: 'node_modules/d3fc/node_modules/svg-innerhtml/',
                    src: ['svg-innerhtml.js'],
                    dest: 'dist/assets/js',
                    expand: true
                },
                {
                    cwd: 'node_modules/d3fc/dist/',
                    src: ['d3fc.js'],
                    dest: 'dist/assets/js',
                    expand: true
                },
                {
                    cwd: 'node_modules/bootstrap/dist/js/',
                    src: ['bootstrap.min.js'],
                    dest: 'dist/assets/js',
                    expand: true
                },
                {
                    cwd: 'node_modules/bootstrap/dist/fonts/',
                    src: ['**'],
                    dest: 'dist/assets/fonts',
                    expand: true
                },
                {
                    cwd: 'node_modules/jquery/dist',
                    src: ['jquery.min.js'],
                    dest: 'dist/assets/js',
                    expand: true
                }]
            },
            mobile: {
                files: [
                {
                    expand: true,
                    cwd: 'dist/',
                    src: ['**'],
                    dest: 'mobile/www/'}
                ]
            }
        },

        connect: {
            dist: {
                options: {
                    useAvailablePort: true,
                    base: 'dist',
                    keepalive: true
                }
            },
            watch: {
                options: {
                    useAvailablePort: true,
                    base: 'dist',
                    keepalive: false
                }
            }
        },

        'gh-pages': {
            origin: {
                options: {
                    base: 'dist',
                    message: 'Deploy to GitHub Pages'
                },
                src: ['**/*']
            },
            upstream: {
                options: {
                    base: 'dist',
                    message: 'Deploy to GitHub Pages',
                    repo: 'https://github.com/ScottLogic/d3fc-showcase.git'
                },
                src: ['**/*']
            }
        },

        cordovacli: {
            options: {
                path: 'mobile',
                cli: 'cordova'
            },
            addIos: {
                options: {
                    command: 'platform',
                    action: 'add',
                    platforms: ['ios']
                }
            },
            addAndroid: {
                options: {
                    command: 'platform',
                    action: 'add',
                    platforms: ['android']
                }
            },
            prepareIos: {
                options: {
                    command: 'prepare',
                    platforms: ['ios']
                }
            },
            prepareAndroid: {
                options: {
                    command: 'prepare',
                    platforms: ['android']
                }
            },
            buildIos: {
                options: {
                    command: 'build',
                    platforms: ['ios']
                }
            },
            buildAndroid: {
                options: {
                    command: 'build',
                    platforms: ['android']
                }
            },
            emulateAndroid: {
                options: {
                    command: 'emulate',
                    platforms: ['android']
                }
            }
        },

        less: {
            development: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'style.css.map',
                    sourceMapFilename: 'dist/assets/css/style.css.map'
                },
                files: {
                    'dist/assets/css/style.css': 'src/assets/styles/style.less'
                }
            },
            production: {
                options: {
                    strictMath: true
                },
                files: {
                    'dist/assets/css/style.css': 'src/assets/styles/style.less'
                }
            }
        },

        concat: {
            development: {
                src: ['<%= meta.srcJsFiles %>'],
                dest: 'dist/assets/js/app.js',
                options: {
                    sourceMap: true
                }
            },
            production: {
                src: ['<%= meta.srcJsFiles %>'],
                dest: 'dist/assets/js/app.js',
                options: {
                    sourceMap: false
                }
            }
        },

        karma: {
            options: {
                files: [
                    '<%= meta.vendorJsFiles %>',
                    '<%= meta.srcJsFiles %>',
                    '<%= meta.testJsFiles %>'
                ],
                exclude: ['src/assets/js/main.js'],
                configFile: 'karma.conf.js'
            },
            phantom: {
                browsers: ['PhantomJS']
            },
            ci: {
                browsers: ['Firefox', 'PhantomJS']
            },
            all: {},
            unit: {
                autoWatch: true,
                singleRun: false
            }
        }

    });

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
    });

    grunt.registerTask('default', ['build']);
    grunt.registerTask('ci', [
            'build:ci',
            'mobile:platforms',
            'mobile:prepare'
        ]);

    grunt.registerTask('check:failOnError', ['jshint:failOnError', 'jscs:failOnError']);
    grunt.registerTask('check:warnOnly', ['jshint:warnOnly', 'jscs:warnOnly']);
    grunt.registerTask('check', ['check:failOnError']);

    grunt.registerTask('test', ['karma:all']);

    grunt.registerTask('build', ['check', 'test', 'clean',
        'concat:production', 'less:production', 'copy']);
    grunt.registerTask('build:ci', ['check', 'karma:ci', 'clean',
        'concat:production', 'less:production', 'copy']);
    grunt.registerTask('build:development', ['check', 'karma:phantom', 'clean',
        'concat:development', 'less:development', 'copy']);
    grunt.registerTask('build:warnOnly', ['check:warnOnly', 'karma:phantom', 'clean',
        'concat:development', 'less:development', 'copy']);

    grunt.registerTask('build:android', ['build', 'cordovacli:buildAndroid']);
    grunt.registerTask('build:ios', ['build', 'cordovacli:buildIos']);
    grunt.registerTask('mobile:platforms', [
            'cordovacli:addIos',
            'cordovacli:addAndroid'
        ]);
    grunt.registerTask('mobile:prepare', [
            'cordovacli:prepareIos',
            'cordovacli:prepareAndroid'
        ]);
    grunt.registerTask('mobile:init', [
            'build',
            'mobile:platforms',
            'mobile:prepare'
        ]);

    grunt.registerTask('deploy', ['build', 'gh-pages:origin']);
    grunt.registerTask('deploy:upstream', ['build', 'gh-pages:upstream']);

    grunt.registerTask('dev', ['connect:watch', 'watch']);

    grunt.registerTask('serve', ['connect:dist']);
};
