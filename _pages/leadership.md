---
layout: page
title: Technical Leadership
permalink: /leadership/
image: marching-band.jpg
---

# Leadership in Tech

Authentic perspectives on technical leadership, team building, and navigating anxiety in high-pressure environments.

## Leadership Without the Toxic Positivity

Most leadership content in tech is either overly prescriptive or unrealistically optimistic. These posts share real experiences from leading cloud engineering teams, building managed services practices, and navigating the human side of technical work.

**Topics I write about:**
- Technical leadership patterns
- Building and scaling teams
- Managing anxiety and burnout
- Transitioning from IC to leadership
- Decision-making under uncertainty
- Creating psychological safety

---

## Leadership Posts

<div class="row">
{% assign leadership_posts = site.posts | where_exp: "post", "post.tags contains 'Leadership'" %}
{% for post in leadership_posts %}
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

## Why I Write About Leadership

Technical expertise gets you into leadership roles. But it's not what makes you effective once you're there.

After years of leading cloud engineering teams, building managed services practices, and supporting 5,000+ users in regulated environments, I've learned that the hardest problems in tech aren't technical. They're human.

## The Anxiety Advantage

Anxiety gets a bad rap in tech culture. But managed properly, it's a superpower. It makes you:
- Consider edge cases others miss
- Plan for failure scenarios
- Build more resilient systems
- Create better documentation
- Support your team more effectively

The key is learning to channel it productively rather than letting it paralyze you.

## Related Topics

- **[All Posts](/tags/)** - Browse everything
- **[About](/about/)** - More about my background

---

*Have leadership questions or want to share your experience? Leave a comment on any post or [connect on LinkedIn]({{ site.linkedin }}).*
