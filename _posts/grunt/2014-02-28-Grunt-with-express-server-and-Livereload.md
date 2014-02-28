---
layout: post
title: "Grunt with express server and Livereload"
description: "Launching a NodeJS webserver using express from Grunt has been an elusive topic for some time. Adding LiveReload to the mix is even more tedious. After many iterations and setups i've resorted to a Gruntfile that will work for everyone, launch the Express Webserver with Livereload using Grunt or launch it the from command line."
category : grunt
tags : [nodejs, grunt, gruntjs, tasks, livereload, watch, build, sass]
shortUrl: http://than.pol.as/UAo8
---
{% include JB/setup %}

Launching a NodeJS webserver using express from Grunt has been an elusive topic for some time. Adding LiveReload to the mix is even more tedious. After many iterations and setups i've resorted to a Gruntfile that will work for everyone, launch the Express Webserver with Livereload using Grunt or launch it the from command line.

<script src="https://gist.github.com/thanpolas/7182266.js"></script>

So a lot is going on here, let's examine them one by one.

## The Express task

Nothing fancy here, configure the [grunt-express-server](https://github.com/ericclemmons/grunt-express-server) task as you normaly would, this task will launch your nodeJS Express application `grunt express:web`

## The Watch tasks

There are 3 watch targets defined, each service a different purpose and all three running together:

### The *frontend* target

The *frontned* target will trigger a livereload event when any of the static assets change. The files to be watched were chosen carefully with two factors in mind:

* Do not trigger a webserver restart
* Do not perform a full page reload if possible when Livereload is triggered

### The *stylesSass* target

This target is all about your pre-processing tools. So if you use sass, less, JS minification or any other pre-processing operation it needs to be in its own new target. There is no Livereload trigger in this target and that's on purpose.

The idea is that your pre-processors take time to complete an operation, if a Livereload event is triggered at the start of the operation you will see a broken page, pending the op to finish. So instead, we just launch the preprocessor and wait for it to finish. When it's finished one of the *frontend* watched files will get updated triggering the Livereload.

so you can imagine this watch target as being one chain-link behind the *frontend* watch target.

### The *web* target

This is the watch target that watches for you webserver codebase, point it to your `/lib` folder and anywhere else you have files that when changed will require a webserver restart.

A webserver restart will not trigger a Livereload because it's often the case that the server doesn't have enough time to restart before the browser performs the page refresh.

Take extra care to include the two options `nospawn` and `atBegin` as they are required for the task to work properly.

## The Parallel task

Finally, nothing of this setup would work without the use of [grunt-parallel](https://github.com/iammerrick/grunt-parallel). There is no other way to launch multiple watch targets at once, so we can't do without it.

## Aliasing and putting everything together

The final two `grunt.registerTask` alias statements will put everything together and expose running all those tasks using the `web` alias `grunt web`, and finally that alias task is defined as the default task so the only thing you need to do to launch your project is:

{% highlight PowerShell %}
$ grunt
{% endhighlight %}


> If you are into Grunt [you might wanna check the "Managing large scale projects with Grunt" post too](http://thanpol.as/grunt/Managing-large-scale-projects-with-Grunt/).


