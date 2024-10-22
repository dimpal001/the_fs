'use client'

import localFont from 'next/font/local'
import './globals.css'
import { BlogProvider } from './context/BlogContext'
import { CategoryProvider } from './context/CategoryContext'
import 'animate.css'
import { SnackbarProvider } from 'notistack'
import { UserProvider } from './context/UserContext'
import Footer from './Components/Footer'
import Header from './Components/Header'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export default function RootLayout({ children }) {
  const schemaData = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: 'The Fashion Salad',
    description:
      'Discover the latest fashion trends and tips from our blog. Stay up-to-date with the hottest styles in fashion, beauty, and lifestyle.',
    url: 'https://www.thefashionsalad.com',
    publisher: {
      '@type': 'Organization',
      name: 'The Fashion Salad',
      logo: {
        '@type': 'ImageObject',
        url: 'https://the-fashion-salad.blr1.cdn.digitaloceanspaces.com/logos/The%20Fashion%20Salad%20(3).png',
      },
    },
    mainEntityOfPage: 'https://www.thefashionsalad.com',
  }

  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content='Discover the latest fashion trends and tips from our blog. Stay up-to-date with the hottest styles in fashion, beauty, and lifestyle.'
        />
        <meta name='keywords' content='fashion, blog, style, tips, trends' />
        <meta name='author' content='The Fashion Salad' />

        {/* Open Graph / Facebook */}
        <meta property='og:title' content='The Fashion Salad - Fashion blog' />
        <meta
          property='og:description'
          content='Discover the latest fashion trends and tips from our blog. Stay up-to-date with the hottest styles in fashion, beauty, and lifestyle.'
        />
        <meta property='og:url' content='https://www.thefashionsalad.com' />
        <meta property='og:type' content='website' />
        <meta
          property='og:image'
          content='https://the-fashion-salad.blr1.cdn.digitaloceanspaces.com/logos/The%20Fashion%20Salad%20(3).png'
        />
        <meta property='og:site_name' content='The Fashion Salad' />
        <meta property='og:locale' content='en_US' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />

        {/* Twitter */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='The Fashion Salad - Fashion blog' />
        <meta
          name='twitter:description'
          content='Discover the latest fashion trends and tips from our blog. Stay up-to-date with the hottest styles in fashion, beauty, and lifestyle.'
        />
        <meta
          name='twitter:image'
          content='https://the-fashion-salad.blr1.cdn.digitaloceanspaces.com/logos/The%20Fashion%20Salad%20(3).png'
        />

        {/* Canonical link */}
        <link rel='canonical' href='https://www.thefashionsalad.com' />

        <title>The Fashion Salad - Fashion blog</title>

        {/* Adding Schema.org Structured Data */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        />
        <CategoryProvider>
          <BlogProvider>
            <UserProvider>
              {/* <Navbar /> */}
              <Header />
              <div>{children}</div>
              <Footer />
            </UserProvider>
          </BlogProvider>
        </CategoryProvider>
      </body>
    </html>
  )
}
