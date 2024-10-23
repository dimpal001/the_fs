import Link from 'next/link'
import SubscribeCard from './SubscribeCard'
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'next-share'

const Footer = () => {
  return (
    <footer className='bg-gray-800 mt-10 text-white py-10'>
      <div className='container mx-auto px-6'>
        <div className='flex flex-col gap-5 md:flex-row justify-between'>
          <div className='mb-6 md:mb-0'>
            <h4 className='text-lg font-semibold mb-4'>About Us</h4>
            <p className='text-gray-400'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
              quisquam qui nisi quod cupiditate quasi.
            </p>
            <div className='w-full flex mt-3'>
              <SubscribeCard isSmall={true} />
            </div>
          </div>
          <div className='mb-6 md:mb-0'>
            <h5 className='text-lg font-semibold mb-4'>Quick Links</h5>
            <ul className='space-y-2'>
              <li>
                <Link href={'/'}>Home</Link>
              </li>
              {/* <li>
                <Link href={'/'}></Link>
                <a href='#' className='hover:text-gray-400'>
                  Services
                </a>
              </li> */}
              <li>
                <Link href={'/about'}>About</Link>
              </li>
              <li>
                <Link href={'/privacy-policy'}>Privacy Policy</Link>
              </li>
              <li>
                <Link href={'/terms-and-condition'}>Terms & Condition</Link>
              </li>
              <li>
                <Link href={'/contact'}>Contact</Link>
              </li>
            </ul>
          </div>
          <div className='mb-6 md:mb-0'>
            <h6 className='text-lg font-semibold mb-4'>Follow Us</h6>
            <div className='flex space-x-4'>
              <a target='_blank' href={'https://www.instagram.com'}>
                <InstagramIcon round size={45} />
              </a>
              <a target='_blank' href={'https://www.facebook.com'}>
                <FacebookIcon round size={45} />
              </a>
              <a target='_blank' href={'https://www.whatsapp.com'}>
                <WhatsappIcon round size={45} />
              </a>

              <a target='_blank' href={'https://www.x.com'}>
                <TwitterIcon round size={45} />
              </a>
            </div>
          </div>
        </div>
      </div>
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
