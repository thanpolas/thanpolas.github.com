---
layout: post
title: "The cost of WebRTC Today"
description: "Just about now we can really talk about how much WebRTC is going to cost your business."
category : webrtc
tags : [webrtc]
shortUrl: http://than.pol.as/UVib
---
{% include JB/setup %}

It's been a few years since [WebRTC][] has hit the deck, companies and developers scramble to embrace it and just about now we are experiencing the first polished products that rely on this amazing new technology. And just about now we can really talk about how much WebRTC is going to cost your business.

I've had the pleasure of [working for a company](http://talksession.com) that heavily relies on WebRTC and have gained significant insight into the WebRTC industry, what it needs to get rolled out and who are the players. Hell i even made my own [free WebRTC connectivity tool][netscan] but more on that in another post.

## WebRTC Essentials

Let's start by breaking out what it means to roll out WebRTC for your company. WebRTC depends on 3 separate services (aka servers):

* ICE Servers (STUN / TURN)
* The Signaling Server (easy to implement)
* Media Servers (Cisco, Asterisk, etc)

### ICE Servers

The [Internet Connectivity Establishment protocol][ice] takes care of figuring out the best way to establish a streaming connection to the other peer. It comprizes of a set of other protocols that we don't need to get into at this point, it suffises to describe what happens during the ICE exchange:

1. Check if a direct (p2p) UDP connection can be made with the other peer
1. If it failed, check if a direct (p2p) TCP connection can be made.
1. If it failed, use a relay (Media server)

For ICE to properly work it requires that the results be exchanged between the two peers. This is established using a signaling server...

### The Signaling Server

The Signaling Server is your own implementation of how the two clients will exchange ICE information. It's a very simple implementation that just relays information between the two clients. You can implement it with any protocol (XHR, WebSockets, XMPP, etc) and on any backend stack.

### The Media Servers

Here's where all the bucks are at. Apart from the ultimate fallback in case of p2p connectivity not being possible, the media servers will allow you to perform an array of different tasks like multiplexing, broadcasting, forking and more, depending on the hardware and what your business needs are.

Mind you, this is an actual piece of hardware that you buy as is, a typical choice is [Cisco's MCU5300](http://www.cisco.com/c/en/us/products/conferencing/telepresence-mcu-5300-series/index.html), the more your business scales the more of those you're gonna need...

## The WebRTC SaaS landscape

When starting out, the required infrastructure can be a big show stopper both in terms of upfront costs and human resources required to setup, configure and QA. Hopefully there are more than a few companies whose mission is to abstract all of this away from you. 

These are the 360° WebRTC SaaS services i've come up with so far:

* [AddLive](http://www.addlive.com/)
* [FACEmeeting](https://facemeeting.com/)
* [Showkit](http://www.showkit.com/)
* [TokBox](http://tokbox.com/)
* [Vidyo](http://www.vidyo.com/)
* [vLine](https://vline.com/developer/)
* [weemo](http://www.weemo.com/)
* [Xirsys](http://xirsys.com/)

A full list of SaaS services for all the required components can be found at [this WebRTC World page](http://www.webrtcworld.com/webrtc-list.aspx), if you are a WebRTC Shop and not in the above list feel free to [send a pull request](https://github.com/thanpolas/thanpolas.github.com/blob/master/_posts/webrtc/2014-03-19-The-Cost-of-WebRTC-Today.md).

### The state of WebRTC SaaS Providers

I've gone through all of them, worked closely with their teams and APIs and i can confidently say they are all in flux. And it's totally natural and ok. WebRTC is a really new technology. A technology that had been developed almost in the dark for years by a handful of Google and Mozilla engineers. When the first implementations rolled out on the Chrome and Firefox browsers everyone rushed in. But, the know how and experience to rolling our WebRTC was contained within those handful of engineers.

That's a point where WebRTC falls short as a technology. The spread of knowledge just isn't happening fast enough and there is no apparent strategy on how to tackle this. After you've scratched the surface and played with all the readily made demos out there you are left with problems that uniquely apply to your business logic. There is simply not enough cumulative experience within the community to help you navigate out of these problems. You could wander for weeks in forums, lists and StackOverflow before you ever get an answer or find a way to either circumvent your problem or brute-force solve it.

Even with the providers' APIs in flux you are way better of using on of those services compared to setting up your own WebRTC infrastructure. The cost of the services varies from vendor to vendor and the plan you are going to use, but for your cost and budgeting calculations here's a rule of thumb:

* ~$1.5K per month to buy in the service
* $0.004 per minute of video streamed

## You are not alone

Working on the edges of technology gives you a sense of pioneering and innovation. In the case of WebRTC that's both true and false. 

It's true in its technological context, you are after all the guinea pig that battle tests the technology. The community landscape is barren and lacking, you will have a real hard time finding critical components to setup WebRTC, for example there are only a couple open source libraries that will enable you to implement your own WebRTC client and the learning curve is daunting and support is very sparse.

It's false in the business context, WebRTC will not give you a competitive advantage. The technology is out, everyone has it, it cannot be your selling point. WebRTC should be just a feature among the greater value proposition your company has to offer. So unless you are a WebRTC shop yourself you really need to rethink how you market your company. Pull down the "Powered by WebRTC" copy from your header elements and put it in its' right context, inside the body or the bullets showcasing your product's features.

## Conclusions

Get ready for a world of hurt. The costs of rolling out WebRTC in your company go far and beyond what the WebRTC shop will charge you. You will need to be engaged with experimental technologies and bleed development cycles and product release delays.

Now you know.

[WebRTC]: http://www.webrtc.org/
[netscan]: http://www.check-connectivity.com/
[ice]: http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment
