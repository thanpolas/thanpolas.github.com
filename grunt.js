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
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');

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
      less: {
        files: 'assets/themes/thanpolas/less/*.less',
        tasks: 'less:development'
      },
      jekyllSources: {
        files: [ 'assets/themes/thanpolas/css/tpstyle.css',
          '*.html', '*.yml', 'assets/js/**.js', '_posts/**',
          'projects/**', 'blog/**', 'about/**'
          // '**/*', '!_site/**', '!**/*.less',
          // '!grunt.js', '!assets', '!node_modules',
          // '!site_git'
          ],
        tasks: 'shell:jekyll',
        options: {
          //forceWatchMethod: 'old',
          debounceDelay: 500
        }
      }
    },
    copy: {
      dist: {
        files: {
          '_site_git/' : '_site/**'
        }
      }
    },
  shell: {
      jekyll: {
          command: 'rm -rf _site/*; jekyll',
          stdout: true
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
  grunt.registerTask('default', 'watch');

};
