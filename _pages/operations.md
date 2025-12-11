---
layout: page
title: Cloud Operations
permalink: /operations/
image: article-header.jpg
---

# Modern Cloud Operations

How AI, automation, and intelligent operations are transforming service management.

## Beyond Traditional IT Operations

Cloud operations isn't just about keeping systems running. It's about building intelligent, self-healing infrastructure that scales with your business. These posts explore modern service management, automation patterns, and the role of AI in operations.

**Topics covered:**
- Modern Service Management (MSM)
- AI and intelligent operations
- Automation and Infrastructure as Code
- Incident management
- Service delivery patterns
- Continuous improvement

---

## Operations Posts

<div class="row">
{% assign operations_posts = site.posts | where_exp: "post", "post.tags contains 'Operations'" %}
{% for post in operations_posts %}
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

## The Operations Evolution

Traditional ITSM frameworks were built for on-premises, manual environments. They can't keep up with cloud-native architectures and the speed modern businesses demand.

Modern Service Management (MSM) flips the script:
- **Automation first** - Zero-touch operations wherever possible
- **AI-powered** - Predictive, proactive, self-healing
- **Business-aligned** - Every activity creates measurable value
- **Continuously improving** - Built-in feedback loops

## From Managed Services to Intelligent Operations

I've built managed services practices from scratch and scaled them across healthcare, energy, and enterprise sectors. The pattern is clear: organizations that embrace automation and intelligent operations deliver faster, more reliably, and at lower cost.

## Related Topics

- **[Governance](/governance/)** - Policy and compliance automation
- **[Azure](/azure/)** - Cloud platform and architecture
- **[All Topics](/tags/)** - Browse everything

---

*Questions about modern operations or service management? Leave a comment on any post.*
