import React, { useState } from 'react'
import { enqueueSnackbar } from 'notistack'
import axios from 'axios'
import { ArrowRight, Loader } from 'lucide-react'

const SubscribeCard = ({ isSmall }) => {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleSubscribe = async () => {
    if (!emailRegex.test(email)) {
      enqueueSnackbar('Please enter a valid email address.', {
        variant: 'error',
      })
      return
    }

    try {
      console.log(email)
      setSubmitting(true)
      const response = await axios.post('/api/subscribers/', {
        email: email,
      })
      enqueueSnackbar(response.data.message, { variant: 'success' })
      setEmail('')
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='flex max-md:w-full items-start'>
      {isSmall ? (
        <div className='w-full lg:max-w-3xl'>
          <h2 className='text-lg mt-5 text-white font-semibold mb-4'>
            Subscribe to our Newsletter
          </h2>
          <div className='bg-white p-1 ps-4 pe-1 rounded-lg flex items-center'>
            <input
              type='text'
              className='placeholder-slate-800 w-full bg-transparent text-lg focus:outline-none'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email...'
            />
            <button
              onClick={handleSubscribe}
              className='bg-first p-1 rounded-lg'
            >
              {submitting ? (
                <Loader
                  color='white'
                  className='animate-spin'
                  size={27}
                  strokeWidth={2}
                />
              ) : (
                <ArrowRight color='white' size={27} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className='bg-slate-900 lg:p-14 p-8 rounded-2xl max-w-md mx-auto lg:max-w-3xl'>
          <h2 className='text-xl lg:text-2xl text-white font-semibold text-center mb-4'>
            Subscribe to our Newsletter
          </h2>
          <p className='text-center text-sm text-gray-300 mb-6'>
            Get the latest updates and offers directly in your inbox.
          </p>
          <div className='bg-white p-1 ps-4 pe-1 rounded-lg flex items-center'>
            <input
              type='text'
              className='placeholder-slate-800 w-full bg-transparent text-lg focus:outline-none'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email...'
            />
            <button
              onClick={handleSubscribe}
              className='bg-first p-1 rounded-lg'
            >
              {submitting ? (
                <Loader
                  color='white'
                  className='animate-spin'
                  size={27}
                  strokeWidth={2}
                />
              ) : (
                <ArrowRight color='white' size={27} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscribeCard
