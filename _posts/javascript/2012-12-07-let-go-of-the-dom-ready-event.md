---
layout: post
category : javascript
tags : [javascript, jquery, events]
---
{% include JB/setup %}

It's way past time we should let go with the `DOM ready` event. It makes our applications slower, creates a bad user experience and adheres to no design pattern, rather, it's an anti-pattern. Read on...

## Why waiting for the DOM Ready Event is bad

If your application waits for the  `DOM Ready` event to fire before it kicks in and initializes everything you obviously have a significant delay at when your webpage becomes usable by the user. This is especially true if you have complex ui elements that need the aid of javascript to come to life.

Relying on `DOM Ready` also implies that you are putting your scripts in the document `HEAD`, this is bad. As per the [HTTP/1.1 spec](http://www.w3.org/Protocols/rfc2616/rfc2616-sec8.html#sec8.1.4) browsers can download no more than two components in parallel per hostname. Thus, we use CDNs or generally multiple hostnames for our static content. **However** when a script is loading, the browser will not start any other downloads, even on different hostnames!

## How to get rid of the DOM Ready Event

One plain and simple solution: Put all your scripts at the bottom of the document, right before the closing of the `body` tag.

At that point the document has already been parsed, rendered and all the nodes exist in the document. Therefore they are immediately accessible by your javascript application.

An exception to positioning your scripts at the bottom of your document are scripts that need to perform `document.write`, like ads scripts. Pretty much everything else can easily be moved to the bottom.

Consider this sample document, let's name it `index.html`:

{% highlight html linenos=table %}

<!DOCTYPE html>
<html>
  <head lang="en">
    <title>Our webpage</title>
    <script type="text/javascript" src="initLoggers.js"></script>
  </head>
  <body>
    <div id="main-content"></div>
    <div id="logger"></div>

    <script type="text/javascript">
      log('Inline JS at bottom of BODY. Loading jQuery...');
    </script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
    <script type="text/javascript" src="ourApplication.js"></script>
  </body>
</html>

{% endhighlight %}

The first script loaded at **line 5** `initLoggers.js` defines some helper functions for measuring the time that events occurred since the page started loading. We include this file in the **HEAD** to illustrate the flow of execution and the time differences of the process:

{% highlight javascript linenos=table %}

// get the current time difference between page
// load and when this func was invoked
function getTimeDiff() {
  return new Date().getTime() - performance.timing.navigationStart;
}
var $log, jqLoaded = false;
function log(message) {
  if (jqLoaded) {
    $log = $log || $('#logger');
    $log.append('<p><b>' + getTimeDiff() + '</b>ms :: ' + message);
  }
  if (window.console) {
    console.log(getTimeDiff() + 'ms :: ' + message);
    if (console.timeStamp){
      console.timeStamp(message);
    }
  }

}
log('On HEAD, starting...');

{% endhighlight %}

Notice on **line 4** the use of `performance`, a pretty useful debugging object for your apps! Try it in your console and see the available methods and properties of [navigation timing](http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/NavigationTiming/Overview.html) available at your browser.

Back to our `index.html`, in **lines 8, 9** and thereafter we start loading our javascript scripts. Right there, at **lines 11** and bellow, the DOM elements have already been parsed and rendered, and are ready to get manipulated.

So after jQuery loads, our applications `ourApplication.js` follows...

{% highlight javascript linenos=table %}

log('jQuery loaded.');

jqLoaded = true;

$(document).ready(function(){
  log('DOM Ready fired');
  $('#main-content').append('Style!');
});

log('Inline JS appending content...', true);
$('#main-content').append('Gangnam ');

{% endhighlight %}

... and immediately executes, listens for the `DOM Ready` event on **line 5** and perform an inline DOM manipulation at **line 11**. As expected, the manipulation will happen right there on the spot. Soon after the `DOM Ready` event will fire and execute the payload in **lines 6 and 7**.

When this page runs we can see in the console:

    1017ms :: On HEAD, starting...
    1025ms :: Inline JS at bottom of BODY. Loading jQuery...
    1083ms :: jQuery loaded.
    1086ms :: Inline JS appending content...
    1099ms :: DOM Ready fired

The difference of **13ms** between when inline JS executed and when `DOM Ready` fired may not look as much but this is a bare page. Running similar timing scripts in a moderately loaded document in development state yields these results:

    290ms :: On HEAD, starting...
    478ms :: Stylesheets loaded
    488ms :: Inline at bottom of BODY, start loading jQuery...
    587ms :: jQuery loaded, creating on DOM.Ready listener...
    602ms :: First bootstrap JS file loaded, our UI can start
    1525ms :: All inline scripts finished loading.
    1538ms :: DOM Ready fired

The page was loaded from localhost, so time is faster time on `HEAD`. Because the page is in development state, all assets are loaded individually in the document, meaning multiple style and javascript files are requested from the server.

In this case you can see the significant difference between when the first inline javascript file was evaluated and invoked (602ms) and when `DOM Ready` finally fired (1,538ms).

Faster page rendering, faster time when page becomes usable, faster page loading, better user experience. It's time to let go of the DOM Ready Event.



Have some fun with [this plnkr](http://embed.plnkr.co/5ya2mWtrcRDSfR4ozNRz) where you can find the code for the examples used in this post.
