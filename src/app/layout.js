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
  return (
    <html lang='en'>
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
