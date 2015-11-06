module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Timing the build tasks.
  require('time-grunt')(grunt);

  grunt.initConfig({
    clean: {
      dist: 'dist/*.js'
    },
    jshint: {
      dist: {
        src: ['*.js', 'lib/*.js']
      },
      test: {
        src: ['tests/*.js']
      }
    },
    uglify: {
      dist: {
        src: 'lib/index.js',
        dest: 'dist/middleware-chain.min.js'
      }
    },
    mochaTest: {
      test: {
        src: ['tests/**/*.js']
      }
    }
  });

  // Registering the tasks.
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['clean', 'jshint', 'uglify', 'test']);
};