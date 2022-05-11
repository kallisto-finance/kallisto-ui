import React from "react";
import { Helmet } from "react-helmet";

function SEO({ description, title, content }) {

  const metaDescription = content ? content.intro : null;

  let metaImage = content ? content.image : null;
  metaImage = "http:" + metaImage;

  let pageTitle = content ? content.title : "Volume Finance";

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="image" content={metaImage} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
}

export default SEO;
