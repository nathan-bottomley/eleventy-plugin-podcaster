export default function isEpisodePost (data) {
  return data.page?.inputPath?.includes('/episodePosts/')
}
