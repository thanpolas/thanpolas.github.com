---
layout: post
title: "Product Operations Pt1: From Idea To Spec"
description: "In this article, we will dive into the workflows from idea conception to technical spec. In Part 2 we will discuss how a tech-spec gets implemented into an actual, tangible product."
category: product
tags : [cto, cpo, product, spec]
shortUrl: "http://than.pol.as/p8Zm"
image: "/assets/blogimg/product-design.jpg"
---

{% include JB/setup %}

Designing, implementing and enforcing a Product Workflow can be a challenging task for early-stage startups. The "Product Operations" topic is so large that I have to split it into two parts. In this article, we will dive into the workflows from idea to technical spec. In Part 2 we will discuss how a tech-spec gets implemented into an actual, tangible product.

![Product Design][img.product]


I will outline the workflow for all you tl;dr people out there:

1. Idea conception.
1. Feature validation.
1. Feature design.
1. Assign the feature to a user story.
1. Assign and prioritize the user story on the Roadmap.
1. Create wireframes & tech-spec for the story.

## Creating The Product Workflow

The person that handles the product workflow is the Chief Product Officer (CPO). But, since in most companies that position is not filled until quite late in the game, it becomes the responsibility of the CTO. The hardest part of implementing the (new) workflow is [Change Management (CM)](https://en.wikipedia.org/wiki/Change_management). Since you have to switch the operational workflows of an entire company. I won't dive into CM as it's quite off-topic. But if it's the first time you heard that term, have a look at the literature about it.

One very important note here is that there is not one best procedure or workflow for Product. Each system needs to adjust to the special needs of the company and the people available. So you may have a Product person hired, you may not, that makes a big difference and your system and workflow need to adjust accordingly. So whatever I am suggesting in this article, take it as a general guide and not word for word. As it is most likely that this exact system will not work for your particular case.

## The Early Stages, Conception, Validation, Design

The "box for ideas" is open for everyone to drop an idea. Customers, users, company personnel, stakeholders, friends from home, anyone can drop an idea. The hard part is assessing their effort to gain ratio and this should get done by the CPO and the CTO.

As long as the feature is not a core part of the product, without which the product would look and feel incomplete. You will need some type of validation to make sure that this is the right choice to make given many other choices. I have been part of debates whether a feature belongs to the "core feature set" of a product or not. These are tricky situations. Discussion helps and it should include a sober look at the product vision, timetable and available "runway" the company has.

You can measure a feature's value to your customers in so many ways, your creativity is the limit. I will just mention two common practices, there are hundreds, I just wanna give you an idea...

### Validating With Direct Contact

One of the most common ways is to straight out ask your customers. Collect a group of features that you believe are good candidates for implementation. Summarize them in single line titles and put them in a form you can share with your customers. Prepare a very short and kind letter, asking your customers to be a part of this process. Explain how their opinion is the only thing that matters to you.

Then, start your email campaign, either with small segments if you have a large customer-base or blast the whole list of customers. It is important to note that we are talking about "customers" of a business and not (free) users. Who may or may not have a real stake in your company moving forward. You want to hear the opinion of the people who are actually paying you for your service. Not the general public, this is not a public feedback form.

### Validating With Fake Features

This is a practice followed by consumer applications but they can also be applied to B2B (SaaS) companies. The idea is that you implement a fake version of your feature. Wire it with a ton of metrics and push it to your production to see the users' reactions.

Suppose you are a messaging application. And you want to test whether your users will be interested in sending voice messages instead of typing. Have the wireframer and designer create a prototype design of how that "mic button" would look like and where it should be positioned. And have your engineering team position it there but without any functionality. Without actually having implemented the feature. You can choose to make this visible only to a small part of your users or to the whole. And like I said, have that button full of metrics, when was it pushed, how many times, by how many users, etc etc.

As users see that "mic button" and understand that it is for sending small audio messages, they will press it. At that point, you have, again, many choices about how to handle that press. Handling it can do nothing or you can provide a small notification that this feature is disabled for now. Or you can even open a modal with a questionnaire for feedback about how the user would like this feature.

### Being Data-Driven & Feature Design

When it comes to Product and User Experience things can be very counter-intuitive about what works best. I'm not gonna dive into that subject, but testing your assumptions with the least effort possible is the rule of thumb.

Feature design is about writing down the user stories. As per the [scrum methodology](https://hackernoon.com/a-practical-scrum-overview-f46810295e8b), your features should create user stories, big user stories create Epics and many epics (or stories) create Themes. Try to be as minimalistic and abstract with your user stories as possible so as to leave room for the domain experts to define the details.

## Creating The Roadmap

A roadmap outlines the major new features and updates that we have scheduled to implement. Depending on the Product planning resources (how many people available). A roadmap can be as short as a few months or for more organized companies can span up to years. For a startup, a 6-month roadmap is an ideal compromise between planning and staying agile.

When items from the roadmap are ready to move to the active backlog of engineering, is when product and engineering teams need to dive into the story and break it down into pieces. That moment should provide enough time for debating and iterating on a feature. Another way of saying this is to get a story, or an epic out of the roadmap the moment your team has the resources in place to design and implement it end-to-end within one go.

## Creating The Wireframes And Technical Specifications

Ensuring your team can complete a story without interruptions is very important. That will allow the team to keep as much context as possible for this story. If you prematurely create wireframes and tech-specs for a story that the team is not able to implement right away, you as the CPO or CTO will lose the context of that feature if implementation starts months later. So it is more efficient to have the engineering resources ready to implement the new stories that you pull out of the Roadmap.

Once you pull a story (or an epic/theme depending on your team size) from the roadmap, there lies the more creative process of Product. With the guidance of the CPO, wireframes need to be created. Wireframes are a very good way to convey a lot of information very fast about how Product expects the end result to roughly look like and behave. It is more efficient if a single person produces the wireframes, so they can expertly and efficiently create the many pages needed for each single user story. The industry-leading tool for wireframing is [Balsamiq](https://balsamiq.com/) and the next free alternative is [SwordSoft Layout](http://www.swordsoft.idv.tw/).

Once the wireframes are ready the iteration process begins. The stories, along with their wireframes should be publicly available to all the team and notify them when there are new items to review. The team and engineers review the story and the wireframes and make comments or questions based on their remarks. More serious issues might require a meeting but in the end, you get to have a solid story with wireframes that have gone through the internal review process and everyone now is informed and onboard with the upcoming tasks.

With the finalized wireframes and the story at hand, the CTO can start authoring the Technical Specification and designing the new API calls required, their responses and the general data flow as required. In short, a tech-spec should have the following form:

1. General informational headers:
  * Project Name (the story title)
  * Dates
  * Expected completion date
  * Who authored the spec, who relate to it (product wise)
1. Problem description in engineering terms.
1. Technical Specification per feature as broken out by engineering terms.

Sounds simple? Here are some helpful generic guidelines for a tech-spec:

* Use terminology and company-jargon. But don't overdo it to the point where it gets confusing and engineers have to look up terms. Your goal is to be well understood beyond any misinterpretation.
* Develop methods and conventions towards describing endpoints, schemas and implementation details.
* Keep it short and simple, don't write blog posts, be telegraphic and to the point.

Again, when the tech-spec is ready, the CTO needs to inform the team and have a round of feedback. So it too solidifies and everyone is on-board.

## Next Steps

Depending on your particular case, you might need an extra step with your designer. They will take the final wireframes and produce high-end graphics. However, if you have a strong style guide and a rich reusable-components repository, then the designer's time can be minimal or none at all.

The next steps are for the CTO to take the tech-spec and chop it into tasks. But that will be the subject of the next part of this two-part series.

[img.product]:  /assets/blogimg/product-design.jpg  "Product Design"
