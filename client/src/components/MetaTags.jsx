import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaTags = ({ 
  title, 
  description, 
  keywords, 
  author, 
  ogImage, 
  ogUrl 
}) => {
  const siteTitle = import.meta.env.VITE_SITE_TITLE;
  const siteDescription = import.meta.env.VITE_SITE_DESCRIPTION;
  const siteAuthor = import.meta.env.VITE_SITE_AUTHOR;
  const siteUrl = import.meta.env.VITE_SITE_URL;

  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
      <meta name="description" content={description || siteDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author || siteAuthor} />

      {/* Open Graph 메타 태그 */}
      <meta property="og:title" content={title || siteTitle} />
      <meta property="og:description" content={description || siteDescription} />
      <meta property="og:image" content={ogImage || `${siteUrl}/og-image.jpg`} />
      <meta property="og:url" content={ogUrl || siteUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter 카드 메타 태그 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteTitle} />
      <meta name="twitter:description" content={description || siteDescription} />
      <meta name="twitter:image" content={ogImage || `${siteUrl}/og-image.jpg`} />

      {/* 추가 메타 태그 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <link rel="canonical" href={ogUrl || siteUrl} />
    </Helmet>
  );
};

export default MetaTags; 