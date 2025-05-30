'use client'

import Button from '@/app/Components/Button'
import Loading from '@/app/Components/Loading'
import { useUserContext } from '@/app/context/UserContext'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useRef, useState } from 'react'
import JoditEditor from 'jodit-react'

const PrivacyPolicyManagement = () => {
  const [content, setContent] = useState({
    content: '',
    updated_at: null,
  })
  const editor = useRef(null)
  const { user } = useUserContext()
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleFetchPrivacyPolicy = async () => {
    try {
      const response = await axios.get('/api/privacy-policy')
      setContent(response.data) // Ensure response.data has the correct structure
    } catch (error) {
      enqueueSnackbar('Failed to fetch privacy policy content.', {
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    try {
      setSubmitting(true)
      const response = await axios.patch(
        '/api/privacy-policy',
        {
          data: content.content, // Update this if your backend expects a different structure
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      enqueueSnackbar('Privacy policy content updated successfully!', {
        variant: 'success',
      })
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || 'Error updating content',
        { variant: 'error' }
      )
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    handleFetchPrivacyPolicy()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Manage Privacy Policy</h2>
      <p className='pb-2 text-sm text-gray-600'>
        Last updated:{' '}
        {content.updated_at
          ? new Date(content.updated_at).toDateString()
          : 'N/A'}
      </p>
      <div className='max-md:overflow-x-scroll'>
        <div>
          {/* JoditEditor to edit the fetched content */}
          <JoditEditor
            ref={editor}
            value={content.content}
            tabIndex={1}
            onBlur={(newContent) =>
              setContent((prev) => ({ ...prev, content: newContent }))
            }
            onChange={(newContent) =>
              setContent((prev) => ({ ...prev, content: newContent }))
            }
          />
          <div className='mt-3'>
            <Button
              onClick={handleUpdate}
              label={'Update'}
              loading={submitting}
            />
          </div>
        </div>
        <div className=''>
          <div className='p-7 border border-zinc-200 rounded-sm mt-2'>
            <p className='text-4xl mb-5 font-semibold'>Privacy Policy</p>
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyManagement
