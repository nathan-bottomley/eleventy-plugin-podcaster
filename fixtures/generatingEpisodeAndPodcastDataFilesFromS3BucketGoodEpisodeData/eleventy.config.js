import Podcaster from 'eleventy-plugin-podcaster'
import { createS3Client } from 'mock-aws-s3-v3'

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Podcaster, {
    s3ClientObject: createS3Client({
      localDirectory: './fixtures/s3Buckets',
      bucket: 'goodEpisodeData'
    }),
    s3Client: { bucket: 'goodEpisodeData' }
  })
  eleventyConfig.setQuietMode(true)
}
