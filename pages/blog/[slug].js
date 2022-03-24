import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { render, NODE_IMAGE } from "storyblok-rich-text-react-renderer";

import { fetchBlogs } from "utils/storyblok";
import { convertDateString } from "utils/date";

const BlogPost = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchBlogs();

      for (let i = 0; i < data.length; i++) {
        if (data[i].full_slug.includes(slug)) {
          setBlog(data[i]);
          break;
        }
      }
    };

    getData();
  }, []);

  console.log(blog);
  return (
    <div className="page-container">
      {blog !== null && (
        <div className="blog-page-container">
          <div className="blog-content">
            <div className="blog-featured-image">
              <img src={`https:${blog.content.image}`} />
            </div>
            <h1 className="blog-title">{blog.content.title}</h1>
            <div className="blog-summary">
              {blog.tag_list.map((tag, index) => (
                <div
                  className="blog-summary-category"
                  key={`blog-main-tage-${index}`}
                >
                  {tag}
                </div>
              ))}
              <div className="blog-summary-pubtime">
                Published {convertDateString(blog.published_at)}
              </div>
            </div>
            <div className="blog-intro">{blog.content.intro}</div>
          </div>
          <div className="blog-post">
            {render(blog.content.long_text, {
              nodeResolvers: {
                [NODE_IMAGE]: (children, props) => (
                  <img
                    {...props}
                    style={{ borderRadius: "0px", width: "100%" }}
                  />
                ),
              },
              blokResolvers: {
                ["YouTube-blogpost"]: (props) => (
                  <div className="embed-responsive embed-responsive-16by9">
                    <iframe
                      className="embed-responsive-item"
                      src={
                        "https://www.youtube.com/embed/" +
                        props.YouTube_id.replace("https://youtu.be/", "")
                      }
                    ></iframe>
                  </div>
                ),
              },
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;
