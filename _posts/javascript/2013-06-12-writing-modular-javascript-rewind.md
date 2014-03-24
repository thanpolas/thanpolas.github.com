---
layout: post
title: "Writing Modular Javascript REWIND"
description: "The Module term in Javascript, has been overstretched to the point where it's ambiguous. The primary reason for that is because of Module Definition Patterns and the torrent of 'Write Modular Javascript using AMD' blog posts. Let's put that claims aside for a moment and revisit the definition of what is a Module and what is a Modular Application or Library, in javascript, for the first time."
category : javascript
tags : [javascript, module loaders, modular code, amd, modules, commonjs, modular programming, mantri]
shortUrl: http://than.pol.as/Palc
reddit: http://www.reddit.com/r/javascript/comments/1g6qmv/writing_modular_javascript_rewind/
---
{% include JB/setup %}

The *Module* term in Javascript, has been wildly overstretched and abused to the point where it's ambiguous. The primary reason for that is because of Module Definition Patterns and the torrent of *"Write Modular Javascript using AMD"* blog posts. Let's put that claims aside for a moment and revisit the definition of what is a Module and what is a Modular Application or Library, in javascript, for the first time.

Using advanced and complex build flows we can now create multiple built-parts and perform some interesting optimizations. This Javascript specific trait changes everything. In this article we will go through the benefits of such a practice and what it means for the *Modularity* of your application.

![Southpark modules](/assets/blogimg/southpark-modules.jpg)

## Glossary Of This Article

I'll need to refine a few of the commonly used terms, so this article stands a chance of making sense...

### Modules

A module is a set of functionality, information or structures. What is considered a *module* though, can vastly vary among developers. It is safe to say that a *module* is an abstract way of describing reusable functionality. In the same spirit, It is safe to say that a module can span through a number of files. Or several modules can be defined in one file, or a module can be in a single file.

What cannot be claimed however, is that every file is a module. That, is one of the biggest misconceptions in Javascript Development. The other notion is that using any type of Module Definition Pattern auto-magically makes your code modular, it doesn't.

Let's entertain ourselves a bit. Consider these two files, i'll use CommonJS just to give them the *Modular* scent:

##### Module `addition.js`

{% highlight javascript %}

exports.do = function(a, b){ return a + b };

{% endhighlight %}

##### Module `subtraction.js`

{% highlight javascript %}

exports.do = function(a, b){ return a - b };

{% endhighlight %}

So, these are two modules right? But hey, we can combine them together:

##### Module `operations.js`

{% highlight javascript %}

var operations = module.exports = {};
operations.addition = function(a, b){ return a + b };
operations.subtraction = function(a, b){ return a - b };

{% endhighlight %}

So now we have a new module that includes the functionality of both the `addition` and `subtraction` module. Is this a file that contains two modules? Is this a single module? What i am trying to illustrate here is that a module, is really an abstract term and not something specific and absolute.

Having said that, i'll buy into the general notion that a module is represented by a file in hopes of getting my other messages through, the *Built-Module* and what a modular application or library really is.

### The Built-Module

Another unique factor in Javascript applications and libraries is the *Build Operation*. It changes everything. The output of your build operation is also considered a module. To avoid the confusion when mentioning these types of Modules, we will refer to them as **Built-Modules**.

A [famous man once said](https://twitter.com/izs/status/315133438392954881):

> A "module" is a thing that can be require()'d. A "package" is a thing that can be npm'd.

A required()'d "package" is... a module, in the context of the requiring application, or to better elaborate, a **Built-Module**.

### Web Applications and Libraries

A web application is an actual website (i.e. facebook.com). it is consumed by the actual users.

A web library is a package that is intended only for web developers (i.e. jQuery). It is consumed by other libraries or applications. The term includes platform agnostic libraries, what we care about is that they work on the web.

### Modular Applications and Libraries

A modular web application, at its production state, will only load a small portion of the codebase, and then, at a later time, dynamically load the parts (built-modules) that are required. Using various techniques like eager or lazy loading.

A modular web library, at its published state, provides multiple bundles that include the whole library or parts of it. For example jQuery now offers a way [to create custom builds][jq build] with only the modules that you need. <s>Another example  of a Modular Library is [Modernizr][]</s>. **Edit** 3/24/14: [As it turns out](https://github.com/Modernizr/Modernizr/issues/1276) [Modernizr][] isn't a Modular applications. There are two ways a Modular Library can be consumed:

1. Consume from source, which is only possible if the same Dependency System is used.
2. Consume using the provided *built-modules*.

The second case, is what actually happens in reality, no matter the underlying Dependency System. It is what we call *Vendor Libraries* and handle them as third-party dependencies that follow a separate flow in our build process.

That is the reason why if your library is to be considered *Modular*, it has to provide multiple *Built-Modules* which offer the whole or parts of functionality.

> The secret to building large apps is never build them. Break them into smaller pieces then assemble into your big app. [@justinbmeyer, 2010](https://twitter.com/justinbmeyer)

### Packages

When developing a Library for the web, you publish Packages. A Package is the final end-product and is typically produced by a build operation. Modular Applications can have a single package containing multiple built-modules or provide multiple Packages.

## Patterns in Creating Modular Applications

There are primarily two ways to create a Modular Application, using Static or Dynamic Linking. Both ways assume that a core exists, which provides the foundational stack for your library, along with any utility functions or commonly used modules. If a core stack does not exist (i.e. Modernizr does not have a core module) then by default it belongs in the Dynamic Linking camp.

To better understand how Modularity can be performed, our sample application has the following Modules, names represend [namespaces]():

* `app` Is the bootstrap Module, essentially a file that only contains *require* statements, gluing all the independent modules together.
* `app.core` Is the core Module that is your Library's main stack, provides facilities that other *built-modules* can reuse to interact with each other.
* `app.utils` Is the Module that provides helper functions which are needed by all the *built-modules*.
* `app.moduleA` Is a Module that doubles both as a typical Module when in development, and as a *built-module* when it is built.
* `app.moduleB` Is another Module that has the same modular properties as *app.moduleA*.

### Static Linking

With *Static Linking* every build-module that is produced contains the core stack and helping libraries. In our case that would be 4 build targets that produce these four files:

* `app.min.js` Is a *built-module* that includes the `app.core` and `app.utils` Modules. Can be considered a Package.
* `app.modA.min.js` Is a *built-module* that includes the `app.core`, `app.utils` and `app.moduleA` Modules. Can be considered a Package.
* `app.modB.min.js` Is a *built-module* that includes the `app.core`, `app.utils` and `app.moduleB` Modules. Can be considered a Package.
* `app.full.min.js` Is a *built-module* that includes all the Modules. Can be considered a Package.

*Static Linking* dictates that you require for `app.utils` from `app.moduleA`:

{% highlight javascript %}
goog.provide('app.moduleA');

goog.require('app.utils');

/* ... */

app.utils.map(ar, fn);
{% endhighlight %}

### Dynamic Linking

With *Dynamic Linking*, every *built-module* is being built in isolation, without containing the *core* stack. In our case, this results in these three files:

* `app.core.min.js` Is a *built-module* that includes the `app.core` and `app.utils` Modules. Can be considered a package.
* `app.modA.min.js` Is a *built-module* that only includes the `app.moduleA` Module. It is not a package, it requires to be bundled with `app.core.min.js` in order to operate.
* `app.modB.min.js` Is a *built-module* that only includes the `app.moduleB` Module. It is not a package, it requires to be bundled with `app.core.min.js` in order to operate.

This pattern **does not allow** the `app.moduleA` Module to directly require `app.utils`, by convention. If `app.utils` was required by `app.moduleA` then the utils code would also exist in the `app.moduleA.min.js` file which would result in code duplication.

{% highlight javascript %}
goog.provide('app.moduleA');

// we DO NOT require `app.utils`

/* ... */

// we assume the app.utils.map function is already available
app.utils.map(ar, fn);

{% endhighlight %}

The *Dynamic Linking* pattern is like creating as many projects as are your *built-modules*. When using this pattern, you should think about how these separate projects will interact with each other and how they will perform in harmony as a whole. In our case, we have to make sure the utility functions that all the *built-modules* depend on, are properly exposed by the Core *built-module*.

*Dynamic Linking* is an advanced concept and requires a lot of effort and infrastructure. A typical use case for a Library is when it has several *built-modules* (10+) and needs to dynamically create Packages based on what the developer needs. Creating all possible combinations statically, would be impractical (~10^10). So what the library author does instead is produce 10 built-modules and concatenate them on demand on the Library's webpage. The built-modules are already built, so concatenation is as good as a build process.

Web applications can only use the *Dynamic Linking* pattern. The produced *built-modules* are expected to contain only a specific functionality and not the core stack. That's important, read it again please.

It is important to think through which Modular pattern you will follow when developing your library. The dilemma between *Static* or *Dynamic* linking can be rendered moot if you can afford the building stack on your webserver. In that case you can run the build operation at your webserver on-demand and produce custom packages. That however is not always possible, especially if your project's page is [hosted on Github][gh pages] or the build operation is very cpu and fs expensive (which is very common).

## Conclusions

In the early stages, *Static Linking* can be more appealing and enable faster development. *Require* statements are spread all over the app, creating an intertwined mesh of dependencies. When your codebase grows too large though, it can be a challenge to isolate *built-modules* and move to the *Dynamic Linking* pattern.

Authoring modular libraries or applications means that you make the effort to use the *Dynamic Linking* pattern. Enforcing isolation between the core and the various *built-modules*. That's what a modular library or application is.

[Modular Programming]: https://en.wikipedia.org/wiki/Modular_programming "Modular Programming on wikipedia"
[jq build]: https://github.com/jquery/jquery/blob/master/README.md#modules "jQuery Modules"
[modernizr]: http://modernizr.com/download/ "Modernizr - Front end development done right"
[gh pages]: http://pages.github.com/ "Github Pages"
[namespaces]: http://thanpol.as/javascript/development-using-namespaces "Development using namespaces"
