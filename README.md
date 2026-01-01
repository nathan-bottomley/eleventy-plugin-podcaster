---
title: eleventy-plugin-podcaster
---

`eleventy-plugin-podcaster` — or **Podcaster**, as we will call it from now on — is an Eleventy plugin which lets you create a podcast and its accompanying website. You provide **Podcaster** with information about your podcast and its episodes, and it creates the podcast feed that you submit to Apple Podcasts, Spotify or any other podcast directory. And you can use the information you have provided to create pages for individual episodes, guests, topics, seasons or anything else at all.

Plenty of services exist that will host your podcast online — [Spotify][], [Acast][], [Podbean][], [Buzzsprout][], [Blubrry][]. But none of these will allow you to own your podcast's presence on the web, and none of them will give you the freedom to create a site that presents your podcast in a way that reflects its premise, tone and style.

But Eleventy and **Podcaster** will.

[Spotify]: https://podcasters.spotify.com
[Acast]: https://www.acast.com
[Podbean]: https://www.podbean.com
[Buzzsprout]: https://www.buzzsprout.com
[Blubrry]: https://blubrry.com

## Usage

Detailed and specific information about how to install and use **Podcaster** can be found in [the Documentation section](https://eleventy-plugin-podcaster.com/docs) of the site, but here's a quick summary.

### 1. Install Podcaster

**Podcaster** is an Eleventy plugin. Create an Eleventy site and install the `eleventy-plugin-podcaster` plugin in the usual way. **Podcaster** requires Node 20 or later.

### 2. Provide information to the plugin

- In the data directory, create a `podcast.json` file. This will contain information about your podcast and its site — at the very least, its title, the site URL, a description, its language, and its category.

- In the input directory, create an `episode-posts` directory. This directory will contain a post for each episode, a post which includes information about the episode, including its title, date, episode number and show notes.

- Optionally, in the input directory, create an `episode-files` directory for your episode MP3 files.

### 3. Create the website pages

A podcast website will usually have an index page or pages, which list and describe all the episodes as well as pages for individual episodes. You can use the information you've provided — including the posts you've made for each episode — to create these pages and many more.

### 4. Host the website

You can host a **Podcaster** site wherever you host an Eleventy site. But your podcast episode files will need to be hosted on a CDN, and you will need to include a URL prefix for that CDN in your `podcast.json` data file.

## Podcaster in action

I started podcasting and creating podcasting websites in 2014. At first I used Squarespace, then WordPress, and then Jekyll, before finally settling on Eleventy late in 2022.

I now have eight podcast websites built with Eleventy and **Podcaster**;  **Podcaster** itself was derived from the code I originally used to create them.

Here's the list:

- [Flight Through Entirety](https://flightthroughentirety.com), a _Doctor Who_ podcast flying through the entirety of the show's 60-something-year history.
- [Untitled Star Trek Project](https://untitledstartrekproject.com), a _Star Trek_ commentary podcast, where two friends watch _Star Trek_ episodes from across the franchise, chosen (nearly) at random using [a page on the podcast website](https://untitledstartrekproject.com/randomiser).
- [500 Year Diary](https://500yeardiary.com), another _Doctor Who_ podcast, where we look at the show's themes and ideas and some of the people involved in its creation.
- [The Second Great and Bountiful Human Empire](https://thesecondgreatandbountifulhumanempire.com), a _Doctor Who_ flashcast, where we give our initial reactions to each episode of the post-2023 era of the show.
- [Startling Barbara Bain](https://startlingbarbarabain.com), a commentary podcast on _Space: 1999_, a lavish and generally ridiculous British scifi show from the 1970s.
- [Maximum Power](https://maximumpowerpodcast.com), a podcast about _Blakes 7_, a less lavish but more ridiculous British scifi show from the 1970s.
- [Bondfinger](https://bondfinger.com), a James Bond commentary podcast that soon ran out of James Bond films and ended up spending its time drinking and watching terrible TV shows from the 1960s.
- [Jodie into Terror](https://jodieintoterror.com), our original _Doctor Who_ flashcast, where we gave our initial reactions to each episode of _Doctor Who_’s Jodie Whittaker Era.

## Licence

This plugin is available as open source under the terms of the [ISC License](https://opensource.org/licenses/ISC).
