---
layout: post
title: "Passing Data From Server To Javascript On Page Load"
description: "Passing arbitrary data from the server to the client on page load is an essential function of modern, rich client-side applications. Over my course in various projects I've seen all kinds of setups and use cases, here is the gist of my experience."
category : javascript
tags : [javascript, server2js, data objects]
shortUrl: http://than.pol.as/MFQc
---
{% include JB/setup %}

Passing arbitrary data from the server to the client on page load is an essential function of modern, rich client-side applications. Over my course in various projects I've seen all kinds of setups and use cases, here is the gist of my experience.

## Why Do We Need To Pass Data From The Server?

The front-end, Javascript Application, has no state. It does not know if the current visitor is authenticated, if a special operation has to be performed or keep track  of any significant historical data (e.g. how many pageviews have been performed by the visitor). While there are hints or alternate ways to have some kind of state (cookies, local storage) the complete picture is kept at the back-end.

Imagine you want to show a modal window on every new user of your site to welcome him / her. The whole functionality of this operation exists in your Javascript Application but you need to trigger it somehow. Who you gonna call?

This is just one example of why a "*channel*" of communication between your back-end infrastructure and your JS App is required.

Trying to explain this concept to people, I often get asked "*Why not make an AJAX call?*". The most obvious reason is time. It would take an enormous amount of time for the page to fully load, the JS application to initialize, make the AJAX call, wait for the response and then execute the payload of the response.

Why suffer this penalty when at page-load the server already knows the answer and is also a given certainty that the client will make the question. The less obvious reason is that from a REST API perspective, how would you name that call? `/computah/tell/me/what/i/need/to/know`?

## How To Pass Data From The Server

There are many ways to perform that task. The most simple being to create an Object Literal in the global context which will then be parsed by your JS App.

{% highlight html %}
<script>
  var GLOBAL = {
    isAuthenticated: false
  };
</script>
<script type="text/javascript" src="ourApplication.js"></script>
{% endhighlight %}

On the back-end you need to have an entity that will perform two main functions:

1. **Accept data from anywhere**. From any part in the execution flow you need to pass data to the JS Application, you should be able to do so fast and easily. e.g. `client.data.set(key, value)`.
2. **Output the stored data in proper format**. When rendering the template to serve to the visitor you should call the output method of the entity to get a proper output for all the stored data. e.g. `client.data.output()` should output the `script` tags along with the JS Object Literal that contains the data. Take special care if you are aggressively cache the templates and or whole pages.

## How To Structure The Passed Data

Creating a large Object Literal is one way to go, but it will not get you far. Let's see why...

It is generally advisable to create a "*receptor*" entity on the JS Application too. You want to avoid every part of your JS code accessing the global object (`GLOBAL`). Here is why:

### Why A Receptor Is Required

If your application is rather large, it will be difficult, if not impossible, to accurately control the order of accessing the passed data from the server. And order matters. For example if one of the information you pass to your JS App has to do with the environment (Devel, Staging, Live), you want this information to get passed as soon as possible, earlier than any other data that may exist in the Object.

As your application grows, the order of execution can become critical  in ways you cannot predict right from the start.

Another reason you need a *Receptor* mechanism is to control the protocol of communication between the server and the JS App. As you application grows, so are your needs; and thus more sophisticated mechanisms are required. You need to have the proper abstractions in place so you can easily serve your needs as they evolve.

### Ok, So How Should The Passed Data Be Structured?

Having a *Receptor* mechanism implies that each key in the passed data object will execute some code that will parse the data and make sense of it. Therefore it is safe to say that each key is essentially **an operation** waiting to happen.

There will be cases where such an *operation* may need to be invoked more than one times. For example if you are feeding your JS App with i18n data, you want to pass the default / core language pack and then the more specific to the current page lang pack.

All things considered an Array is a good way to go. An array containing Object Literals with two static keys: `op` and `val`. `op` stands for Operation and `val` for value, any value:

{% highlight html %}
<script>
  var GLOBAL = [
    {op: 'isAuthenticated', val: false},
    {op: 'environment',     val: 'LIVE'},
    {op: 'langPack',        val: {/* Huge object */}}
    {op: 'langPack',        val: {/* Additional page specific */}}
  ];
</script>
<script type="text/javascript" src="ourApplication.js"></script>
{% endhighlight %}

## Accessing The Passed Data From Javascript

Assuming we have a "*Receptor*" in place there are two ways we can architect how this engine behaves.

1. Pushing all the logic and payload inside the *Receptor* engine so that it knows what to do with each *Operation* passed and when to do it.
2. Have the *Receptor* be agnostic of the *Operation's* context and plainly accept callbacks for each operation.

I know you are already sold for solution 2, no need to debate that.

So the *Receptor* engine should allow for external parts of the JS App to *hook* to specific *Operations*. And it should also account for the order of which these hooks are executed. This means the internal *Receptor's* API should look like this:

{% highlight javascript %}
app.receptor.hook(operation, callback, priority);
{% endhighlight %}

## How To Tie Everything Up

As we've seen in a past post ["You Don't Need the DOM Ready Event"][ready.post] and the order that you position your elements is of paramount importance. Therefore the best way to go with tying everything up is:

1. Define the global array
2. Load your JS Application
3. As the App evaluates, assign all the hooks to the *Receptor*
4. After your App has finished evaluating, give the *Receptor* engine the go ahead and run the hooks.


{% highlight html %}
<script type="text/javascript">
  var GLOBAL = [{op: 'isAuthenticated', val: false}];
</script>
<script type="text/javascript" src="ourApplication.js"></script>
<script type="text/javascript">
  // run the hooks
  app.receptor.runHooks();
</script>
{% endhighlight %}

## Anything Ready Out There?

I got your backs!

&lt;shamelessplug&gt;

[Server 2 JS][server2js] is a library created exactly for this purpose. At a ridiculous ~800bytes you get all the described functionality and more (*Ready option*, *Garbage Collection*).

If you are working on a new project, give it a try, it's well worth its weight in bytes ;)

 &lt;/shamelessplug&gt;

[ready.post]: http://thanpol.as/javascript/you-dont-need-dom-ready/ "thanpolas blog :: You Don't Need the DOM Ready Event"
[server2js]: https://github.com/thanpolas/server2js "thanpolas server2js library"

