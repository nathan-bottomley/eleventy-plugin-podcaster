import Podcaster from 'eleventy-plugin-podcaster'
import { createS3Client } from 'mock-aws-s3-v3'

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Podcaster, {
    s3StorageObject: createS3Client({
      localDirectory: './fixtures/s3Buckets',
      bucket: 'noEpisodeData'
    }),
    s3Storage: { bucket: 'noEpisodeData' }
  })
  eleventyConfig.setQuietMode(true)
}
