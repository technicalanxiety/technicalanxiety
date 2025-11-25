---
layout: post
title:  "Jekyll in WSL"
date:   2020-02-05 22:32:55 -0600
image:  jekyll-in-wsl.jpg
tags:   [Jekyll]
description: "A complete walkthrough for setting up Jekyll in Windows Subsystem for Linux to edit and preview your GitHub Pages site locally."
---

## PURPOSE
{: .text-center}

In this post, I'll walk through how I setup my WSL (*Windows Subsystem for Linux*) so I can edit/create Posts for this blog without have to wait around for direct changes to the Github repo and waiting for updates. If you need to make minor changes or if you want to quickly see and change styles, formatting, layout etc. this is a great way to quickly do that. I have collected these steps through several sources and will link them for your reference.

This is where I began:
[Scott Dorman's Blog](https://scottdorman.blog/2019/02/27/running-jekyll-on-wsl/) 

This was also referenced:
[Jekyll Requirements](https://jekyllrb.com/docs/installation/#requirements) and
[Jekyll on Ubuntu](https://jekyllrb.com/docs/installation/ubuntu/)

<br>

## WALKTHROUGH 
{: .text-center}

Before you start, you'll need to go through the normal update process for your Ubuntu subsystem. This is my subsystem:

* Distributor ID: Ubuntu
* Description:    Ubuntu 18.04.4 LTS
* Release:        18.04
* Codename:       bionic

You'll also need to have a few things done prior to all of this, none of which I'll cover in this walkthrough. You'll obviously need to have a jekyll site already up and running. I use [GitHub Pages](https://pages.github.com/) and if you don't know about this, I suggest you check it out. It's awesome. I also use [Visual Studio Code](https://code.visualstudio.com/) as my editor. I use this for work and love it, your mileage may vary so use whatever makes you happy. Also, be sure to have your code cloned locally from your repo of choice. Now that all of that is out of the way, lets get to it.

First things first, prepare for Jekyll and install a few programs in your subsystem:

1. Install MAKE, GCC and G++: 
        
        sudo apt-get install make gcc g++

1. Install Ruby and Dev tools:
        
        sudo apt-get install ruby-full build-essential zlib1g-dev ruby-dev

1. Add environment variables:
        
        echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
        echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
        echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
        source ~/.bashrc

1. Install Jekyll:

        sudo gem install jekyll bundler

1. Edit /etc/gai.conf to fix Ruby ipv6 issues

        sudo nano /etc/gai.conf

    * This is what it should look like:

    ![IPV6 and Ruby Fixed](/img/ipv6-fixed.jpg)
    {: .text-center}

1. Now install Bundler:

        sudo gem install bundler

1. Change directories to your repo and add these to your Gemfile

        source 'https://rubygems.org'
        gem 'github-pages', group: :jekyll_plugins

1. Now we need to bundle:

        bundle install

1. Now it's time to run Jekyll. Make sure you're in the root of your repo:

        bundle exec jekyll serve --watch

    * It should look something like this:

    ![Jekyll running](/img/jekyll-running.jpg)
    {: .text-center}

<br>

## CONCLUSION
{: .text-center}

If all went well, you should see your site being regenerated each time you save your changes.

![Jekyll working](/img/jekyll-working.jpg)
{: .text-center}

Could you have just as easily installed Ruby on Windows? Sure. However, this is way more fun! Also, to easily transfer files between Windows and WSL, from inside WSL simply type the below and the file system opens in a file explorer window. Enjoy!

```ruby
    explorer.exe .
```


<br>

**Photo by [Luca Bravo](https://unsplash.com/@lucabravo) on [Unsplash](https://unsplash.com/photos/XJXWbfSo2f0)**