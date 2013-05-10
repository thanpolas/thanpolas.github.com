---
layout: page
title : Blog
header : thanpolas Blog
group: navigation
---
{% include JB/setup %}

<a href="http://20minus.com" class="twenty-minus"><em>My entrepreneurial blog is at 20minus.com</em></a>
<div class="articles-page">
{% assign posts_collate = site.posts %}
{% include themes/thanpolas/widgets/posts_collate %}
</div>
