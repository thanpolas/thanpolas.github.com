var path = require('path');

/**
 * [exports description]
 * @param  {[type]} grunt [description]
 * @return {[type]}       [description]
 */
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-regarde');

  var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

  var folderMount = function folderMount(connect, point) {
    return connect.static(path.resolve(point));
  };



  // Project configuration.
  grunt.initConfig({

    copy: {
      dist: {
        files: {
          '_site_git/' : '_site/**'
        }
      },
      css : {
        files: {
          '_site/assets/themes/thanpolas/css/tpstyle.css': 'assets/themes/thanpolas/css/tpstyle.css'
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
          paths: ['assets/themes/thanpolas/less']
        },
        files: {
          'assets/themes/thanpolas/css/tpstyle.css': ['assets/themes/thanpolas/less/main.less']
        }
      }
    },


    watch: {
      less: {
        files: ['assets/themes/thanpolas/less/*.less'],
        tasks: 'lessCopy'
      },
      jekyllSources: {
        files: [
          // capture all except css
          '*.html', '*.yml', 'assets/js/**.js', '_posts/**',
          'projects/**', 'blog/**', 'about/**', '_includes/**',
          'atom.xml'
          ],
        tasks: 'shell:jekyll',
        options: {
          //forceWatchMethod: 'old',
          //debounceDelay: 500
        }
      }
    },

    /**
     * Live Reload
     *
     */
   regarde: {
      less: {
        files: ['assets/themes/thanpolas/less/*.less'],
        tasks: ['lessCopy']
      },
      jekyllSources: {
        files: [
          // capture all except css
          '*.html', '*.yml', 'assets/js/**.js', '_posts/**',
          'projects/**', 'blog/**', 'about/**', '_includes/**',
          'atom.xml', '**/*.md'
          ],
        tasks: ['shell:jekyll']
      },
      staticSources: {
        files: ['_site/**'],
        tasks: ['livereload']
      }
    },
    connect: {
      livereload: {
        options: {
          base: '_site/',
          port: 9009,
          middleware: function(connect) {
            return [lrSnippet, folderMount(connect, '_site/')];
          }
        }
      }
    }


  });

  // less watch
  grunt.registerTask('lessCopy', ['less:development', 'copy:css']);

  grunt.registerTask('live', [
    'livereload-start',
    'connect:livereload',
    'regarde'
  ]);

  // Default task.
  grunt.registerTask('default', 'live');

};
