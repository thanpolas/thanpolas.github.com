---
layout: post
title: "Jekyll Code Highlight And Line Numbers Problem Solved"
description: "Setting up my new webpage and blog, thanpol.as, using Jekyll proved to be a bit more cumbersome than expected. Specifically with syntax highlighting."
category : jekyll
tags : [jekyll, jekyll plugins]
---
{% include JB/setup %}

Setting up my new webpage and blog, [thanpol.as][thanpol.as], using [Jekyll][jekyll] proved to be a bit more cumbersome than expected. Specifically with syntax highlighting. To get it just right, I had to create a custom plugin just to wrap the generated markup in a block container.

As a consequence i had to let go of directly deploying the Jekyll repository to [Github pages][github.pages] and resort to pushing the static generated website instead. It strikes me as odd that, what I believed to be a trivial task, proved to be so hard and what I discovered that was required for highlighting to work, was not offered as an option from [Jekyll][jekyll]. So finally, i ended up fixing the problem with Javascript.

## Syntax Highlighting Options

Although I know there are many solutions for [Syntax Highlighting][highlight.js] out there, I wanted to go with Jekyll's "native" way, [pygments][pygments] and [Liquid Templates][liquid]. Syntax looked ok, codeblocks are required to be inside `{% raw %}{% highlight html %}{% endraw %}` and ` {% raw %}{% endhighlight %}{% endraw %}` tags.

This codeblock will generate pygmented markup like the following Javascript sample:

{% highlight javascript %}
for (var i = 0, len = ar.length; i < 0; i++) {
  newAr.push(ar[i].shift());
}
{% endhighlight %}

Pretty straightforward... Now how about adding some line numbers?

## Adding line numbers to codeblocks in Jekyll

Again, it looked simple, just add the key `linenos` in the liquid tags and line numbers are added!

{% highlight javascript linenos %}
// so this codeblock has been generated
// using this opening liquid tag:
// {% raw %}{% highlight javascript linenos %}{% endraw %}
for (var i = 0, len = ar.length; i < 0; i++) {
{% endhighlight %}

However, the line numbers are inline with the code which creates a "*Select and Copy*" problem... You get the line numbers in the clipboard, essentially making the codeblock not *copy-pasteable*.

The [solution][stack.linenos.table] for that is to use one additional parameter, the `table`. So the opening liquid tag would look like this `{% raw %}{% highlight language linenos=table %}{% endraw %}`. Which produces this result:

{% highlight javascript linenos=table %}
for (var i = 0, len = ar.length; i < 0; i++) {
  newAr.push(ar[i].shift());
}
{% endhighlight %}

So far so good, but what happens at the odd cases where a line might need to wrap?

## The problems of Jekyll's Syntax Highlighting

The codeblock is rendered as a table with two columns, the first containing the line numbers and the second the actual code. Each column has only one row, which in its turn has the `<pre><code> ... </code></pre>` elements. It looks like this:

{% highlight html linenos=table %}
<table class="highlighttable">
  <tr>
    <td class="linenos">
      <div class="linenodiv">
        <pre>
          <code class="javascript"> 1
 2
          </code>
        </pre>
      </div>
    </td>
    <td class="code">
      <div class="highlight"><pre> ... </pre></div>
    </td>
  </tr>
</table>
{% endhighlight %}

So, naturally, when a line is exceeding its width and wrapped this is what happens:

![Jekyll syntax highlighting with table format and lines wrapping problem][screenshot.linewrap]

The second column of the table, where the code existed, has a `width` of `100%`. Having a fixed width is out of the question, so there were little to go with for handling this situation.

Rather than trying to somehow properly align the line numbers with the wrapped lines, I decided to force the code to not wrap and have horizontal scroll bars if the text overflowed.

However, with no fixed width on the table cell, there is [no proper solution][stack.pre.table] to have horizontal bars for a child element. In the case of a [no-wrapping `pre`][stack.pre.tableTwo] things get nasty. Challenge yourself in [this Dabblet][dabblet.table].

A solution to this problem, is to wrap the table into a containing block. Then the block can have horizontal bars if the table overflowed. And this option, plainly does not exist for Jekyll. The `{% raw %}{% highlight %}...{% endraw %}` tag is Jekyll's native [plugin][jekyll.plugin] for the liquid templates. It takes the codeblock and runs it through [albino][albino], a ruby wrapper for pygmentize, before it is pushed upwards the stack, to whatever engine the document is (md, html, textile).

There is no option or way to define a wrapper for the generated code. There is also no way to wrap around a `tag` in the liquid templates... This left me with three choices:

1. **Manually wrap** codeblocks with the containing block. Very verbose way of expressing, not elegant, turned me down.
2. **Create a custom plugin** for Jekyll that would do the job. Loosing the ability to push Jekyll sources to Github for auto-generation.
3. **Wrap the elements with Javascript** sensible, not perfect but effective.

## I chose to create a custom plugin for Jekyll

I wanted to experiment so I gave it a try. It worked, but not without issues. Essentially I overwrote the `highlight` tag defined by Jekyll, and wrapped its output with the proper container block:

{% highlight ruby linenos=table %}
module Jekyll

  class WrapHighlightBlock < Jekyll::HighlightBlock
    def initialize(tag_name, markup, tokens)
      super
    end
    def render(context)
      '<figure class="code"><figcaption></figcaption>' + super + '</figure>'
    end
  end

end

Liquid::Template.register_tag('highlight', Jekyll::WrapHighlightBlock)
{% endhighlight %}

There is one small problem with the resulting output. Jekyll's [native plugin][jekyll.syntaxhighlight] for syntax highlighting, outputs two [newlines][jekyll.md.rb] that warp the output. These newlines get converted to `<p>` elements in the final document output, resulting in this markup:

{% highlight html linenos=table %}
<figure class="code"><figcaption></figcaption>
  <p></p>
  <table class="highlighttable">...</table>
  <p></p>
</figure>
{% endhighlight %}

While this does not affect the styling you can understand how it can be a thorn in my eye.

## Custom plugins == no Github love

Once you step to the other side, using custom plugins for Jekyll's generation, you loose the option to [directly push to Github][github.jekyll] on the `<username>.github.com` repo.

So I switched the `origin` of my Jekyll repo to point to, the new "*blog repo*" and created pushed the `_site` folder of Jekyll to github as a separate repo.

But, Jekyll had one last trick up its' sleeve to slam me, it completely erased everything in the `_site` folder before each new file generation, along with the `.git` folder that kept the repo's actual data (!). [Grunt][grunt] came to the rescue, with the [copy task][grunt.copy] on a [grunt watch][grunt.watch] I was able to copy the newly generated files into a mirror folder that the `.git` file was preserved.

One small script to *commit & push* both repos and the saga was finished.

But, I was not satisfied with this setup so I reverted to solution **3** and using Javascript to wrap the codeblocks with the `<figure>` container.

After loosing so much time with this, I am left wondering at which point I took the wrong turn. I'd love to hear a Jekyll's expert feedback on this, so please share your thoughts.

[highlight.js]: http://softwaremaniacs.org/soft/highlight/en/ "Highlight.js highlights syntax in code examples on blogs, forums and in fact on any web pages."
[pygments]: http://pygments.org/ " a generic syntax highlighter for general use in all kinds of software such as forum systems, wikis or other applications that need to prettify source code"
[liquid]: http://liquidmarkup.org/ "Ruby library for rendering safe templates which cannot affect the security of the server they are rendered on."
[grunt]: http://gruntjs.com "Grunt is a task-based command line build tool for JavaScript projects"
[grunt.copy]: https://github.com/gruntjs/grunt-contrib-copy/ "Copy files and folders on Grunt"
[grunt.watch]: https://github.com/gruntjs/grunt-contrib-watch "Run tasks whenever watched files change on Grunt"
[repo.blog]: https://github.com/thanpolas/blog "thanpolas personal blog Jekyll sources"
[github.pages]: http://pages.github.com/ "Github pages"
[github.jekyll]: https://help.github.com/articles/using-jekyll-with-pages "Github pages with Jekyll"
[screenshot.linewrap]: http://than.pol.as/LZ4z/Screen%20Shot%202012-12-13%20at%205.10.35%20AM.png "Jekyll syntax highlighting with table format and lines wrapping problem"
[stack.linenos.table]: http://stackoverflow.com/questions/11093241/how-to-support-line-number-when-using-pygments-with-jekyll "stackoverflow How can I number the code lines which are highlighted using pygments in Jekyll?"
[stack.pre.table]: http://stackoverflow.com/questions/6153363/liquid-pre-inside-table-cell "stackoverflow Liquid Pre inside Table Cell"
[stack.pre.tableTwo]: http://stackoverflow.com/questions/12773188/wrapping-pre-inside-table-cell "Wrapping pre inside table cell"
[jekyll]: http://jekyllrb.com/ "transform your text into a monster"
[jekyll.plugin]: https://github.com/mojombo/jekyll/wiki/Plugins "Jekyll plugins"
[jekyll.syntaxhighlight]: https://github.com/mojombo/jekyll/blob/master/lib/jekyll/tags/highlight.rb "Jekyll syntaxhighlight.rb file"
[jekyll.md.rb]: https://github.com/mojombo/jekyll/blob/master/lib/jekyll/converters/markdown.rb#L6 "Jekyll markdown.rb"
[thanpol.as]: http://thanpol.as/ "Thanasis Polychronakis website"
[dom.ready]: http://api.jquery.com/ready/ "jQuery Document Ready event"
[dabblet.table]: http://dabblet.com/gist/4258350 "Dabblet :: A non-wrapping pre inside a table cell"
[albino]: https://github.com/github/albino "github :: albino, a ruby wrapper for pygmentize"
