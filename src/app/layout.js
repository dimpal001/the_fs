'use client'

// import localFont from 'next/font/local'
import './globals.css'
import 'animate.css'
import { SnackbarProvider } from 'notistack'
import { UserProvider } from './context/UserContext'
import Footer from './Components/Footer'
import Header from './Components/Header'
import {
  Rozha_One,
  Coiny,
  Quintessential,
  Great_Vibes,
  Crimson_Text,
} from 'next/font/google'

const rozha = Rozha_One({
  subsets: ['latin'],
  variable: '--font-rozha',
  weight: '400',
})

const coiny = Coiny({
  subsets: ['latin'],
  variable: '--font-coiny',
  weight: '400',
})

const quintessential = Quintessential({
  subsets: ['latin'],
  variable: '--font-quintessential',
  weight: '400',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  variable: '--font-greatVibes',
  weight: '400',
})

const crimson = Crimson_Text({
  subsets: ['latin'],
  variable: '--font-crimson',
  weight: '400',
})

export default function RootLayout({ children }) {
  const schemaData = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: 'The Fashion Salad',
    description:
      'Discover the latest fashion trends and style tips from our blog. Stay upto-date with the hottest styles in fashion, beauty, lifestyle, and wellness. Explore now',
    url: 'https://www.thefashionsalad.com',
    publisher: {
      '@type': 'Organization',
      name: 'The Fashion Salad',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cdn.thefashionsalad.com/logos/The%20Fashion%20Salad%20(3).png',
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
          name='keywords'
          content='the fashion salad, thefashionsalad, fashion, blogs, fashion blogs, beauty, lifestyle, trends, tips, sustainable fashion, vintage fashion, fashion blog'
        />
        <meta name='author' content='The Fashion Salad' />

        <meta
          name='description'
          content='Discover the latest fashion trends and style tips from our blog. Stay upto-date with the hottest styles in fashion, beauty, lifestyle, and wellness. Explore now'
        />

        {/* Favicon */}
        <link rel='icon' href='/favicon.ico' sizes='any' />

        {/* Open Graph / Facebook */}
        <meta property='og:title' content='The Fashion Salad - Fashion blog' />
        <meta
          property='og:description'
          content='Discover the latest fashion trends and style tips from our blog. Stay upto-date with the hottest styles in fashion, beauty, lifestyle, and wellness. Explore now'
        />
        <meta property='og:url' content='https://www.thefashionsalad.com' />
        <meta property='og:type' content='website' />
        <meta
          property='og:image'
          content='https://cdn.thefashionsalad.com/logos/The%20Fashion%20Salad%20(3).png'
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
          content='Discover the latest fashion trends and style tips from our blog. Stay upto-date with the hottest styles in fashion, beauty, lifestyle, and wellness. Explore now'
        />
        <meta
          name='twitter:image'
          content='https://cdn.thefashionsalad.com/logos/The%20Fashion%20Salad%20(3).png'
        />

        {/* Canonical link */}
        <link rel='canonical' href='https://www.thefashionsalad.com' />

        <title>The Fashion Salad - Fashion blog</title>

        {/* Adding Schema.org Structured Data */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
        <script
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-MM89F4N5P2'
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-MM89F4N5P2');
    `,
          }}
        />

        {/* Facebook Pixel Code */}
        <script>
          {`
            !function(f,b,e,v,n,t,s) {
              if(f.fbq) return; 
              n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq) f._fbq=n; 
              n.push=n; 
              n.loaded=!0; 
              n.version='2.0'; 
              n.queue=[]; 
              t=b.createElement(e); 
              t.async=!0; 
              t.src=v; 
              s=b.getElementsByTagName(e)[0]; 
              s.parentNode.insertBefore(t,s)
            }(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1458248468205926'); // Your Facebook Pixel ID
            fbq('track', 'PageView');
          `}
        </script>
      </head>

      <body
        className={`${rozha.variable} ${coiny.variable} ${quintessential.variable} ${greatVibes.variable} ${crimson.variable} relative antialiased`}
      >
        <h1 className='absolute bottom-0 text-center left-0 text-sm py-4 text-neutral-400 pb-5 right-0 z-20'>
          © 2024 The Fashion Salad. All Rights Reserved.
        </h1>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          autoHideDuration={2000}
        />
        <UserProvider>
          {/* <Navbar /> */}
          <Header />
          <div>{children}</div>
          <Footer />
        </UserProvider>
      </body>
    </html>
  )
}
