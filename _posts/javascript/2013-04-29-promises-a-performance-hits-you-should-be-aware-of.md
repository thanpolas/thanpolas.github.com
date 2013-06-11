---
layout: post
title: "Promises/A+ Performance Hits You Should Be Aware Of"
description: "The Promises/A+ specification is a fresh and very interesting way of dealing with the asynchronous nature of Javascript. It also provides a sensible way to deal with error handling and exceptions. In this article we will go through the performance hits you should be aware of and as a side-effect do a comparison between the two most popular Promises/A+ implementations, When and Q and how they compare to Async, the lowest abstraction you can get on asynchronicity."
category : javascript
tags : [javascript, promises, when.js, q, async]
reddit: http://www.reddit.com/r/javascript/comments/1dckp9/promisesa_performance_hits_you_should_be_aware_of/
shortUrl: http://than.pol.as/OeMA
---
{% include JB/setup %}


The [Promises/A+][promises] specification is a fresh and very interesting way of dealing with the asynchronous nature of Javascript. It also provides a sensible way to deal with error handling and exceptions. In this article we will go through the performance hits you should be aware of and as a side-effect do a comparison between the two most popular Promises/A+ implementations, [When][] and [Q][] and how they compare to [Async][], the lowest abstraction you can get on asynchronicity.

> If you are in a hurry, just skip to the [Conclusions](#conclusions).

## The Case

My motivation for looking deeper into the performance of Promises/A+ was a [Job Queuing system][kickq] i've been working on named *Kickq*. It is expected that the system will get hammered when used on production so stress testing was warranted. After stubbing all the database interactions, essentially making the operation of job creation synchronous, I was getting odd performance results.

The test was simple, create 500 jobs in a loop and measure how long it takes for all the jobs to finish.

The measurements were in the ~550ms range and my eyeballs started to roll. "That's a synchronous operation, it should finish in less than 3ms, WHAT THE????!?!". After taking a few moments to let it sip in the suspect was found, it was Promises. I used them as the only pattern to handle asynchronous ops and callbacks throughout the whole project. [Brian Cavalier][brian], one of the authors of When.js, helped me pinpoint the real culprit, it was the *tick*:

> **Promises/A+ Specification, Note 4.1** In practical terms, an implementation must use a mechanism such as setTimeout, setImmediate, or process.nextTick to ensure that onFulfilled and onRejected are not invoked in the same turn of the event loop as the call to then to which they are passed.

In other words, Promises, per the specification, must be resolved Asynchronously! That comes with a cost, a heavy one apparently.

In the process of studying performance I had to create a [performance library][profy], poor mans profiling. And a [benchmark test][perf-prom] for Promises/A+ implementations that's already used to optimize the future versions of [When][].

## Creating The Promises/A+ Benchmark

I tried to broaden the definition of the test case. If an application uses the Promises pattern as the only way to manage how the internal parts interact, we can make a few assumptions:

* There will be a series of promises chained together, representing the various operations that will be performed by your application.
* The *Deferred* Object is used on each link of the chain to control resolution and how the promise object is exposed.
* Throughout the whole chain of promises there can be operations that are actually synchronous, we will measure all cases.

The number of how many promises will be chained was arbitrarily chosen to be 7, it represents a mean call-stack of an average operation. Any app logic is stripped, we only measure how long it takes to resolve a chain of 7 promises:

{% highlight javascript %}
// "Prom" is your promises implementation.
// Must support the .defer() method.
app.promise = function(Prom) {
  var def = Prom.defer();
  var def2 = Prom.defer();
  // ... def3, def4...
  var def7 = Prom.defer();

  var getDef3 = function() { return def3.promise; };
  // ... chain chain ...
  var getDef7 = function() { return def7.promise; };

  // chain them
  def2.promise
    .then(getDef3)
    // ... chain chain ...
    .then(getDef7)
    .then(def.resolve);

  // in the first set of benchmarks, promises are resolved synchronously...
  def2.resolve();
  // def3.resolve ....
  def7.resolve();

  // in the second set of benchmarks, one of the promises is resolved async like so:
  setTimeout(def2.resolve);

  return def.promise;
};
{% endhighlight %}

> Find a snapshot of the actual app [in this commit](https://github.com/thanpolas/perf-promises/blob/27527b442eaed4b38f1fd8c8cc2b01348d0b5734/lib/app.js#L5:L36).

### Update 11/Jun/2013

The post has been updated to include one more test and rename what used to be the *Async* test to *Mixed*. Based [on an issue][v2issue] raised by [Domenic][], a few points were made that need to be addressed and implemented in the test. Thus the article update...

#### Promises are built to handle Asynchronous functions

Yes indeed. Libraries or ideas are merely used as their original creator intented. There are two major reasons why you may use promises synchronously.

1. In real world cases you have conditionals, in a Promise returning function a condition may force the function to finish synchronously, thus returning a *Resolved Promise*.
2. The second case has to do with design choices, maintainable and scalable code. Through time and again, one of the biggest pain points with large codebases, in regard to control flow and asynchronicity is the fact that methods and functions evolve and get refactored.

Over time, what used to be a synchronous function becomes async and vice versa. Each change, means a hell of a lot has to be refactored to match that evolution.

I found Promises to solve that design problem by blanketing everything with a returned promise and not caring about how the function will evolve over time in respect to sync / async. This practice also enables better code compositionality and better abstractions.

Therefore, it is totally expected, for a number of Promises to resolve synchronously, for any of the above reasons.

#### The Perf Test Resolves Synchronous Functions

> In effect Async resolves noop funcs.

Yes. A request was made for all the stub functions to be asynchronous. That request has been implemented and you can view the results bellow, named as **Async**.

### Time Benchmark

The `app.promise()` function gets invoked asynchronously in a loop of *n* times. We mark the time down to microseconds, using the [node-microtime][] library. The time is marked in the following events:

1. Before the loop starts.
2. Right before `app.promise()` is invoked, (gets marked *n* times).
3. Right after `app.promise()` is resolved, (gets marked *n* times).
4. After all created promises resolve.

The total execution time and the difference between these marks is what is measured, see bellow a test run using just 5 loops:

    No.   JS Timestamp     Diff       Message
    0.    1366657964509117 [NaN ms]   Start
    1.    1366657964509342 [0.225 ms] after for
    2.    1366657964509607 [0.265 ms] Creating promise:0
    3.    1366657964509704 [0.097 ms] Creating promise:1
    4.    1366657964509752 [0.048 ms] Creating promise:2
    5.    1366657964509766 [0.014 ms] Creating promise:3
    6.    1366657964509792 [0.026 ms] Creating promise:4
    7.    1366657964510264 [0.472 ms] Promise resolved:0
    8.    1366657964510274 [0.010 ms] Promise resolved:1
    9.    1366657964510279 [0.005 ms] Promise resolved:2
    10.   1366657964510285 [0.006 ms] Promise resolved:3
    11.   1366657964510288 [0.003 ms] Promise resolved:4
    12.   1366657964510537 [0.249 ms] Finish

Notice the significant delay in Mark **No 7**, it takes a while from the last `app.promise()` invocation (No 6) till we hear back from the first fulfilled promise.

> The difference of Mark **No 7** is the main metric that is used to benchmark promises, it actually is the First Resolved Promise.

### Memory Benchmark

Memory consumption is a bit dodgy to measure during runtime. To take memory consumption snapshots the `process.memoryUsage()` method is invoked and the property `heapUsed` is logged.

{% highlight javascript %}
process.memoryUsage();

// outputs:
{
  rss: 14671872,
  heapTotal: 6131200,
  heapUsed: 3370296
}
{% endhighlight %}


A `heapUsed` measurement is taken when the benchmark starts running. From there on every time all promises are resolved another measurement is taken. Comparing the difference between the two is what we benchmark and compare between the packages.

{% highlight javascript %}
var firstSnapshot = process.memoryUsage().heapUsed;
// firstSnapshot == 3370296

/* ... app.promise() runs and finishes */

var finishSnapshot = process.memoryUsage().heapUsed;
// finishSnapshot == 6645932

var diff = finishSnapshot - firstSnapshot;
// diff == 3275636 or +97% from the first measurement
{% endhighlight %}

> Now beware, we are not taking these measurements in face value. What we will only be observing is, given the same test, what the differences are between the various implementations.

## The Results

The tests were run for 10, 100, 500 and 1,000 loops. Each set of loops was run 20 times to normalize the results and the means were taken from these 20 runs. The libraries used for measuring are:

* [**Async**][async] was used to emulate vanilla JS using callbacks. A special, but of equivalent logic, [test app was used](https://github.com/thanpolas/perf-promises/blob/27527b442eaed4b38f1fd8c8cc2b01348d0b5734/lib/app.js#L81:L99)
* [**Q**][q] is one of the most prominent Promises/A+ implementations. v0.9.5 was used.
* [**When.js**][when] is the other most prominent Promises/A+ implementation. Two versions of when.js were used:
  * **v1.8.1** When.js resolved Promises *Synchronously* against the Promises/A+ spec.
  * **v2.1.0** Current version of When.js, resolves Promises asynchronously.
* [**Deferred**][deferred] v0.6.3 Promises in a simple and powerful way. Implementation originally inspired by Kris Kowal's Q.
* [**Promise**][promise] v3.0.1 Bare bones Promises/A+ implementation.

> As more libraries are added this article will get updated with how they performed.

* **Updates**
  * *May-01-13* Added [Deferred][] library. Resolves promises synchronously.
  * *Jun-11-13* Added [Promise][] library. Resolves promises asynchronously.

There are three sets of tests done:

1. All stub functions resolve *synchronously*.
2. Half the stub functions resolve *synchronously* and the other hald *asynchronously*
3. All stub functions resolve *asynchronously*.

Sets 1 and 3 can be considered edge cases. The most close to reality test case is 2, Mixed.

### Difference to First Resolved Promise, 500 Loops

<table class="table table-striped">
  <thead>
    <tr>
      <th>Perf Type</th>
      <th>Async</th>
      <th>When 2.1.0</th>
      <th>Q 0.9.5</th>
      <th>Promise 3.0.1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Sync Diff</th>
      <td>0.01ms</td>
      <td>36.62ms</td>
      <td>186.43ms</td>
      <td>63.96ms</td>
    </tr>
    <tr>
      <th>Mixed Diff</th>
      <td>5.37ms</td>
      <td>41.78ms</td>
      <td>226.34ms</td>
      <td>83.83ms</td>
    </tr>
    <tr>
      <th>Async Diff</th>
      <td>22.42ms</td>
      <td>58.18ms</td>
      <td>241.80ms</td>
      <td>93.68ms</td>
    </tr>
    <tr>
      <th>Sync Diff vs AsyncLib</th>
      <td>1x</td>
      <td>3,662x</td>
      <td>18,643x</td>
      <td>6,396x</td>
    </tr>
    <tr>
      <th>Mixed Diff vs AsyncLib</th>
      <td>1x</td>
      <td>7.78x</td>
      <td>42.15x</td>
      <td>15.61x</td>
    </tr>
    <tr>
      <th>Async Diff vs AsyncLib</th>
      <td>1x</td>
      <td>2.60x</td>
      <td>10.79x</td>
      <td>4.18x</td>
    </tr>
  </tbody>
</table>

Libraries *When.js* v1.8.1 and *Deferred* are not included in this table because they resolve promises synchronously. This difference makes the *Diff* metric inapplicable.

### Total Time of execution, 500 Loops

<table class="table table-striped">
  <thead>
    <tr>
      <th>Perf Type</th>
      <th>Async</th>
      <th>When 1.8.1</th>
      <th>When 2.1.0</th>
      <th>Q 0.9.5</th>
      <th>Deferred 0.6.3</th>
      <th>Promise 3.0.1</th>
    </tr>
  </thead>
    <tbody>
      <tr>
        <th>Sync Total</th>
        <td>5.15ms</td>
        <td>12.35ms</td>
        <td>72.35ms</td>
        <td>301.47ms</td>
        <td>71.25ms</td>
        <td>80.50ms</td>
    </tr>
    <tr>
      <td>Mixed Total</td>
      <td>18.94ms</td>
      <td>40.57ms</td>
      <td>80.21ms</td>
      <td>325.49ms</td>
      <td>94.58ms</td>
      <td>95.67ms</td>
    </tr>
    <tr>
      <td>Async Total</td>
      <td>35.70ms</td>
      <td>50.63ms</td>
      <td>90.52ms</td>
      <td>337.82ms</td>
      <td>105.87ms</td>
      <td>107.01ms</td>
    </tr>
    <tr>
      <td>Sync Total vs AsyncLib</td>
      <td>1x</td>
      <td>2.40x</td>
      <td>14.05x</td>
      <td>58.54x</td>
      <td>13.83x</td>
      <td>15.63x</td>
    </tr>
    <tr>
      <td>Mixed Total vs AsyncLib</td>
      <td>1x</td>
      <td>2.14x</td>
      <td>4.23x</td>
      <td>17.19x</td>
      <td>4.99x</td>
      <td>5.05x</td>
    </tr>
    <tr>
      <td>Async Total vs AsyncLib</td>
      <td>1x</td>
      <td>1.42x</td>
      <td>2.54x</td>
      <td>9.46x</td>
      <td>2.97x</td>
      <td>3.00x</td>
    </tr>
  </tbody>
</table>

### Average Memory Difference - Single 500 Loop Runs
<table class="table table-striped">
  <thead>
    <tr>
      <th>Pert Type</th>
      <th>Async</th>
      <th>When 1.8.1</th>
      <th>When 2.0.1</th>
      <th>When 2.1.x</th>
      <th>Q</th>
      <th>Q longStack=0</th>
      <th>Deferred</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Sync</th>
      <td>113.29%</td>
      <td>160.98%</td>
      <td>840.21%</td>
      <td>866.88%</td>
      <td>1106.67%</td>
      <td>684.56%</td>
      <td>354.07%</td>
    </tr>
    <tr>
      <th>Async</th>
      <td>159.29%</td>
      <td>458.44%</td>
      <td>811.32%</td>
      <td>834.63%</td>
      <td>1110.21%</td>
      <td>691.41%</td>
      <td>429.18%</td>
    </tr>
  </tbody>
</table>

### Charts

#### Total Time to Resolve, 500 Loops

![Promises, Total Time to Resolve, 500 Loops](http://f.cl.ly/items/3k3R1e3B3p3K3j1e2p2o/chart-promises-perf-totals-v4.png)

#### Memory Consumption

![Promises, Memory Consumption](http://than.pol.as/OgU3/chart_promises_memory_bars_v3.png)

> Checkout the updated results in [this Google Spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0Aq8iSVdp87MFdDlsMzJ3MlNIa2FuX0I5eFgzRlJ6N2c#gid=6), you can find the first version results in [this spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0Aq8iSVdp87MFdFhnZGFUTF9ST195TDVGTERXcHBmMUE#gid=6).

## Comments On The Findings

Synchronous resolution of all 7 chained promises is most likely an unnatural case, much like Asynchronous on all 7 cases is. Using Mixed asynchronous resolution in the stub funcs seems to improve the total time of execution both in Q and When.js, Async will suffer a minor penalty.

**Update**: [@domenic][domenic] rightly pointed out a faulty tweak i attempted to do with Q. I did not properly enable the option to [zero the long stack traces](http://documentup.com/kriskowal/q/#tutorial/long-stack-traces). With this tweak enabled Q will perform up to 9x times faster! The Charts and Tables have been updated.

The unsung winner here is When v1.8.1, as already mentioned, v1.8.1 contrary to the spec, will resolve the promises synchronously. The next version of When.js, that resolves promises Asynchronously, v2.0.1  performs ~5x slower.

Memory consumption is shaky at best. The tests were perform on single node runs to avoid the previous runs contaminating the measurements. The node option `--expose-gc` was used and `global.gc()` was invoked in each of the 20 master loops. Still, this does not guarantee that the garbage collector will actually kick in. What we can merely observe is, given the same method of measurement, how each package performed individually.

## Conclusions

If you are using Promises as glue for the *surface* of your API then these tests really do not affect you. Even if you've built your web application using promises you may still not be affected by the findings as long as you don't have highly repetitive functions.

If a functions that resolves using a Promise will get called multiple times per given moment, then you need to take a pause and consider all your options.

In highly repetitive functions, When.js, the best performing library, will finish resolving 16x times slower than Async.

The Asynchronous Resolution spec requirement for Promises/A+ seems to be the biggest performance hit they have to deal with. When.js handles asyncronicity by conflating the queued callbacks into one, Q on the other hand, apparently needs to assign each resolution in its own tick, resulting in the huge performance hits that we see. Anyway you slice it, the additional Tick that the Promises/A+ spec requires, comes with a cost. The cost can be negligent or quite measurable, depending on the situation.

Memory consumption is something that cannot be ignored either. Both When.js and Q will consume 8x to 11x times the memory since node started running. So when the *node* process started it consumed a total of 3,528,880 bytes of memory, when all 20x500 loop runs finished the memory count was at 41,115,800 bytes. This issue alone warrants an equivalent dive into why this happens, why `setTimeout` blows everything up in terms of memory consumption and what are the best practices for keeping the memory footprint low.

To conclude the story about why all this started, i switched the Promises dependency in [Kickq][] to When.js v1.8.1 as it performs similarly to vanilla callbacks and all stress & performance tests now pass with an execution time of 2ms or less.

[prom implementations]: https://github.com/promises-aplus/promises-spec/blob/master/implementations.md "Promises implementations"
[Q]: http://documentup.com/kriskowal/q/ "Q Promises/A+ implementation"
[promises]: http://promises-aplus.github.io/promises-spec/ "Promises/A+ specification"
[kickq]: https://github.com/verbling/kickq "kickq Job Queuing System"
[when]: https://github.com/cujojs/when#readme "when.js"
[brian]: http://blog.briancavalier.com/ "Home of Brian Cavalier"
[profy]: https://github.com/thanpolas/profy#readme "Profy performance library"
[perf-prom]: https://github.com/thanpolas/perf-promises "Promises Performance"
[node-microtime]: https://github.com/wadey/node-microtime "node-microtime package"
[async]: https://github.com/caolan/async#readme "Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript. Although originally designed for use with node.js, it can also be used directly in the browser."
[domenic]: http://domenicdenicola.com/ "Domenic Denicola"
[deferred]: https://github.com/medikoo/deferred#readme "Deferred – Asynchronous JavaScript with Promises"
[v2issue]: https://github.com/thanpolas/perf-promises/pull/2 "Perf Test Issue"
[promise]: https://github.com/then/promise "Bare bones Promises/A+ implementation"
