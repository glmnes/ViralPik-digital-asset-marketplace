export const siteConfig = {
  name: 'ViralPik',
  description: 'Pick the perfect assets to make your content go viral. Discover trending thumbnails, overlays, and templates for YouTube, TikTok, Instagram and more.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://viralpik.com',
  ogImage: '/og-image.png',
  keywords: [
    'viral assets',
    'social media assets',
    'viral content',
    'TikTok templates',
    'Instagram stories',
    'YouTube thumbnails',
    'content creation',
    'digital assets',
    'social media design',
    'viral marketing',
    'content templates',
    'pick viral content'
  ],
  authors: [
    {
      name: 'ViralPik',
      url: 'https://viralpik.com',
    }
  ],
  creator: 'ViralPik',
};

export function generateSEO(
  title?: string,
  description?: string,
  image?: string,
  noIndex = false
) {
  const seoTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const seoDescription = description || siteConfig.description;
  const seoImage = image || siteConfig.ogImage;
  const url = siteConfig.url;

  return {
    metadataBase: new URL(url),
    title: seoTitle,
    description: seoDescription,
    keywords: siteConfig.keywords.join(', '),
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [seoImage], 
      creator: '@ViralPik',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
  };
}
