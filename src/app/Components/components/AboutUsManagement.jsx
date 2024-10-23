'use client'

import Button from '@/app/Components/Button'
import Loading from '@/app/Components/Loading'
import { useUserContext } from '@/app/context/UserContext'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useRef, useState } from 'react'
import JoditEditor from 'jodit-react'

const AboutUsManagement = () => {
  const { user } = useUserContext()
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const editor = useRef(null)
  const [content, setContent] = useState({ content: '', updated_at: '' })

  // Fetch about content
  const handleFetchAbout = async () => {
    try {
      const response = await axios.get('/api/about')
      setContent(response.data)
    } catch (error) {
      enqueueSnackbar('Failed to fetch about content.', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Update about content
  const handleUpdate = async () => {
    try {
      setSubmitting(true)
      await axios.patch(
        '/api/about',
        {
          data: content.content, // Use the updated content string
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      enqueueSnackbar('About content updated successfully!', {
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
    handleFetchAbout()
  }, [])

  // Show loading indicator while fetching data
  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Manage About</h2>
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
        <div>
          {/* Displaying the saved content */}
          <div className='p-7 border border-zinc-200 rounded-sm mt-2'>
            <p className='text-4xl mb-5 font-semibold'>About</p>
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUsManagement
