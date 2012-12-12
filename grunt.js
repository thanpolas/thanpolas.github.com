/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Project configuration.
  grunt.initConfig({
    test: {
      all: ['test/**/*.js']
    },
    lint: {
      all: [
        'grunt.js',
        'lib/**/*.js',
        'tasks/*.js',
        'tasks/*/*.js',
        'test/{grunt,tasks,util}/*.js'
      ]
    },
    watch: {
      scripts: {
        files: 'assets/themes/thanpolas/less/*.less',
        tasks: 'less:development'
      },
      generation: {
        files: '_site/*',
        tasks: 'copy:dist'
      }
    },
    copy: {
      dist: {
        files: {
          '_site_git/' : '_site/**'
        }
      }
    },
  less: {
    development: {
      options: {
        paths: ["assets/themes/thanpolas/less"]
      },
      files: {
        "assets/themes/thanpolas/css/tpstyle.css": "assets/themes/thanpolas/less/main.less"
      }
    }
  }


  });

  // Default task.
  grunt.registerTask('default', 'lint test');

};
