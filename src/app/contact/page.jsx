'use client'

import { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import ContactImg from '../../../public/icons/contact.png'
import { enqueueSnackbar } from 'notistack'
import { Helmet } from 'react-helmet'

const Page = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subscribe: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      enqueueSnackbar('Please fill in all fields!')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await axios.post('/api/admin/contact', {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        is_subscribe: formData.subscribe,
      })
      enqueueSnackbar(response.data.message, { variant: 'success' })
      setResponseMessage(response.data.message)
      setFormData({
        name: '',
        email: '',
        message: '',
        subscribe: false,
      })
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-[600px] lg:p-10 p-5 flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-white from-10% to-90% w-full'>
      <Helmet>
        <title>Contact us - The Fashion Salad</title>
      </Helmet>
      <div className='bg-white w-full md:w-[80%] shadow-md rounded-3xl p-10'>
        <div className='flex max-md:flex-col gap-7 max-md:gap-14'>
          <div className='lg:w-1/2 w-full flex flex-col justify-between'>
            <h2 className='text-5xl max-md:text-3xl mb-3 font-bold'>
              CONTACT US
            </h2>
            <p className='max-md:text-sm text-neutral-600'>
              Our fashion enthusiasts are excited to communicate with you and
              take your ideas and views to the next level.
              <br /> <br /> For any sort of feedbacks, queries, suggestions or
              ideas you can directly contact us at{' '}
              <a className='text-first' href='mailto:contact@fashionsalad.com'>
                contact@thefashionsalad.com
              </a>
              .
            </p>
            <div className='rounded-full lg:w-[500px] w-full'>
              <Image
                className='rounded-full w-full h-full object-cover cursor-pointer'
                src={ContactImg}
                width={0}
                height={0}
                sizes='100vw'
                alt='Contact Image'
              />
            </div>
          </div>
          <div className='lg:w-1/2 w-full'>
            <h3 className='text-3xl mb-3 font-thin'>Hey, dear</h3>
            <form onSubmit={handleSubmit}>
              <input
                placeholder='Your name'
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='px-4 p-3 w-full rounded-2xl focus:outline-none border focus:border-first mb-4'
              />
              <input
                placeholder='Your email'
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='px-4 p-3 w-full rounded-2xl focus:outline-none border focus:border-first mb-4'
              />
              <textarea
                placeholder='Your message ...'
                name='message'
                value={formData.message}
                onChange={handleChange}
                className='px-4 p-3 w-full rounded-2xl focus:outline-none border focus:border-first mb-4'
              ></textarea>
              <div className='flex items-center mb-4'>
                <input
                  type='checkbox'
                  id='check'
                  name='subscribe'
                  checked={formData.subscribe}
                  onChange={handleChange}
                />
                <label htmlFor='check' className='text-sm ml-2'>
                  Subscribe me
                </label>
              </div>
              <button
                title='Submit'
                type='submit'
                disabled={isSubmitting}
                className={`px-7 py-3 rounded-2xl bg-gradient-to-br from-blue-600 to-first text-white font-semibold disabled:opacity-50`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
        <div className='text-sm max-md:text-xs flex flex-col gap-2 text-center pt-5 max-md:pt-10'>
          <p>
            Follow us on our social media channels:{' '}
            <strong>Facebook, Instagram, Twitter (X), Pinterest</strong> and
            <strong>YouTube</strong> for more content.
          </p>
          <p>
            Feel free to <strong>subscribe</strong> to our newsletter for latest
            updates and fresh feeds in your inbox.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
