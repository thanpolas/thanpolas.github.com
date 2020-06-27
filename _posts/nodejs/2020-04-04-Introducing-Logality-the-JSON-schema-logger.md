---
layout: post
title: "Why Logs are Important, Introducing Logality"
description: ""
category: nodejs
tags : [nodejs, node, logging, json]
image: "/assets/blogimg/planning.jpg"
---

{% include JB/setup %}

Having your application produce the right amount and quality of logs will help you debug faster, optimize better and keep your data safe and secure. I was always fascinated with logging and tried to figure out the best ways to log and create telemetry for my applications.

Having the opportunity to work with multiple startups, I came into close contact with all of Node.js' major logging packages. Lately, I had the luck to work with highly security aware businesses, for whom security is an existential threat. When tasked with the challenge of creating secure applications for them, I knew without hesitation that I had to create a new library to meet all the new requirements that were at play.

## The Logging Requirements

These are the logging requirements that justified creating a new library for logging, I could find some of them in some packages, but not all of them in one package:

* [**Complete Flexibility on Properties**](#a-common-logging-schema) In order for my organization to have a common logging schema, it is required of the logging library to allow the definition of properties from scratch. A lot of the packages make those decisions for you leaving you with no options to normalize the logging schema. The most common example for this is the date field, you can find it as `dt`, `date`, `timestamp` or any other variance, without any option to change the name.
* [**Support Custom Outputs**](#custom-output-and-pretty-print) Default output should be JSON but the library should not limit you as to the kind of output you want, for instance print human readable logs while on development.
* [**Logging Metadata**](#logging-metadata) Automatically log location of file that the log originated from and other useful system information (OS version, runtime info, etc).
* [**Middleware Support**](#the-power-of-middleware) Supporting middleware is a very powerful way to transform and augment each one of your log messages. The options that this feature opens up are endless. Middleware also have the power of filtering so you can suppress dynamically certain log messages.
* [**Logging for Libraries**](#linking-multiple-logality-instances) All open source contributors must have faced this challenge at least once: How do I output logs from my library? This is no easy task, Logality provides an eloquent and powerful solution to this problem.

With these requirements in place, [Logality][logality] was created on May 18, 2018. Ever since then the library has been improving and bug fixed iteratively up to the current Version 3.0.0 that was released back in this April. In the following sections, we will go through a more detailed analysis of the features and powerful capabilities of Logality.

## A Common Logging Schema

The more standardized your log messages are, the easier it will be to query, parse and subsequently analyze them. Consequently, your log messages need to have a schema. As we all know, the most ubiquitous format for text based serialization today, is JSON.

Logality is a JSON logger that provides an initial recommendation of a logging schema but allows you to define your own schemas down to the last property.

This is a very important feature. As when you are trying to have a common logging schema across multiple operating systems, platforms and programming languages it is essential that your tooling allows you to be flexible and versatile.

Schema mutation in Logality happens through Middleware and Serializers, both of which we touch on below.

## Logging Metadata

Logality will take care of all your metadata needs so you won't need to log any additional information. In particular, Logality will automatically resolve and log for you:

* The location of the file where the log originated from.
* The hostname of the machine that runs the application.
* The process id.
* The process name.

A simple `log.info('hello world')` log will produce the following log message:

```json
{
    "severity": 6,
    "level": "info",
    "dt": "2018-05-18T16:25:57.815Z",
    "message": "hello world",
    "event": {},
    "context": {
        "runtime": {
            "application": "testLogality"
        },
        "source": {
          "file_name": "/test/spec/surface.test.js"
        },
        "system": {
            "hostname": "localhost",
            "pid": 36255,
            "process_name": "node ."
        }
    }
}
```

## Serializers of Data Objects

As standardization of logging data is a primary requirement for Logality, serializers were introduced to solve the problem of consistently logging known data objects.

Let's take for example the User Data Object (UDO) and the action of logging in, you could log the event as:

```js
log.info(`User ${user.email} logged in`);
```

But that is not a JSON log message, that is a string log message and it is not easily query-able. Let's try this again with Logality's JSON logging feature:

```js
log.info('User logged in', {user});
```

Now we passed the UDO to logality, however, Logality has no instruction of what portions of the UDO we want logged and here is where serializers come in. Serializers are simple functions that take the objects that you pass as input and output the properties that you want to have logged.

This way, you standardize how your models are logged across your infrastructure and protect your system from logging sensitive fields like a user's password or unnecessary information like meta data of a product.

## The Power of Middleware

Logality introduces middleware which allows you to manipulate and mutate the logging messages as you see fit:

```js
logality.use((context) => {
    // Remove user data object from logging
    delete context.user;

    // Add debugging flag on all messages
    context.debug = 1;
});
```

## Linking Multiple Logality Instances

As an open source contributor, one of the biggest problems I have been challenged with is how to log on open source libraries. If you want to have logging on your library you are challenged with quite a few problems:

* Provide an option to turn off logging.
* Provide a way to filter the logging level.
* How do you format the logs according to your downstream application's standards?
* Should you log to stdout, an event or a function?

These are very challenging problems, to the point where no practical solution exists. Until today that is, as Logality introduces piping. You can pipe one Logality instance into another and have all the middleware functions handle the piped logality's log messages.

This is huge as it enables your application to granularly control how much information is logged from the libraries you are using. And at the same time have your third-party libraries log in the exact same format-schema that your entire infrastructure is logging. Isn't that great?

Piping happens simply by providing the child Logality instance to the parent's `pipe()` method:

```js
const thirdPartyLibrary = require('thirdparty');

/* ... */

applicationLogality.pipe(thirdPartyLibrary.logality);
```

## Custom Output and Pretty Print

Finally, after all the processing the log message has gone through, you can control how the final serialization and output is handled. By default Logality will JSON serialize and output to stdout but you may have other plans.

Logality also offers a built-in pretty print functionality that, as the word suggests, will print the log messages in a human readable format, with nice colors, emojis and all. This is particularly useful when you are developing the application and don't want to see JSON serialized log messages.

### Outline of Logality's Lifecycle and Piping

![Logality Lifecycle Outline](/assets/blogimg/logality-lifecycle-outline.svg)

## Synchronous or Asynchronous?

With a flick of a switch you can have Logality become asynchronous and reveal its Promise API. When in async mode, Logality's Middleware and Custom Output functions will be able to handle a promise and allow you to capture log messages en-route.

Say you want to push all log messages to a queue, or for any reason, you want to store some, or all, of the log messages into your database. By enabling async mode on Logality you can easily and safely perform those tasks:

```js
// Security middleware for logality, store the log message
// in our database as well and send it to our queue for
// further processing and alerting
logality.use(async (context) => {
    if (context.security) {
        await db.store(context);
        await queue.send(context);
    }
});

/* ... */

// login failed, log it
await log.warn('Login Failed', {security: true});
```

As you rightfully observed, when async mode is enabled Logality's logging is, well, async, and thus returns a promise that needs to be resolved. Therefore, that is why you see the `await` before the `log.warn()` invocation.

Personally, my use case for using async mode and secondary data stores [at SROP][srop] was for auditing log trails. When an audit log event occurred, say a user logged in, the log is flagged as "audit" and Logality, using a middleware, knows to store it in a database accessible by the application. That way the users of the application can review their audit trail while at the same time have the event logged at our logging infrastructure.

## Conclusion, Putting it all Together

Logality offers some novel concepts in logging that when combined can produce very powerful outcomes. Enabling open source authors to have logs on their libraries is one of them.

Another one are the built-in and custom serializers. Logality comes with a set of built-in serializers to give you a head-start. For example the Express serializer accepts an Express Request data object and provides a useful, minimal output:

```json
    "event":{
        "http_request": {
            "headers": {},
            "host": "localhost",
            "method": "GET",
            "path": "/",
            "query_string": "",
            "scheme": "http"
        }
    }
```

The options are limitless, this is just the beginning. Please share with me your thoughts, ideas and implementations of Logality.


[logality]: https://github.com/thanpolas/logality
[srop]: https://srop.co "SROP The Secure Drop"
