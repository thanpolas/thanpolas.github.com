---
layout: post
title: "Squashing. Or how to be a liar and ungrateful"
description: "It appears that more than enough open source maintainers have a fixation with git squashing. It serves no purpose other than to tone the maintainers' excessive OCD, it is wrong, it is a lie, it is rude and ungrateful; stop doing it folks!"
category : javascript
tags : [git]
shortUrl: http://than.pol.as/WS9e
---
{% include JB/setup %}

The git squash is a git practice that enables developers to join multiple commits into a single one. It is typically performed via an [interactive git rebase](http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html) (`git rebase -i`) and it appears that more than enough open source maintainers have a fixation with it. It serves no purpose other than to tone the maintainers' excessive [OCD](http://en.wikipedia.org/wiki/Obsessive%E2%80%93compulsive_disorder), it is wrong, it is a lie, it is rude and ungrateful; stop doing it folks!

## When should we squash?

If you ask me: never. Squashing is there because it needs to be there. There are all kinds of cases that might need a squash but none of them really *require* a squash. Squashing is a matter of policy, a bad one.

## Squashing is a lie

I am not the first one to say that; [Paul Statig](http://www.twitter.com/pjstadig) in his wonderful post explains [why rebasing, amending and squashing are all lies](http://paul.stadig.name/2010/12/thou-shalt-not-lie-git-rebase-ammend.html). It is not by chance that at git-scm.com, the goto online documentation for git, has squashing under the "[Rewriting History](http://git-scm.com/book/en/Git-Tools-Rewriting-History)" chapter. When you squash, you are rewriting history, you lie.

## Squashing is wrong and dangerous

Think about this very common case for a moment... You have a topical branch that you are working on with tens or hundreds of commits and you regularly push to your *origin* remote repository. There's history written there, a history of commits. That branch typically also has the form of a pull-request, where peers, project maintainers and tech leads review and comment on your code.

If your last act before your branch is merged is to squash, you are essentially throwing all the code review in a bucket. By squashing, you are effectively re-writing history, which means that the 10-20-100 commits you made get zipped down to one. Now that single commit can no longer be pushed to your topical branch...

{% highlight PowerShell %}
To git@github.com:thanpolas/Practice.gi
 ! [rejected]        HEAD -> edits (non-fast-forward)
error: failed to push some refs to 'git@github.com:thanpolas/Practice.git'
{% endhighlight %}

What you need to do now is *push by force*:

{% highlight PowerShell %}
$ git push origin edits -f

Counting objects: 7, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 366 bytes | 0 bytes/s, done.
Total 4 (delta 3), reused 0 (delta 0)
To git@github.com:thanpolas/Practice.git
 + 77479bc...4d9a9bd edits -> edits (forced update)
{% endhighlight %}

See that "(forced update)" at the last line? That is exactly the point where you've committed a security atrocity. At this very point you could be pushing to your *origin* pretty much **anything** you'd like, skipping all the eyeballs that reviewed your code. With each "squashing & force push" the code reviewers need to go through the code again, line by line, character by character.

> You, the reviewer, the maintainer, have essentially zero control over what gets pushed after a squashing operation.

## Squashing is rude and ungrateful

That is especially the case for open source projects. Each maintainer has their own coding style, conventions and *ways of doing things*; that's totally understandable, respectable and that's the way it should be.

So naturally when you spend your time to contribute to another library you will get code reviewed and quite possibly you will be asked to jump through all the hoops the maintainer wants you to before your contribution is accepted. Each and every *hoop* means that one or more commits are generated as this is an interactive and lengthy process. Finally you end up with a PR containing your 3-4 atomic-commits of what you needed to do and a similar number for the amends you had to do based on the maintainer's review.

And then they ask you to squash. The kinder ones, will pull your branch and squash themselves.

This, apart from the two previous issues I've mentioned, that it's a lie and security-wise dangerous, now also adds *ungratefulness* in the mix. Your work is 8 commits of *value*, half of them were created because of the code reviews that the maintainer required you to go through, this is your contribution, this is your work, this is what Github measures in the *Contributors* pane and the maintainer takes all that away and throws it in oblivion forever.

![Github Contribution Type](/assets/blogimg/github-contribution-type.png)

Let me state this one more time, [there is absolutely no reason to Squash](https://news.ycombinator.com/item?id=7648237) other than to satisfy the maintainers' uncontrollable OCD and sense of self-importance, either as individuals or as a policy of the project (which most of the times is all the same).

You'd ask, ok where does *rudeness* comes into play? And you'd be right, haven't touched on this. Yet. Rudeness comes out of the fact that a maintainer may ask you to squash on **every** hoop they make you jump. Now that's not only a lie, wrong and ungrateful but is blatantly outright rude and an abuse of your time as a contributor. Some very high profile projects are practicing this, I've been through it, it's demeaning, exhausting and outright rude.

## Stop doing it folks

Really, stop doing it, stop asking contributors to massage your OCD complexes, stop asking your developers to waste their time and thus company's resources. There is nothing to gain here. There is no best practice here. There is no excuse.

It is only you and your uncontrollable OCD and sense of self importance that is in play here, nothing more.

