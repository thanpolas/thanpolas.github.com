---
layout: post
title: "Introducing cip Classical Inheritance Pattern at its best"
description: "Cip is a robust and compact library for applying natural inheritance to your applications."
category : javascript
tags : [javascript, nodejs, node, prototypal, inheritance, pseudo-classical]
shortUrl: http://than.pol.as/TnOi
---
{% include JB/setup %}

It's been a very long time i've been trying to tackle the boilerplate required by the pseudo-classical inheritance pattern in Javascript. Another very important goal was to lower the amount of experience required to consume the libraries i author. I am a great fan of prototypal inheritance and wanted to have an inheritance library that implements `extend()`, `mixin()` and does not compromise on any of the principals of the pseudo-classical inheritance pattern, none at all.

[Cip](https://github.com/thanpolas/cip) is a big step towards bundling the Classical pattern wholesale and offering a compact, robust and small library that will help us apply sophisticated inheritance patterns throughout our projects.

<iframe src="http://ghbtns.com/github-btn.html?user=thanpolas&repo=cip&type=watch&count=true&size=large" allowtransparency="true" frameborder="0" scrolling="0" width="160" height="60"></iframe>

> Update *17 Feb 2014*, The library was originally named `inher`, didn't like it, changed to `cip`.

## The Pseudo-Classical Pattern

There are many variants of Pseudo-Classical pattern implementations, we won't get into the fine grained details of how it actually happens, it will suffice to demonstrate how the pattern is applied in the Node.js environment, using the language library `util`.

{% highlight javascript %}
var util = require('util');

// create our Base constructor
var Base = function(a) {
  this.a = 1;
};

// add a prototype method
Base.prototype.add = function() {
  this.a++;
};

/* ... */

// An ancestor of Base constructor
var ChildBase = function(b) {
  // we have to invoke the Base consturctor with the current context.
  Base.apply(this, arguments);

  this.b = b;
};
// here is where inheritance happens
util.inherits(ChildBase, Base);

/* ... */

// instantiation
var childBase = new ChildBase(1);
// JS keyword instanceof works
childBase instanceof ChildBase; // true
childBase instanceof Base; // true
childBase.add();
childBase.a; // value will be 2
{% endhighlight %}

So that's the pattern in a nutshell, that's too much boilerplate to apply the inheritance pattern, we have to require the `util` library, we have to properly invoke the parent constructor (minding the right amount of arguments passed), and then apply the actual inheritance using `util.inherits()`. What if we could pack all these operations in a single function? Meet Cip.

## Working with Cip

Cip's first class citizen is the `extend()` method. It will perform the same exact operations as pseudo-classical and apply the inheritance pattern with just a one liner. Here's how the same example would be authored using Cip.


{% highlight javascript %}
var cip = require('cip');

// create our Base constructor
var Base = cip.extend(function(a) {
  this.a = 1;
});

// add a prototype method
Base.prototype.add = function() {
  this.a++;
};

/* ... */

// An ancestor of Base constructor
var ChildBase = Base.extend(function(b) {
  this.b = b;
});

/* ... */

// instantiation
var childBase = new ChildBase(1);
// JS keyword instanceof works
childBase instanceof ChildBase; // true
childBase instanceof Base; // true
childBase.add();
childBase.a; // value will be 2
{% endhighlight %}

You notice that the result is exactly the same, we tossed the `util` library and the `inherits()` declaration, and we tossed the Parent Constructor invocation in the `ChildBase` constructor. Passed arguments also work as expected and populate throughout the inheritance chain.

## What extend() does

The `extend()` function is a *Static* function assigned directly on the Constructor. When invoked it will create a new Constructor that encapsulates your provided constructor, or use a noop if none is defined. After applying the Classical Inheritance Pattern, `extend()` will copy all the inheritance *Static* functions to the new constructor so itself will be able to perform `extend()` and all the other functions we'll see in a very while.

This enables you to perform infinite inheritance using the tools provided, this is a valid statement:

{% highlight javascript %}
var GreatGreatGrandChild = cip.extend().extend().extend().extend();
{% endhighlight %}

## Mixing in different Constructors

Mixins, the forbidden fruit. Mixins enables us to borrow the prototypal methods of another Constructor and use them as our own in our Constructor. To create a mixin using the tools at hand (node's `util` library) one would have to do this, copying the example above:

{% highlight javascript %}
var util = require('util');

// create our Base constructor
var Base = function(a) {
  this.a = 1;
};

/* ... */

var CtorMixin = function(c) {
  this.c = c;
};
CtorMixin.prototype.addition = function(a, b) {return a + b};

/* ... */

// Our constructor
var ChildBase = function(b) {
  // we have to invoke the Base consturctor with the current context.
  Base.apply(this, arguments);

  // We now also have to invoke the Mixin constructor!
  CtorMixin.apply(this, arguments);

  this.b = b;
};
// here is where inheritance happens
util.inherits(ChildBase, Base);

// to add the mixin prototype methods we can no longer
// use util.inherits, we have to use an assignment method instead
_.assign(ChildBase.prototype, CtorMixin.prototype);
{% endhighlight %}

You can see how the plot thickens here, hopefully Cip has you covered and provides a convenience method that performs the same exact operations. Meet `mixin()`! The `mixin()` method accepts any number of arguments, as long as they are of type Function, or an Array of Functions, all representing Constructors.

{% highlight javascript %}
var ChildBase = Base.extend(function(b) {
  this.b = b;
});
// add the mixin
ChildBase.mixin(MixinCtor);

// add any number of mixins
ChildBase.mixin(MixinOne, MixinTwo, MixinThree);
{% endhighlight %}

Mixins have never been easier to apply. One might wonder what happens with the arguments the Constructors expect, and you will be right on the money, passing arguments down the inheritance chain is one of the tedious tasks you have to perform, taking care what argument is passed to what constructor. Cip abstracts that away from you and provides every constructor, either it be a Parent or a Mixin, with the same arguments that were passed on instantiation.

{% highlight javascript %}
var childBase = new ChildBase(2);
{% endhighlight %}

The argument `2` will get passed on to the Parent Constructor (`Base`) and all the parents there might be, and every Mixin we defined (MixinOne, MixinTwo...) and all their respective parents! So you have to mindful of how many arguments your Constructor accepts, or in other words, the arity.

Now not all is lost! Cip gotz your back one more time, introducing the Stubbed Arguments!

## Stubbed Arguments

Argument Stubbing is providing arguments to the `extend()` function with the intend of passing them to the Parent constructor. Consider this case:

##### base.model.js

{% highlight javascript %}
var Model = cip.extend(function(name) {
  this._modelName = name;
});

Model.prototype.getName = function() {
  return this._modelName;
};
{% endhighlight %}

##### user.model.js

{% highlight javascript %}
var Model = require('./base.model');

// "user" is a stubbed argument, it will be passed to the
// Model Constructor as the first argument.
var UserModel = Model.extend('user', function(firstName, lastName){
  this.firstName = firstName;
  this.lastName = lastName;
});

var user = new UserModel('John', 'Doe');
console.log(user.getName());
// prints "user"
{% endhighlight %}

Argument Stubbing can be infinitely nested and inherited, Inher keeps track of each Constructor's Stubbed Arguments and applies them no matter how long the inheritance chain is. The same principle applies to Constructors that were used as Mixins. Aint this cool? Stubbed Arguments can also be composed over multiple ancestors, check this out:

{% highlight javascript %}
var Thing = inher.extend(function(a, b, c) {
  this.a = a;
  this.b = b;
  this.c = c;
})

// ...

var BadAss = Thing.extend(1).extend(2).extend(3);

var badAss = new BadAss();
badAss.a === 1; // true
badAss.b === 2; // true
badAss.c === 3; // true

{% endhighlight %}

## Working with Singletons

A Singleton is a single instance of a constructor, that is used in every occasion throughout the application's lifetime. The singleton pattern requires a method for easily fetching that single instance and dictates a few other details that are beyond our scope here. Singletons are particularly useful for core components of our Application, Models, Controllers, Views, Routers, these are components that we need to instantiate once per runtime. Cip will create a Singleton Constructor with `extendSingleton()`. This explicit statement allows for better clarity and will hopefully save you from some common pitfalls.

{% highlight javascript %}
var Model = require('./base.model');

var UserModel = Model.extendSingleton();

/* ... */

var user = new UserModel.getInstance();
{% endhighlight %}

No matter where in the code we invoke `UserModel.getInstance()` we will always get the same exact instance. If you are using Static methods and properties on your constructor, like an enumeration you will find this pattern of requiring particularly useful:

{% highlight javascript %}
var UserModel = require('./models/user.model');
var userModel = UserModel.getInstance();


var user = userModel.create(
  name: 'BOFH'
  type: UserModel.Type.ADMIN,
);
{% endhighlight %}

Notice the use of the `UserModel.Type`, that's an enum defined statically on the UserModel constructor.

## How Cip plays nice with everyone

So far so good, but as you might have suspected, the inheritance chain always ends at the Cip's base class. That's not required. Using the `cast()` method you can augment any vanilla constructor with Cip's properties and functions:

{% highlight javascript %}
// Use EventEmitter as the base Constructor.
var EventEmitter = require('events').EventEmitter;
var cip = require('cip');

var CeventEmitter = cip.cast(EventEmitter);

var Thing = CeventEmitter.extend();

var newThing = new Thing();

newThing instanceof CEventEmitter; // true
newThing instanceof EventEmitter; // true
{% endhighlight %}

Ta-dahhhh! Now all your ancestors will inherit the EventEmitter properties and methods. Plain simple, effective, works.

Hope you like it, let me know if you find it useful.

