---
layout: post
title: "Product Operations Pt2: Product Management"
description: "In this, second part, of a 2 part series, blog post we will dive into how to manage our day to day product and engineering operations, is essence breaking down what Product Management is."
category: product
tags : [cto, cpo, product, spec]
shortUrl: ""
image: "/assets/blogimg/planning.jpg"
---

{% include JB/setup %}
In the first part of the series, [we analyzed how to get from idea to spec][blog.product1], it's not a required read for this article but definitely worth your time. In the second part, of a 2 part series, blog post we will dive into how to manage our day to day product and engineering operations.

![Product Design][img.product]

We will focus on small engineering teams from 1 up to 14 engineers. This is the range where most early-stage startups are at, and it is them that would benefit from such an article. At these early stages product and engineering management are all the same thus the "Product Management" (or PM) term is most commonly being used to describe the act of managing your engineering resources.

## Picking The Right Methodology

I won't dive much into the methodologies, more than enough has been written and said on this topic. You can go [Kanban](https://en.wikipedia.org/wiki/Kanban_development), [Waterfall](https://en.wikipedia.org/wiki/Waterfall_model) or [Scrum](https://en.wikipedia.org/wiki/Scrum_software_development),or any mix of those. Methodology dogmatism only kind of makes sense in major corporations without direct control over the engineering force but it certainly makes no sense to be dogmatic on an early stage company.

Whatever mix you choose, create periodical ceremonies to accommodate feedback on the system itself and iterate on it. Apart from the periodicals, an alteration on the system might be required when certain thresholds are met in regards to engineering populace within your team. A system that works for 2 engineers might not work for 3, and so on and so forth, so at the early stages your system itself needs to be agile and adjust towards the current needs of the company.

Whatever the system or methodology, there should be two common denominators:

* The daily standup.
* The periodical sprint.

A sprint has typically a length of one or two weeks. A two-week sprint requires more management resources and is advised when the company is in the very early stages. Having a long road of known implementation details ahead of it, or at the late, established stages where there are adequate managerial resources. The daily standup is your standard 5min meeting of the team where everyone goes quickly over what they did yesterday, what they'll do today and what obstacles they are having in accomplishing their tasks.

## Sprint Planning

Managing engineering resources is so much more than just implementing product, here are but a few of the areas a CTO needs to share their resources to:

* Platform stability & maintenance.
* Security updates.
* Scalability and provisioning of resources.
* Engineering Infrastructure (automation, build flows, logging, error reporting).
* Software library and third-party API updates.
* Health and performance monitoring.

Any of these items can forcibly manifest through an emergency and Product is but a single bullet amongst them. However, as Product is the fuel that drives the business forward it typically enjoys the biggest portion of the engineering resources.

A lot of decisions have to be made when doing the sprint planning, a much-needed refactoring can wait a bit longer but a zero-day security vulnerability in a company with sensitive information cannot. There is only one person within the organization that is able to make those decisions and that is the CTO.

### Breaking out the Tech Spec

In the [previous article][blog.product1] we dove into the creation of the Technical Specification (Tech Spec). However we focused on the Tech Specs that come out of new features, that is, they are product work. A CTO can produce on their own Tech Specs for any of the mentioned above areas like an outline of a new logging service that needs to be implemented.

The CTO has to assess and align all the roadmaps from product, engineering, commercial and marketing and decide onto which Tech Specs to pull out next. Once that is done the task creation process begins.

Creating tasks out of a Tech Spec is more of an art and a skill that gets honed with more experience. The idea is to create tasks that can be completed within a day or two at maximum and group them in units that one engineer can execute. Each task should convey complete and sufficient information so as to eliminate back and forth between the engineers, at the very least a task item should include:

* A clear and short title (take the time to think about it, it is important).
* A general and technical description of the task with parts from the Tech Spec copy and paste if needed.
* A link back to the Tech Spec.
* If this task is blocked by another task or if it blocks other tasks.
* The time estimation.
* Tagging based on the team's tags and categorization.

### Time Estimations

An experienced CTO should be able to provide initial estimations on each task they create. My favorite system is a time scale of days following the [Fibonacci sequence](https://en.wikipedia.org/wiki/Fibonacci_number) along with `0` and `0.5` (1, 2, 3, 5, 8, 13, 21):

* `0` A task that is of minimal effort, a configuration change or typo fix for example.
* `0.5` Half a day task, can take anywhere between 2 to 8 hours to complete.
* `1` A single day task, along with 0.5 that is the most commonly used unit for tasks.
* `2` A task that requires more effort than a single day but no more than two days.
* `3` This is an overly complicated task that unless every effort to break it down into smaller tasks has been exhausted it should be seldom used.
* `5+` Any value beyond 5 is for long-term planning and was assigned to a story that still needs technical specification and analysis. These tasks serve the purpose of creating a very rough roadmap on the task board.

What everyone within the organization, and most importantly the CEO, need to understand is that these estimations are, well, estimations. They are not promises, they are not predictions and they most certainly are not contracts. That sounds simple enough but it actually is the biggest friction point between "business" and "engineering". Appreciating that fact helps the two sides become one team vs arguing with each other.

### Task Assignment

Task assignment is where the actual sprint-planning takes place. The CTO distributes the tasks amongst their engineering team and creates the next sprint. When assigning tasks you should always be mindful of the overhead that exists due to various things that might be going on in the company. The company might do a [hiring campaign](/hiring/hiring-senior-engineers), or people need to participate in an external event. Even when nothing is going on and it's business, as usual, there are always things that come up that disturb an engineer's workflow. Meetings being the prime suspect here and why it is important to keep engineers out of meetings and focused on what they do best.

As a general rule of thumb, for a one week sprint, I would assign tasks that total 4 days for each engineer. That's where the most engineers of your team will get to finish their sprint in time and get the much-needed feeling of accomplishment. For the few cases that some of your engineers might finish earlier, you should always provide an overflow of tasks for them to uptake beyond the weekly planned ones.

### Discussing With Engineers

When the task assignment is complete it's time to walk it through with each one of your engineers. You can do it in groups, or individually but the idea is that you go through each task with the engineer that it is assigned to and you make sure it is well understood, can be conveyed back to you and any questions posed are immediately added on the task record for future reference.

It is at this point that the time estimations are verified with the engineer. In case of a disagreement in the estimation depending on the scale of it either directly accept it or in case of doubt make sure you both understand what needs to be done. It is most likely that the engineer, being more informed in their domain, has spotted a complexity that the CTO didn't but has to be accounted for. Edit, adjust, re-plan until you have a solid sprint that everyone is on-board with.

## Sprint Execution

Once a sprint has been set in motion it cannot be changed. The CTO needs to keep a hard stance on that matter as untrained founders have a tendency to not understand how important that is. A sprint plan has taken the collective effort of all the company involved and all the engineers have made a mental plan on how to execute their tasks. Any interruption in this flow can disrupt the whole planning and break the rhythm of the team.

I can't stress this enough, it has been one of my biggest challenges to keep founders and CEOs out of the engineer's way when they are heads down working on an agreed upon plan. In the scale of a single week, not much can change in terms of engineering output and product direction. Product development moves slow, it is a marathon, not a sprint. Therefore, any interruptions in the normal routine of an engineer don't really make any difference towards product completion, but it does create all sorts of other problems.

The only issues that are allowed to join a sprint late are emergencies. "The Server is DOWN" type of emergencies.

## Retrospectives and The Next Sprint

Next sprint planning starts from the day the current one is complete. The process starts all over again with the CTO doing the rounds with the stakeholders. With each sprint ending the team's speed is gauged as results are collected on how many tasks were completed and of what estimated value they were. When starting a new PM system the speed should keep increasing up to a point where you've reached the capacity of the team. That capacity is your team's throughput and if you used the right tools and your team was diligent enough you will have a pretty good idea of what your team can accomplish and extrapolate it on future long-term planning.

I've found that if you provide enough room for feedback from the team in all the stages a retrospective ceremony is not needed for each sprint cycle. Your team should have enough space and time to comment on every aspect of the workflow and should an issue needs to be raised and further discussed plan a meeting to address ad-hoc. The bigger the team gets and the more the CTO loses direct contact with their team, is when more typical ceremonies like the retrospective should be employed.

Having said that, a good leader always needs to have a strong relationship with their team and that can be accommodated with quarterly personal one-on-one meetings with each member of the team.

That was but a mere brush stroke on Product Management, the topic is inexhaustible and I hope I find the time to dive into more detailed issues on that topic. For now, let me know your thoughts.

[img.product]:  /assets/blogimg/planning.jpg  "Product Management"
[blog.product1]: /product/product-operations-pt1-from-idea-to-spec "Product Operations Pt1: From Idea To Spec"
