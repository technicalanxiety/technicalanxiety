---
layout: page
title: Azure
permalink: /azure/
image: azure-home.jpg
---

# Azure Architecture & Cloud Engineering

Deep dives into Azure architecture, cloud governance, and real-world implementation patterns from 100+ organizations.

## What You'll Find Here

I've spent years architecting Azure environments for healthcare, energy, and enterprise sectors. These posts share the patterns that work, the mistakes to avoid, and the governance frameworks that actually scale.

**Topics covered:**
- Cloud governance and landing zones
- Azure architecture patterns
- Cost optimization strategies
- Security and compliance
- Migration strategies
- Infrastructure as Code

---

## Latest Azure Posts

<div class="row">
{% assign azure_posts = site.posts | where_exp: "post", "post.tags contains 'Azure'" %}
{% for post in azure_posts %}
  <article class="article col col-12 col-t-6">
    <div class="article-box">
      <div class="article-head">
        <a href="{{ post.url | prepend: site.baseurl }}" class="article-image" style="background-image: url({{'/img/' | prepend: site.baseurl | append : post.image}})">
          <div class="image-overlay">
            <span class="image-overlay-text">{{post.title | slice: 0}}</span>
          </div>
        </a>
      </div>
      <div class="article-content">
        <div class="article-info">
          <div class="article-date">
            <span class="date"><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time></span>
          </div>
          <div class="article-reading-time">
            {% include reading-time.html content=post.content %}
          </div>
          <div class="article-tag">
            {% for tag in post.tags %}
            <a href="{{ site.baseurl }}/tags#{{tag}}" class="tag">{{ tag }}</a>
            {% endfor %}
          </div>
        </div>
        <h2 class="article-title">
          <a href="{{ post.url | prepend: site.baseurl }}">{{post.title}}</a>
        </h2>
        <p class="article-excerpt">{% if post.description %}{{ post.description | strip_html | truncate: 135 }}{% else %}{{ post.content | strip_html | truncate: 135 }}{% endif %}</p>
      </div>
    </div>
  </article>
{% endfor %}
</div>

---

## Why Azure?

After working with multiple cloud platforms, Azure's enterprise integration, hybrid capabilities, and governance tools make it the right choice for organizations with complex compliance requirements. But it's not without its challenges.

These posts share what I've learned from real implementations, not vendor marketing.

## Looking for Something Specific?

- **Getting Started**: Check out the [Log Analytics](/log-analytics/) series
- **Governance**: See the [Governance](/governance/) topic page
- **Operations**: Visit the [Operations](/operations/) page
- **All Topics**: Browse [all tags](/tags/)

---

*Have questions about Azure architecture or governance? Leave a comment on any post or [connect on LinkedIn]({{ site.linkedin }}).*
