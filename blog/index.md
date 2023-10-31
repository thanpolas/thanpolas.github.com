---
layout: page
title : Blog
header : thanpolas Blog
group: navigation
---
{% include JB/setup %}

<div class="articles-page">
{% assign posts_collate = site.posts %}
{% include themes/thanpolas/widgets/posts_collate %}
</div>
