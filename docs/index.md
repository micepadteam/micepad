---
layout: default
title: All Posts
---

# Micepad Blog

Event management insights, tips, and product updates.

<nav style="margin-bottom: 30px;">
  <strong>Categories:</strong>
  <a href="{{ site.baseurl }}/category/industry-insights/" style="margin-left: 10px;">Industry Insights</a> |
  <a href="{{ site.baseurl }}/category/how-to-tutorials/">How-To & Tutorials</a> |
  <a href="{{ site.baseurl }}/category/product-updates/">Product Updates</a> |
  <a href="{{ site.baseurl }}/category/product-insights/">Product Insights</a> |
  <a href="{{ site.baseurl }}/category/company-news/">Company News</a> |
  <a href="{{ site.baseurl }}/category/event-news/">Event News</a>
</nav>

{% assign sorted_posts = site.posts | sort: 'date' | reverse %}
{% for post in sorted_posts %}
<article style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
  <h2 style="margin-bottom: 5px;"><a href="{{ post.url | relative_url }}" style="color: #333; text-decoration: none;">{{ post.title }}</a></h2>
  <p style="color: #666; font-size: 0.9rem; margin-bottom: 10px;">
    {{ post.date | date: "%B %d, %Y" }}
    {% if post.category %} · <a href="{{ site.baseurl }}/category/{{ post.category | slugify }}/" style="color: #0066cc;">{{ post.category }}</a>{% endif %}
  </p>
  <p>{{ post.excerpt | strip_html | truncate: 200 }}</p>
  <a href="{{ post.url | relative_url }}">Read more &rarr;</a>
</article>
{% endfor %}
