/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://thefashionsalad.com',
  generateRobotsTxt: true, // Generates the robots.txt file
  exclude: [
    '/admin',
    '/private',
    '/user',
    '/api',
    '/context',
    '/_next/static/media/*',
    '/cdn.thefashionsalad.com/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: [
          '/admin',
          '/private',
          '/user',
          '/api',
          '/context',
          '/_next/static/media/*',
          '/cdn.thefashionsalad.com/*',
        ],
      },
      {
        userAgent: '*',
        allow: [
          '/about',
          '/contact',
          '/privacy-policy',
          '/terms-and-condition',
          '/favicon.ico',
          '/blogs/*',
          '/category/*',
        ],
      },
    ],
  },
}
