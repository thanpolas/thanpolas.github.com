---
layout: post
title: "Announcing The Release of Mantri"
description: "A new solution for Javascript dependency management is now ready. Announcing the release of Mantri, a traditionaλ dependency system."
category : javascript
tags : [javascript, mantri, requirejs, amd, modules, dependencies, google closure]
shortUrl: http://than.pol.as/N9Qz
---
{% include JB/setup %}

A new solution for Javascript dependency management is now ready. Announcing the release of [Mantri][], a traditionaλ dependency system.

## What? Why? How?

Mantri will discreetly manage your Javascript app dependencies during development and get out of the way in production.

This means smaller JS files for your production, absolute freedom of development expression and testing your codebase becomes silly easy.

Mantri is based on the powerful [Google Closure Tools][closure-tools], it hacks and wraps around them, providing a robust and developer friendly API. It is comprised of a front-end library and back-end tasks for calculating your dependency tree and building your application for production.

## The Ceremony

Each file should provide a unique namespace and can require any number of other namespaces:

{% highlight javascript %}
goog.provide('app');

goog.require('app.router');
goog.require('app.controller');
goog.require('app.view');
{% endhighlight %}

The namespace that you provide, is actually a namespace. The function call `goog.provide('app.view.about')` is equivalent to:

{% highlight javascript %}
app = app || {};
app.view = app.view || {};
app.view.about = app.view.about || {};
{% endhighlight %}

Because `goog.provide()` only initializes properties if they don't already exist, it never overwrites properties.

### Namespaces or Paths?

[Namespaces][]! You only declare namespaces, the paths will be automatically discovered by the [deps task][]. Using namespaces is what being *traditionaλ* is all about.

Namespaces is the native way for Javascript to hierarchically organize the structures of your application. Having the ability to directly reference and study your objects from the developer console is priceless. Just hit `app.router._currentView` on the console and see exactly what's going on. For any part of your code, at any time.

There are other ways of finding out what the value of a *private* variable is, like `console.log()` or the debugger and break-points, but in my humble opinion, it's only fair to say that one more valuable tool in your utility belt does't hurt.

### Exposing Internal Structures to Consumers

> Using namespaces expose the internal structures of my app, I want *privates* to be **privates** and not accessible from the outside!

Certainly! That's as easy as writing an [iife][] and instruct the build task to wrap your code inside this immediately invoked fuction expression:

{% highlight html %}
;(function(){ %output% })();
{% endhighlight %}

That's all that's required, really. And it only happens to your production ready file.

Personally, i don't care about privacy. When I author a library, that library is intended to be used by developers. I trust developers. I trust that if you see a method or a property starting with an underscore, you know you are entering dangerous territory. I want to give you the freedom to do it.

## Mantri is Synchronous

The only thing that's required in your Document for Mantri to work is a single script element.

{% highlight html %}
<script src="js/libs/mantri.web.js"></script>
{% endhighlight %}

When the browser parses that element and evaluates Mantri's code, operations start executing synchronously. A request is made to fetch the configuration file `mantriConf.json`. Mantri will then use the `document.write()` method to synchronously inject `<script>` elements into your Document. The result is that all your JS files are loaded and parsed before the [DOMContentLoaded][] event is fired.

> All your code is loaded and evaluated before the browser finishes parsing your Document.

That's another aspect of the traditionaλ nature of Mantri. In the end, the Document will look like exactly as it would if you wrote all your app's `<script>` elements yourself.

## Path and Filename Discovery

The [deps task][] is another key part of Mantri. The job of declaring the actual filenames and paths of your JS assets (modules?) is done by a back-end task. This task, needs to run whenever you change or create dependency declarations.

This operation allows you to move folders around, with hundreds of files inside them without any issues. You just run the `deps` task once and all paths are updated automatically.

And since this is 2013, our lives are so much easier by using a [watch task][] to have [Grunt][] automatically run the `deps` task for us.

## Mantri is Testable

> Easily. Naturaly. Traditionaλy.

Since you can directly access any part of your codebase via the global namespace, it is silly easy to mock anything or unit test everything! Even private methods. A feat that can proove nearly impossible with AMD or even commonJS modules.


## There Is Nothing Left in Production But Your Code

> Smaller. Faster. Awesommmnerz.

During the [build operation][], Mantri will bundle your application into one file and remove all dependency declarations. They are no longer needed.

No Mantri runtime code inluded either! Only your code and your third-party dependencies, packed in a single dense file.

Please do not use the dependency system in a production environment. It is highly discouraged as the design patterns used will significantly *slow down your page load time*. Use only the optimized and minified single file that is produced by the [build operation][]. Mantri **is not** a *module loader* for your live site.

## Mantri Does Not Dictate How You Write Your Code

Don't mind my previous subliminal rant about namespaces. Mantri does not dictate how you write or structure your code. As long as you properly *provide* and *require* unique namespaces you are good to go.

You can then use the declared namespace as the equivalent of `module.exports`:

{% highlight javascript %}
goog.provide('app.view.login');

(function(){
  var viewLogin = app.view.login = {};

  viewLogin.open = function(){ /* ... */ };
  /* ... */
})();
{% endhighlight %}

### There Are no Conflicts With Other Libraries

By design, [Google's dependency system][calcdeps] that Mantri incorporates, is agnostic of its suroundings. A nice way to think of Mantri is as a plain python file operation that also happens to know how to talk Javascript.

That leaves plenty of room for hacking, abusing and generally knocking yourselves out with any imaginable combination of dependency management libraries.

## A Dependency System For All

Mantri focuses on providing a robust and scalable development environment enabling multiple teams collaborating seamlessly.

Mantri provides a robust and scalable development environment enabling multiple teams collaborating seamlessly. And it gets out of your way on production with a very simple API.

Bottom line is, you'll only ever need two commands for the CLI.

### `mantri watch`

Will monitor all your javascript files and automatically run the `deps` task for you.

### `mantri build`

Will start the build operation.

### That's All!

These simple and powerful commands are all you need.

Of course you have full configuration power. You can use a set of command line options or try Mantri as a [Grunt Plugin][]. Finally, a developer's API is exposed  on node.js that you can `require()`.

I'd love to hear your thoughts and if you can see Mantri helping you.


[amd]: https://github.com/amdjs/amdjs-api/wiki/AMD "Wikipedia :: The Asynchronous Module Definition (**AMD**) API"
[mantri]: https://github.com/thanpolas/mantri "Mantri - Traditionaλ Dependency System"
[amd-post]: http://thanpol.as/javascript/why-i-dont-like-amd-and-what-i-will-do-about-it/ "Blog post: Why I Don't Like AMD And What I Will Do About It"
[amd-post-like]: http://thanpol.as/javascript/why-i-dont-like-amd-and-what-i-will-do-about-it/#amd_is_not_focused_on_solving_dependencies "Blog post: Why I Don't Like AMD And What I Will Do About It"
[amd-post-plan]: http://thanpol.as/javascript/why-i-dont-like-amd-and-what-i-will-do-about-it/#what_i_plan_on_doing_about_it "Blog post: Why I Don't Like AMD And What I Will Do About It"
[closure-tools]: https://developers.google.com/closure/ "Google Closure Tools"
[namespaces]: http://addyosmani.com/blog/essential-js-namespacing/ "Essential JavaScript Namespacing Patterns"
[watch task]: https://github.com/gruntjs/grunt-contrib-watch "Grunt's contrib watch task"
[iife]: http://benalman.com/news/2010/11/immediately-invoked-function-expression/ "Immediately-Invoked Function Expression (IIFE)"
[DOMContentLoaded]: https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/DOMContentLoaded_(event) "MDN DOMContentLoaded event"
[calcdeps]: https://developers.google.com/closure/library/docs/calcdeps "Google's Dependency Calculation Script for Closure Compiler"
[Grunt Plugin]: http://gruntjs.com/plugins "Grunt plugins"
[mantri-npm]: https://npmjs.org/package/mantri "Mantri on npm"
[grunt]: http://gruntjs.com/
[build operation]: https://github.com/thanpolas/mantri/wiki/Grunt-Task-mantriBuild "Grunt Task mantriBuild"
[deps task]: https://github.com/thanpolas/mantri/wiki/Grunt-Task-mantriDeps "Grunt Task mantriDeps"
