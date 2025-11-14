source "https://rubygems.org"

# Core dependencies
gem "bundler", "~> 2.3"
gem "webrick", "~> 1.8"

# Ruby 3.4+ compatibility - these were removed from stdlib
gem "csv"
gem "base64"
gem "bigdecimal"

# GitHub Pages gem manages Jekyll and plugin versions
# This keeps you compatible with GitHub Pages hosting
gem "github-pages", "~> 230", group: :jekyll_plugins

# Security updates - these override github-pages defaults when needed
gem "nokogiri", ">= 1.18.0"
gem "kramdown", ">= 2.4.0"
gem "commonmarker", ">= 0.23.12"

# Additional plugins (already included in github-pages but explicit for clarity)
gem "jekyll-paginate"
gem "jekyll-sitemap"
gem "jekyll-feed"
gem "jekyll-seo-tag"

# Platform-specific gems
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem "wdm", "~> 0.1.0", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
