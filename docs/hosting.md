# Hosting your podcast episode files

As it says in [README.md](README.md), you should probably host your podcast files separately from your website. I host my podcast episode files in [Digital Ocean Spaces][], which is inexpensive and not particularly difficult to set up. But there are many other options available, including [Linode Object Storage][], [Backblaze B2 Cloud Storage][] and [Cloudflare R2][].

[Digital Ocean Spaces]: https://www.digitalocean.com/products/spaces
[Linode Object Storage]: https://www.linode.com/products/object-storage/
[Backblaze B2 Cloud Storage]: https://www.backblaze.com/cloud-storage
[Cloudflare R2]: https://developers.cloudflare.com/r2/

Your CDN host will assign URLs to each of your podcast episodes: you will tell  **Podcaster** about these URLs by defining `podcast.episodeUrlBase` as the base URL for all of your podcast episodes, like this: `https://example-podcast.sfo3.digitaloceanspaces.com`. You will provide the filename for each episode as `episode.filename`.

To deploy your episodes to your CDN host, you can write an NPM script using [`rclone`][rclone], `rsync` or `s3cmd`, depending on your setup.

[rclone]: https://rclone.org

Here's the script that I use to deploy the episodes for one of my sites to a DigitalOcean Space.

```sh
rclone sync episodes/ digitalocean:startlingbarbarabain -P --exclude .DS_Store
```
