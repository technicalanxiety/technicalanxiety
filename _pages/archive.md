---
layout: page
title: Archive
image: article-header.jpg
permalink: /archive/
---

<div class="archive">
  {% assign postsByYear = site.posts | group_by_exp:"post", "post.date | date: '%Y'" %}
  {% for year in postsByYear %}
    <h2 class="archive-year">{{ year.name }}</h2>
    <div class="archive-year-group">
      {% assign postsByMonth = year.items | group_by_exp:"post", "post.date | date: '%B'" %}
      {% for month in postsByMonth %}
        <h3 class="archive-month">{{ month.name }}</h3>
        <ul class="archive-list">
          {% for post in month.items %}
            <li class="archive-item">
              <span class="archive-date">{{ post.date | date: "%b %d" }}</span>
              <a class="archive-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
              {% if post.tags %}
                <span class="archive-tags">
                  {% for tag in post.tags %}
                    <span class="archive-tag">{{ tag }}</span>
                  {% endfor %}
                </span>
              {% endif %}
            </li>
          {% endfor %}
        </ul>
      {% endfor %}
    </div>
  {% endfor %}
</div>

<style>
.archive-year {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: bold;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.archive-year-group {
  margin-left: 1rem;
}

.archive-month {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-alt-color);
}

.archive-list {
  list-style: none;
  padding-left: 0;
  margin-left: 1rem;
}

.archive-item {
  margin-bottom: 0.75rem;
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.archive-date {
  font-family: monospace;
  color: var(--text-alt-color);
  min-width: 60px;
  font-size: 0.9rem;
}

.archive-link {
  flex: 1;
  text-decoration: none;
  color: var(--heading-font-color);
  font-weight: 500;
}

.archive-link:hover {
  color: var(--link-color);
  text-decoration: underline;
}

.archive-tags {
  display: inline-flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.archive-tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  background: rgba(33, 150, 243, 0.9);
  color: #ffffff;
  border-radius: 3px;
  border: none;
}

.archive-tag:hover {
  background: rgba(33, 150, 243, 1);
}

/* Light mode override */
[data-theme="light"] .archive-tag {
  color: #000000;
}
</style>
