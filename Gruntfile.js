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
            build: {
                src: ['dist']
            }
        },

        copy: {
            build: {
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
            options: {
                base: 'dist',
                message: 'Deploy to GitHub Pages'
            },
            src: ['**/*']
        }

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('serve', ['build', 'connect:dist']);
    grunt.registerTask('default', ['build']);
    grunt.registerTask('check:failOnError', ['jshint:failOnError', 'jscs:failOnError']);
    grunt.registerTask('check:warnOnly', ['jshint:warnOnly', 'jscs:warnOnly']);
    grunt.registerTask('check', ['check:failOnError']);
    grunt.registerTask('ci', ['default']);
    grunt.registerTask('build', ['check', 'clean', 'copy']);
    grunt.registerTask('build:dev', ['check:warnOnly', 'clean', 'copy']);
    grunt.registerTask('deploy', ['build', 'gh-pages']);
};
