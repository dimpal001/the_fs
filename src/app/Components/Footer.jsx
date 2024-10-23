import Link from 'next/link'
import SubscribeCard from './SubscribeCard'
import {
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'next-share'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Footer = () => {
  const [categories, setCategories] = useState([])

  const handleFetchCategories = async () => {
    try {
      const response = await axios.get('/api/admin/category')
      const filteredCategories = response.data.filter(
        (category) => category.name.toLowerCase() !== 'admin blogs'
      )
      setCategories(filteredCategories)
    } catch (error) {
      enqueueSnackbar('Failed fetching categories', { variant: 'error' })
    }
  }

  useEffect(() => {
    handleFetchCategories()
  }, [])

  return (
    <footer className='bg-gray-800 mt-10 text-white py-10'>
      <div className='container text-sm mx-auto px-6'>
        <div className='flex flex-col gap-5 md:flex-row justify-between'>
          {/* About Us Section */}
          <div className='lg:w-1/2 mb-6 md:mb-0'>
            <h4 className='text-lg font-semibold mb-4'>About Us</h4>
            <p className='text-gray-400'>
              We provide the latest in fashion trends and tips. Stay up-to-date
              with our blog for new fashion advice and inspirations.
            </p>
            <div className='w-full flex mt-3'>
              <SubscribeCard isSmall={true} />
            </div>
          </div>

          {/* Quick Links Section */}
          <div className='lg:w-1/3 lg:ps-20 mb-6 md:mb-0'>
            <h5 className='text-lg font-semibold mb-4'>Quick Links</h5>
            <ul className='space-y-2'>
              <li>
                <Link href='/' className='hover:text-gray-400'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/about' className='hover:text-gray-400'>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  target='_blank'
                  href='www.clothes2wear.in'
                  className='hover:text-gray-400'
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link href='/privacy-policy' className='hover:text-gray-400'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms-and-condition'
                  className='hover:text-gray-400'
                >
                  Terms & Condition
                </Link>
              </li>
              <li>
                <Link href='/contact' className='hover:text-gray-400'>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href='/faq' className='hover:text-gray-400'>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories  */}
          {categories.length > 0 && (
            <div className='lg:w-1/3 lg:ps-20 mb-6 md:mb-0'>
              <h5 className='text-lg font-semibold mb-4'>Categories</h5>
              <ul className='space-y-2'>
                {categories?.map((category, index) => (
                  <li key={index}>
                    <Link
                      href={`/category/${category.slug}`}
                      className='hover:text-gray-400 capitalize'
                    >
                      {category?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow Us Section */}
          <div className='lg:w-1/3 mb-6 md:mb-0'>
            <h6 className='text-lg font-semibold mb-4'>Follow Us</h6>
            <div className='flex space-x-4'>
              <a
                target='_blank'
                href='https://www.instagram.com'
                aria-label='Follow us on Instagram'
                rel='noopener noreferrer'
                className='hover:text-gray-400'
              >
                <InstagramIcon round size={45} />
              </a>
              <a
                target='_blank'
                href='https://www.facebook.com'
                aria-label='Follow us on Facebook'
                rel='noopener noreferrer'
                className='hover:text-gray-400'
              >
                <FacebookIcon round size={45} />
              </a>
              <a
                target='_blank'
                href='https://www.whatsapp.com'
                aria-label='Follow us on WhatsApp'
                rel='noopener noreferrer'
                className='hover:text-gray-400'
              >
                <WhatsappIcon round size={45} />
              </a>
              <a
                target='_blank'
                href='https://www.x.com'
                aria-label='Follow us on Twitter'
                rel='noopener noreferrer'
                className='hover:text-gray-400'
              >
                <TwitterIcon round size={45} />
              </a>
              <a
                target='_blank'
                href='https://in.pinterest.com/'
                aria-label='Follow us on Twitter'
                rel='noopener noreferrer'
                className='hover:text-gray-400'
              >
                <PinterestIcon round size={45} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className='border-t border-gray-700 mt-8 pt-4'>
        <div className='container mx-auto text-center'>
          <p className='text-sm text-gray-400'>
            {/* © 2024 The Fashion Salad. All Rights Reserved. */}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
