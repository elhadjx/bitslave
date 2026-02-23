import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'], // Protect private routes from indexing
    },
    sitemap: 'https://bitslave.dev/sitemap.xml', // Change if your deployed domain is different
  }
}
