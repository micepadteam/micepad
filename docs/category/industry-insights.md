---
layout: default
title: Industry Insights
---

# Industry Insights

Trends, analysis, and perspectives on event management.

{% assign posts = site.posts | where: "category", "Industry Insights" | sort: 'date' | reverse %}
{% for post in posts %}
<article style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
  <h2 style="margin-bottom: 5px;"><a href="{{ post.url | relative_url }}" style="color: #333; text-decoration: none;">{{ post.title }}</a></h2>
  <p style="color: #666; font-size: 0.9rem; margin-bottom: 10px;">{{ post.date | date: "%B %d, %Y" }}</p>
  <p>{{ post.excerpt | strip_html | truncate: 200 }}</p>
  <a href="{{ post.url | relative_url }}">Read more &rarr;</a>
</article>
{% endfor %}
