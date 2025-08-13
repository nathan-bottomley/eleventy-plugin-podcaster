import Podcaster from 'eleventy-plugin-podcaster'
import { createS3Client } from 'mock-aws-s3-v3'

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Podcaster, {
    s3Client: createS3Client({
      localDirectory: './fixtures/s3Buckets',
      bucket: 'badEpisodeData'
    }),
    s3BucketName: 'badEpisodeData'
  })
  eleventyConfig.setQuietMode(true)
}
