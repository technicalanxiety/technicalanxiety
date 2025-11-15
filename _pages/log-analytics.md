---
layout: page
title: Log Analytics
permalink: /log-analytics/
image: la-view-logs.jpg
---

# Azure Log Analytics & KQL

Practical guides to Azure Log Analytics, KQL queries, and using logs for more than just troubleshooting.

## Beyond Basic Logging

Most people use Log Analytics for troubleshooting. But it's capable of so much more: performance monitoring, cost optimization, security analysis, and operational intelligence.

These posts show you how to actually use Log Analytics as a log aggregation tool, not just a performance monitor.

**What you'll learn:**
- KQL query patterns that scale
- Log aggregation strategies
- Performance monitoring
- Creating human-readable reports
- Query optimization
- Real-world use cases

---

## Log Analytics Posts

<div class="row">
{% assign la_posts = site.posts | where_exp: "post", "post.tags contains 'Log Analytics'" %}
{% for post in la_posts %}
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

## Why Log Analytics Matters

In cloud environments, logs are your primary source of truth for:
- **Troubleshooting** - Understanding what went wrong
- **Performance** - Identifying bottlenecks
- **Security** - Detecting threats and anomalies
- **Cost** - Tracking resource usage
- **Compliance** - Audit trails and reporting

But only if you know how to query them effectively.

## KQL Tips

Kusto Query Language (KQL) is powerful but has a learning curve. Key patterns I use:
- Start with time ranges to limit data
- Use `where` before `extend` for performance
- Avoid `parse_json` in alerts (resource intensive)
- Build reusable functions for common queries
- Test in the [Log Analytics Demo](https://portal.azure.com/#view/Microsoft_OperationsManagementSuite_Workspace/LogsDemo.ReactView)

## Related Topics

- **[Azure](/azure/)** - Cloud platform and architecture
- **[Operations](/operations/)** - Modern service management
- **[All Topics](/tags/)** - Browse everything

---

*Have KQL questions or want to share a query pattern? Leave a comment on any post.*
