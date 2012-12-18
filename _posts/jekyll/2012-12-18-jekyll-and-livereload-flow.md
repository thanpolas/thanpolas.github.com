---
layout: post
title: "Jekyll And LiveReload Flow"
description: "Working on a Jekyll site with LiveReload can be quite a sad experience. Especially when there are more pre-processors up the asset pipe, It can take several seconds and multiple page refreshes before the changes are available. Here's how I smoothed the flow using Grunt.
"
category : jekyll
tags : [jekyll, grunt, autoreload]
---
{% include JB/setup %}

Working on a Jekyll site with [LiveReload][livereload] can be quite a sad experience. Especially when there are more pre-processors up the asset pipe. It can take several seconds and multiple page refreshes before the changes are available. Here's how I smoothed the flow using [Grunt][grunt].

## The problem with Jekyll and LiveReload

When Jekyll generates files, it deletes all files and folders from the output directory `_site`. Furthermore, naturally, the generated files are written to disk serially and during a long period (~3s for a small site). When Jekyll does iterative changes, it does a poor job when a configuration file or layouts are changed. So an `rm -rf _site/*` is required anyway.

So, if LiveReload is watching the `_site` folder, it will trigger multiple times during generation. And the first reloads will be of empty or broken pages. If LiveReload watches the whole Jekyll directory, you get similar results or worse. Even if the `_site` folder is excluded from LiveReload it doesn't work smoothly as well.

The same issue persists even with Jekyll's own `auto` setting on. When building a Jekyll site or generally working on its markup and styles, this can get pretty annoying.

## How to remedy the issue

The general idea is to enable LiveReload's *hot reload* when editing styles. Meaning, the page does not perform a *reload* but applies the changed styles on-the-fly.

[Grunt][grunt] to the rescue once more! Using the `watch` task we can control what happens when a file changes. **Two watch tasks are required**:

1. A watch for the styles.
2. A watch for every other static file.

The style's watch will execute a `copy` task that will copy the style files from their position to their proper position in the `_site` folder.

The second watch will execute Jekyll so it will generate the site, is the best we can do.

So what happens with this setup is that when only a style file is edited, LiveReload will do a *hot reload* right there and then and as fast as a copy can happen.

The key ingredient here is to not use Jekyll in `server` mode, rather use your own [static server][staticServer] of choice that serves files from the `_site` folder.

## SHOW ME TEH CODE

{% highlight javascript linenos=table %}

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    watch: {
      less: {
        // Using less to render styles.
        // Watch for the *.less file sonly
        files: ['assets/themes/thanpolas/less/*.less'],
        tasks: 'lessCopy'
      },
      jekyllSources: {
        files: [
          // capture all except css - add your own
          '*.html', '*.yml', 'assets/js/**.js',
          '_posts/**', '_includes/**'

          ],
        tasks: 'shell:jekyll',
      }
    },
    copy: {
      css : {
        files: {
          // Copy the less-generated style file to
          // the _site/ folder
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
        paths: ["assets/themes/thanpolas/less"]
      },
      files: {
        "assets/themes/thanpolas/css/tpstyle.css": "assets/themes/thanpolas/less/main.less"
      }
    }
  }

  });
  // less watch
  grunt.registerTask('lessCopy', 'less:development copy:css');
  // Default task.
  grunt.registerTask('default', 'watch');

};

{% endhighlight %}


[livereload]: http://livereload.com/ "CSS edits and image changes apply live."
[grunt]: http://gruntjs.com "Grunt is a task-based command line build tool for JavaScript projects"
[staticServer]: https://github.com/thanpolas/shell_helpers/blob/master/serv "A node.js static server using connect"
