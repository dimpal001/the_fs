'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import Image from 'next/image'
import axios from 'axios'
import JoditEditor from 'jodit-react'
import { useUserContext } from '@/app/context/UserContext'
import Button from '@/app/Components/Button'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

const EditPost = () => {
  const { user } = useUserContext()
  const router = useRouter()
  const { id } = useParams()

  const editor = useRef(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [file, setFile] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const [tags, setTags] = useState([])
  const [image_url, setImage_url] = useState('')
  const [fileName, setFileName] = useState('')

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value
    setSelectedCategoryIds([selectedValue])
  }

  const handleFetchCategories = async () => {
    try {
      const response = await axios.get('/api/admin/category')
      setCategories(response.data)
    } catch (error) {
      enqueueSnackbar('Failed fetching categories', { variant: 'error' })
    }
  }

  const handleFetchPost = async () => {
    try {
      const response = await axios.get('/api/posts/', {
        params: { id: id },
      })

      const fetchedPost = response.data[0]
      setTitle(fetchedPost.title)
      setContent(fetchedPost.content)
      setSelectedCategoryIds(fetchedPost.category_ids)
      setTags(fetchedPost.tags || [])
      setImage_url(fetchedPost.image_url)
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleFetchCategories()
    handleFetchPost()
  }, [])

  useEffect(() => {
    if (!user) {
      router.push('/')
      enqueueSnackbar('You are not allowed to enter this page.', {
        variant: 'error',
      })
    }
  }, [user, router])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    setFile(e.target.files[0])
    if (file) {
      // Remove spaces from the filename
      const sanitizedFileName = file.name.replace(/\s+/g, '')

      setFileName(sanitizedFileName)

      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnail(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const s3Client = new S3Client({
    endpoint: 'https://blr1.digitaloceanspaces.com',
    forcePathStyle: false,
    region: 'blr1',
    credentials: {
      accessKeyId: 'DO00TK892YLJBW7MV82Y',
      secretAccessKey: '9a1ueUXe6X+ngKZoZEyvnfjQw5PI7t3bzbquBCWc2bY',
    },
  })

  // Generate the custom file name
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
  const customFileName = `thumbnail-${timestamp}-${fileName}`

  const oldParams = {
    Bucket: 'the-fashion-salad',
    Key: `blog-post-images/${image_url}`,
    Body: file,
    ACL: 'public-read',
  }

  const newParams = {
    Bucket: 'the-fashion-salad',
    Key: `blog-post-images/${customFileName}`,
    Body: file,
    ACL: 'public-read',
  }

  const handleSubmit = async (status) => {
    if (title.length === 0) {
      enqueueSnackbar('Title should not be empty', { variant: 'error' })
      return
    }
    if (title.length > 120) {
      enqueueSnackbar('Title is too long to.', { variant: 'error' })
      return
    }
    if (selectedCategoryIds.length === 0) {
      enqueueSnackbar('Select at least one category', { variant: 'error' })
      return
    }

    if (!thumbnail) {
      enqueueSnackbar('Add a thumbnail image', { variant })
      return
    }

    if (image_url !== '') {
      await s3Client.send(new DeleteObjectCommand(oldParams))
    }

    const data = await s3Client.send(new PutObjectCommand(newParams))

    try {
      const response = await axios.patch(
        '/api/posts',
        {
          title,
          content,
          author_id: user.id,
          status: status,
          category_ids: selectedCategoryIds,
          tags,
          image_url: thumbnail ? customFileName : image_url,
        },
        {
          params: { id: id },
        }
      )

      enqueueSnackbar(response.data.message, { variant: 'success' })
      router.push('/user/my-posts')
    } catch (error) {
      console.error('Error:', error)
      enqueueSnackbar('Error creating post', { variant: 'error' })
    }
  }

  // Add tag function
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newTag = e.target.value.trim()
      setTags((prevTags) => [...prevTags, newTag])
      e.target.value = ''
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className='p-6 md:p-10 bg-gray-50'>
      <div className='flex flex-col md:px-12 lg:px-48 gap-2'>
        <h1 className='text-3xl font-bold text-center mb-5 text-gray-700'>
          Edit the Post
        </h1>

        {/* Title Input */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type='text'
          className='text-3xl w-full py-4 font-semibold focus:outline-none px-3 border-b-2 border-gray-300 focus:border-blue-500'
          placeholder='Your title...'
        />

        {/* Upload Thumbnail Button */}
        <div className='my-5 flex flex-col'>
          <label className='text-lg font-semibold text-gray-700'>
            Upload Thumbnail
          </label>
          <div className='flex gap-3'>
            <input
              id='image'
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='border border-gray-300 w-full md:w-72 bg-white rounded-sm py-2 px-4 cursor-pointer hover:border-blue-400 transition duration-150'
            />
            {/* Remove Thumbnail Button */}
            {thumbnail && (
              <button
                title='Remove Thumbnail'
                onClick={() => setThumbnail(null)} // Clear the thumbnail state
                className='text-sm bg-red-600 text-white px-4 py-2 rounded-sm hover:bg-red-500 transition duration-150'
              >
                Remove Thumbnail
              </button>
            )}
          </div>
        </div>

        {/* Categories Selection */}
        <div>
          <p className='text-lg font-semibold text-gray-700'>
            Select Categories
          </p>
          <div className='flex flex-wrap gap-4 mb-5'>
            {categories && (
              <div className='flex max-md:w-full flex-col'>
                <select
                  value={selectedCategoryIds[0] || ''}
                  onChange={handleSelectChange}
                  className='h-10 border capitalize border-gray-300 rounded-sm p-2'
                >
                  <option value=''>Select a category</option>
                  {categories.map((category) => (
                    <option
                      className={`${
                        category.name === 'admin blogs' &&
                        user?.role !== 'admin' &&
                        'hidden'
                      }`}
                      key={category.id}
                      value={category.slug}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Tag Input */}
        <div className='my-5'>
          <p className='text-lg font-semibold text-gray-700'>Tags</p>
          <input
            type='text'
            onKeyDown={handleAddTag}
            className='border border-gray-300 w-full md:w-72 bg-white rounded-sm py-2 px-4'
            placeholder='Type a tag and hit Enter...'
          />
          <div className='flex flex-wrap gap-2 mt-2'>
            {tags.map((tag, index) => (
              <div
                key={index}
                className='bg-zinc-200 text-sm px-2 py-1 rounded-sm'
              >
                <span>{tag}</span>
                <button
                  title='Remove'
                  onClick={() => handleRemoveTag(tag)}
                  className='text-red-500 hover:text-red-700'
                >
                  &times; {/* X icon for removal */}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* JoditEditor to edit the fetched content */}
        <JoditEditor
          ref={editor}
          value={content}
          tabIndex={1}
          onBlur={(newContent) => setContent(newContent)}
          onChange={(newContent) => setContent(newContent)}
        />

        <div className='flex gap-3 justify-end mt-3'>
          <Button label={'Save Post'} onClick={() => handleSubmit('draft')} />{' '}
          <Button
            label={'Submit Post'}
            variant={'success'}
            onClick={() => handleSubmit('pending')}
          />
        </div>

        {/* Post Preview */}
        <div className='p-6 border border-zinc-200 bg-white rounded-md mt-5 shadow-lg'>
          <p className='text-center text-4xl mb-5 font-semibold text-gray-400'>
            Post Preview
          </p>
          <p className='font-semibold pb-4 text-3xl'>{title}</p>
          <Image
            src={
              thumbnail
                ? thumbnail
                : `https://the-fashion-salad.blr1.cdn.digitaloceanspaces.com/blog-post-images/${image_url}`
            }
            alt='Thumbnail preview'
            className='mb-4 rounded-lg'
            width={300}
            height={150}
            layout='responsive'
          />
          <div
            className='prose lg:prose-xl'
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {/* Display Tags in Preview */}
          {tags.length > 0 && (
            <div className='mt-4'>
              <p className='font-semibold'>Tags:</p>
              <div className='flex flex-wrap gap-2'>
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className='bg-zinc-200 text-sm px-2 py-1 rounded-sm'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditPost
