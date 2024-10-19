import Image from 'next/image'
import { Inter } from 'next/font/google'
import Img from '../../assets/durga-puja-outfit-banner-image.webp'

const inter = Inter({ subsets: ['latin'] })

export default function BlogCard({
  imageUrl,
  categories,
  timestamp,
  title,
  onClick,
  description,
}) {
  return (
    <div className={`max-w-4xl mx-auto p-4 ${inter.className}`}>
      <div className='flex flex-col md:flex-row gap-6'>
        <div className='md:w-1/2'>
          <Image
            src={Img}
            alt='Wedding couple'
            width={500}
            height={300}
            className='w-full h-auto object-cover rounded-sm'
          />
        </div>
        <div className='md:w-1/2'>
          <div className='flex flex-wrap gap-2 mb-2'>
            {/* {categories.map((category, index) => (
              <span key={index} className='text-xs font-semibold text-gray-600'>
                {category}
              </span>
            ))} */}
          </div>
          <p className='text-sm text-gray-500 mb-2 uppercase tracking-wider'>
            {new Date(timestamp).toLocaleDateString()}
          </p>
          <h2
            onClick={onClick}
            className='text-2xl hover:underline cursor-pointer font-bold mb-3'
          >
            {title}
          </h2>
          <p className='text-gray-700'>
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </p>
        </div>
      </div>
    </div>
  )
}
