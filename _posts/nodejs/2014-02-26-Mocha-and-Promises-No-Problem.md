---
layout: post
title: "Mocha and Promises No Problem!"
description: "After a few itterations a pattern emerged that works for Mocha and Promises, or any test framework for that matter."
category : nodejs
tags : [nodejs, javascript, testing, mocha, promises]
shortUrl: http://than.pol.as/U7g0
---
{% include JB/setup %}

The [mocha + Promises issue][mocha issue] has been going strong for over 2 years now, [Domenic][] has authored a helper library that you can use, [Mocha As Promised][mocha promised]. But after a few itterations a pattern emerged that works for Mocha and Promises, or any test framework for that matter.

<script src="https://gist.github.com/thanpolas/8975350.js"></script>

What happens here is that you can perform all you assertions, and if any fail they will throw an error that will be cought by the error handler defined in the `.then(done, done)` part, second `done` being the error handler. The thrown error will naturally have an argument, the error, that will be piped to Mocha's `done` callback thus making the test fail with the proper error message.

If all assertions pass then the success callback will be invoked, the first `done` and the test will finish asynchronously.

For cases where you just want to test the successful invocation of a promise returning function, and function provides an argument when resolving, it will cause the test to fail as the argument will be passed to the `done` callback. To tackle that inconvenience stub the callback by parially applying null as the first argument.

{% highlight javascript %}
test('test case', function(done) {
  promise.method()
    .then(done.bind(null, null), done);
});
{% endhighlight %}

You're welcome.

[mocha issue]: https://github.com/visionmedia/mocha/pull/329
[domenic]: http://domenicdenicola.com/ "Domenic Denicola"
[mocha promised]: https://github.com/domenic/mocha-as-promised
