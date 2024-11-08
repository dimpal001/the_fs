/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://thefashionsalad.com',
  generateRobotsTxt: true,
  exclude: ['/admin', '/private', '/user', '/api', '/context'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: ['/admin', '/private', '/user', '/api', '/context'],
      },
      {
        userAgent: '*',
        allow: [
          '/contact',
          '/privacy-policy',
          '/terms-and-condition',
          '/favicon.ico',
          '/blogs/*',
        ],
      },
    ],
  },
}
