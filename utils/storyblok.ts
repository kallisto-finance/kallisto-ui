import StoryblokClient from "storyblok-js-client";

const Storyblok = new StoryblokClient({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
});

export const fetchBlogs = async () => {
  const blogs = [];
  var response = await Storyblok.get("cdn/stories/");

  for (const story of response.data.stories) {
    if (story.published_at != null) {
      if (story.full_slug.startsWith("blog/") && !story.full_slug.endsWith("blog/")) {
        blogs.push(story);
      }
    }
  }
  // console.log(blogs);
  return blogs;
}

export const fetchEvents = async () => {
  const events = [];
  var response = await Storyblok.get("cdn/stories/");

  for (const story of response.data.stories) {
    if (story.published_at != null) {
      if (story.full_slug.startsWith("events/") && !story.full_slug.endsWith("events/")) {
        events.push(story);
      }
    }
  }
  console.log(events);
  return events;
}
