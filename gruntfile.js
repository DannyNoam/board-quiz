module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
                files: ['src/**/*.js']
            },

            clean: {
                code: {
                    files: [{src: ['output/index.html', 'output/board-quiz.js', 'output/lib/']}]
                },

                resources: {
                    files: [{src: 'output/resource'}]
                },

                all: {
                    files: [{src: 'output/'}]
                }
            },

            copy: {
                dev: {
                    files: [
                        {
                            src: ['resource/**', 'index.html', 'lib/*.js', 'board-quiz.js'],
                            dest: './output/'
                        }]
                },

                release: {
                    files: [
                        {
                            src: ['index.html', 'lib/*.js', 'src/**/*.js'],
                            dest: './output/'

                        }]
                },
                resources: {
                    files: [
                        {
                            src: ['resource/**'],
                            dest: './output/'
                        }]
                },
            },

            browserify: {
                dev: {
                    options: {
                        browserifyOptions: {
                            debug: true
                        }
                    },
                    files: {
                        'board-quiz.js': ['src/**/*.js']
                    }
                },

                release: {
                    files: {
                        'board-quiz.js': ['src/**/*.js']
                    }
                }
            },

            uglify: {
                options: {
                    mangle: false
                },
                my_target: {
                    files: {
                        'output/board-quiz.min.js': ['board-quiz.js']
                    }
                }
            },

            watch: {
                files: ['src/**/*.js', 'index.html'],
                tasks: ['code'],
                options: {atBegin: true}
            },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-sonar-runner');

    grunt.registerTask('debug', ['jshint', 'qunit']);
    grunt.registerTask('code', ['jshint', 'clean:code', 'browserify:dev', 'copy:dev']);
    grunt.registerTask('dev', ['clean:resources', 'browserify:dev', 'copy:dev']);
    grunt.registerTask('release', ['clean:all', 'browserify:release', 'copy:release', 'copy:resources', 'uglify']);

    grunt.registerTask('default', ['release']);
};