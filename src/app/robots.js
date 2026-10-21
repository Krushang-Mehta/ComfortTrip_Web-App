import { resolveBaseUrl } from '@/lib/utils/url';

/**
 * Next.js Robots.txt Generator
 */
export default function robots() {
  const baseUrl = resolveBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/profile/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
