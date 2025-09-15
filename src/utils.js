export const isEpisodePost = (data) => {
  return data.page?.inputPath?.includes('/episodePosts/')
}
