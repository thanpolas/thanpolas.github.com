---
layout: post
title: "Development Using Namespaces"
description: "Using global Namespaces for web development is a long forgotten practice, banished, cursed and buried deep under tons of senseless hype. In this post I will try to provide an overview of the pros and cons in using Global Namespaces. How the development workflow compares to the Module Definition Patterns and debunk a few myths and notions that exist about this matter."
category : javascript
tags : [javascript, module loaders, modular code, amd, modules, dependencies, commonjs]
shortUrl: http://than.pol.as/NvZQ
---
{% include JB/setup %}

> Pros, Cons, Myths and Hypesteria

## Preface

Using global Namespaces for web development is a long forgotten practice, banished, cursed and buried deep under tons of senseless hype. In this post I will try to provide an overview of the pros and cons in using Global Namespaces. How the development workflow compares to the Module Definition Patterns* and debunk a few myths and notions that exist about this matter.

This post is examining a very specific set of the Javascript ecosystem, **medium to large scale web applications**. It assumes that you are familiar with [modern build flows][build-post] and you have a strong stomach.

If you are on the go, just skip to [the take-aways](#the_take_aways), otherwise buckle up, it's gonna be a rough ride.

## Working With Namespaces in Javascript

Namespacing in Javascript is achieved by defining properties on the Global Object, in browsers that is the `window` object. Every `var` declaration performed in the global context will create the variable under the `window` object, making it available globally.

{% highlight javascript %}
var one = 1;

window.one === one; // true

function fn() {
  1 === one; // true
}
{% endhighlight %}

Developing using the namespacing pattern implies that you take advantage of this feature and create a single huge object that contains all the parts of your application.


{% highlight javascript %}
var myApp = {};

myApp.models = {};
myApp.views = {};
myApp.helpers = {};
myApp.helpers.add = function(a, b) { return a + b; };
{% endhighlight %}

No need to dive more into advanced namespacing patterns, [Addy Osmani](http://addyosmani.com/) has done a wonderful job at that with the [Essential Javascript Namespacing Patterns](http://addyosmani.com/blog/essential-js-namespacing/) post. In conclusion, Addy iterates the most powerful aspect of using namespaces:

> IIFEs and single global variables may work fine for applications in the small to medium range, however, larger codebases requiring both namespaces and deep sub-namespaces require a succinct solution that promotes readability and scales. I feel this pattern achieves all of these objectives well.

## Debugging Using Namespaces

Development with namespacing patterns enables you to observe any part of your code from your Browser's console.

![console-autocomplete][]
![console-object][]

This simple fact provides you with very powerful debugging capabilities. During development, making an effort to *encapsulate* your code in <abbr title="Immediately-Invoked Function Expression">IIFE</abbr>'s and forego of the javascript console is something that I never understood. Even when I am forced to develop using CJS or AMD patterns I take extra care to expose everything, even private variables and methods, so I can easily unit test them and observe how they evolve in their lifetime.

> I don't want to expose the internal methods and variables!

Sure! Your development environment, has nothing to do with how your application will eventually be served to the end-client. You can feel free to expose everything during development and be rest assured that you won't be *exposed*. After your application is built, add one more simple step to wrap your bundled code in an <abbr title="Immediately-Invoked Function Expression">IIFE</abbr>, whoop nothing exposed!

{% highlight javascript %}
(function(){<%=application%>}).call(this);
{% endhighlight %}

> *Update*, just found out about [this cool DevTools video](http://discover-devtools.codeschool.com/levels/3/challenges/7), examining exceptions on the console. A deep look into how to leverage the Javascript Console of your browser.

## Testing Using Namespaces

No one can argue against testing your code. Quite the contrary actually, we have been blessed with so many testing suites and tools that it's like living in heaven! There are all sorts of test types and diving into them is beyond the scope of this article. I will however pick two distinct types that I find to serve a specific and very useful role, TDD and BDD tests.

I perceive Behavioral Driven Development (BDD) as the kind of tests that will run against your development **and** your production code. They examine the API or functionality that is exported using any means possible (faking DOM elements, mocking, stubbing, etc).

Test Driven Development (TDD) or Unit Tests run **only** against your development code. They test components and parts of your application that are not exposed and most typically are the core building blocks of your app. Unit testing requires a very isolated environment so they can test the smallest possible unit of your code. Achieving that isolation is the most challenging part of testing.

A challenge that namespaces have absolutely no problem with.

{% highlight javascript %}
// store the original method to a temp var
var realIsAuthed = ss.user.isAuthed;

// stub the method so it will return always true
ss.user.isAuthed = function() { return true; };

// restore the original method
ss.user.usAuthed = realIsAuthed;

// win
{% endhighlight %}

Performing the same with the AMD pattern can prove quite a challenging task. [Jamison Dance](http://jamisondance.com/) makes a very good job at describing what your options are for testing AMD modules in [this Jul 2012 post](http://jamisondance.com/2012/7/27/mocking-dependencies-for-unit-testing-with-require-js/), following up on that [here is a comment that gives the state on Feb 2013](http://thanpol.as/javascript/why-i-dont-like-amd-and-what-i-will-do-about-it/#comment-787464206).

## Third-Party Requirements

Every third-party library exposes its API through a global variable. So requiring those libraries is as simple as referencing their namespace, ie `jQuery`. To my disappointment, there is a [notion between edge developers](https://groups.google.com/forum/?fromgroups=#!topic/cujojs/Y_9lwezzHgQ) to let go of the Global namespace alltogether and only expose the API of their libraries by using the [Universal Module Definition][umd]. You can easily tackle these unfortunate situations by creating a thin *module definition*:

{% highlight javascript %}
window.define = function(factory) {
  delete window.define;
  window.hardNutLibrary = factory();
};
{% endhighlight %}

## Namespacing Verbosity

Admittedly, the biggest pain when working with namespaces is the verbosity. Typing `myApp.user.auth.plugin.twitter.isAuthed();` is not so sexy. The solution to this problem is shortcut assignment. While the exact implementation can vary, what you can do is shortcut assign frequently used parts of your code to more convenient namespaces:

{% highlight javascript %}
myApp.twAuthed = myApp.user.auth.plugin.twitter.isAuthed;
{% endhighlight %}



## Myths, Drugs and Hypesteria

Let's debunk a few myths, you will get annoyed, it will be fun.

### Modules, Common and Asynchronous

Wrapping your code in a *Module Definition Pattern* does not mean your code is modular. On the other side, writing modular code does not require that you use CJS or AMD. Writing modular code has nothing to do with your underlying *module* system, it has to do with applying [Modular Programming][] patterns when developing. The fact that *Modular Programming* in Javascript suggests that you use CJS or AMD is the result of an unfortunate misnomer and poor handling of the community.

> Modular programming is a software design technique that emphasizes separating the functionality of a program into independent, interchangeable modules, such that each contains everything necessary to execute only one aspect of the desired functionality. [1][modular programming]

There has been a huge misunderstanding about what modules are, what is modular programming and what a *module loader* is. It is sad but true, but in the JS community, the words *file* and *module* have become a  synonym.

### Modular Code !== Module Definition

Let's recap,

* Writing Modular Code does not require that you use any Module Definition Pattern, CJS or AMD (or even [harmony][] for that matter).
* Module (file) loading is something that you only need during development. In production your codebase goes through a build process that bundles and minifies your code into a single pact file, the [Built-Module][].
* Every third-party library you consume can come in any possible format (AMD, CJS, Namespace) and you will consume it nonetheless.
* You will also include any third-party dependencies in your production bundle file.

Sooo, why do our visitors need an extra stack (AMD) being transported over the wire? Well, it's all about the convenience of File (module) loading while developing. If it wasn't for the loader's functionality, it wouldn't make much sense to use any Module Definition Pattern in web development.

One could argue that you may want to lazy-load [Built-Modules][Built-Module] on production. Yes. **That-is-what-module-loading-actually-is**. If and when you reach to that set of problems, you will soon realize that the *Module Loading* part is the least of your concerns.

**Update** (10/Jun/13): just posted an extensive article, revisiting the concept of [Modular Programming in Javascript][modular-programming]. I strongly suggest you take a look if modular development is your thing.

### Global Namespace Pollution

> namespaces are so 2005  – AMD modules (RequireJS, curl.js, etc) solves the global conflicts and also helps to keep the code organized into small reusable blocks

The *global namespace pollution* scare is the most hilarious of them all. It is exactly like the stories our moms told us that strangers will put drugs in our drinks to get us addicted and then we'll end up being crack-whores. In the same night.

Seriously now, when was the last time you ever had a namespace collision problem? Think really hard when this happened. If it ever happened and how much time it took you to find out about it and resolve it. I dare say that I never had such an incident. Should such an incident ever appear, the problem would be so obvious that it would require no more than 10 minutes to resolve.

Now please take a moment to consider the moments you found yourself in frustration using AMD on the browser. How much time did you spent to consider yourself an expert? Is your web development workflow flowing effortlessly? Or do you have to deal with an occasional AMD mishap every now and then? Really, take a moment on this and draw your own conclusions.

[![took our jobs][]](http://www.youtube.com/watch?v=768h3Tz4Qik)

### Modules Are The Future Of Javascript

> ES6 will support modules!

Yes. It will and it will be awesome! But again, don't confuse *files* with *modules*. At the end of the day, you will bundle and minify your library one way or another. You library will become a [Built-Module][] to be consumed by other libraries or served as the end product to the end-consumer. What your library ends up exposing as a whole has nothing to do with how your library is structured.

### It is either Modules or Namespaces

Actually no. That's not true for either. There is nothing stopping you from declaring a global variable within a Module Definition. It definitely is not advised, but it happens. I have seen it in every large setup (i.e. a company's codebase). On the other hand using Namespaces does not prevent you from exporting your API via a Module Definition. [UMD][] does a very good job at that to use as boilerplate for your library.

## The Take Aways

These are the take-aways from this article...

* Modern day build flows provide the developers with unprecedented freedom and power.
* The development environment is decoupled from production.
* Module Definition Patterns and *Module* loading are two different things.
* Modules !== Files
* Modular Programming is not a trademark of AMD, CJS or any Module Definition Pattern.
* Developing using Namespaces will greatly enhance your productivity, maintainability and scalability.
* Namespaced applications and libraries are easier to test and debug.

Now you can eat me.

[Modular Programming]: https://en.wikipedia.org/wiki/Modular_programming "Modular Programming on wikipedia"
[harmony]: http://wiki.ecmascript.org/doku.php?id=harmony:modules "Harmony Modules"
[console-autocomplete]: /assets/blogimg/js-console-autocomplete.png
[console-object]: /assets/blogimg/js-console-object-print.png
[took our jobs]: /assets/blogimg/took-our-jobs.gif "They took our jobs"
[umd]: https://github.com/umdjs/umd#readme "Universal Module Definition"
[build-post]: http://alexsexton.com/blog/2013/03/deploying-javascript-applications/ "Deploying JavaScript Applications"
[alex sexton]: http://alexsexton.com/ "Alex Sexton"
[modular-programming]: /javascript/writing-modular-javascript-rewind "Writing Modular Javascript REWIND"
[Built-Module]: /javascript/writing-modular-javascript-rewind#the_builtmodule "Writing Modular Javascript REWIND - Definition of a built-module"
