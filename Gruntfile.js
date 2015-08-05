/* global module, require */

module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            srcJsFiles: [
                'src/**/*.js'
            ],
            testJsFiles: [
                'test/**/*Spec.js'
            ],
            ourJsFiles: [
                'Gruntfile.js',
                '<%= meta.srcJsFiles %>',
                '<%= meta.testJsFiles %>'
            ]
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
            files: ['<%= meta.ourJsFiles %>'],
            tasks: ['build:dev']
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
                    src: ['**'],
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
                    cwd: 'node_modules/d3fc/node_modules/css-layout/src/',
                    src: ['Layout.js'],
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
                    cwd: 'node_modules/d3fc/dist/',
                    src: ['d3fc.css'],
                    dest: 'dist/assets/css',
                    expand: true
                },
                {
                    cwd: 'node_modules/bootstrap/dist/js/',
                    src: ['bootstrap.min.js'],
                    dest: 'dist/assets/js',
                    expand: true
                },
                {
                    cwd: 'node_modules/bootstrap/dist/css/',
                    src: ['bootstrap.min.css'],
                    dest: 'dist/assets/css',
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
        }

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['build']);
    grunt.registerTask('ci', [
            'build',
            'mobile:platforms',
            'mobile:prepare',
            'cordovacli:buildAndroid'
        ]);

    grunt.registerTask('check:failOnError', ['jshint:failOnError', 'jscs:failOnError']);
    grunt.registerTask('check:warnOnly', ['jshint:warnOnly', 'jscs:warnOnly']);
    grunt.registerTask('check', ['check:failOnError']);

    grunt.registerTask('build', ['check', 'clean', 'copy']);
    grunt.registerTask('build:warnOnly', ['check:warnOnly', 'clean', 'copy']);

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

    grunt.registerTask('serve', ['build', 'connect:dist']);
};
