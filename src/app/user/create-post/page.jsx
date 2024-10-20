'use client'
import dynamic from 'next/dynamic'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import Image from 'next/image'
import axios from 'axios'
import { useUserContext } from '@/app/context/UserContext'
import Button from '@/app/Components/Button'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { S3 } from '@aws-sdk/client-s3'

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

const CreatePost = () => {
  const { user } = useUserContext()
  const router = useRouter()

  const editor = useRef(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const [tags, setTags] = useState([])

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target

    if (checked) {
      setSelectedCategoryIds((prev) =>
        prev.includes(id) ? prev : [...prev, id]
      )
    } else {
      setSelectedCategoryIds((prev) =>
        prev.filter((categoryId) => categoryId !== id)
      )
    }
  }

  const handleFetchCategories = async () => {
    try {
      const response = await axios.get('/api/admin/category')
      setCategories(response.data)
    } catch (error) {
      enqueueSnackbar('Failed fetching categories', { variant: 'error' })
    }
  }

  const s3Client = new S3({
    endpoint: 'https://the-fashion-salad.blr1.cdn.digitaloceanspaces.com',
    forcePathStyle: false,
    region: 'blr1',
    credentials: {
      accessKeyId: 'DO00AREQYJDZ4KNKJ6AT',
      secretAccessKey: 'SWPRt+2D3e2fYSp6E8g1zfivrPCi3JkH+w9ggKBG5Sg',
    },
  })

  const params = {
    Bucket: 'the-fashion-salad',
    Key: `profile-pictures/${thumbnail?.name}`,
    Body: thumbnail,
    ACL: 'public-read',
  }

  useEffect(() => {
    if (user?.name === '' || user?.name === null) {
      enqueueSnackbar('Please add your name before creating a post!')
      return
    }
    handleFetchCategories()
  }, [])

  useEffect(() => {
    if (!user) {
      router.push('/')
      enqueueSnackbar('You are not allowed to enter this page.', {
        variant: 'error',
      })
    }
  }, [user, router])

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnail(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpload = async () => {
    try {
      const data = await s3Client.send(new PutObjectCommand(params))
      console.log('Return : ', data)
    } catch (err) {
      console.log('Error', err)
    }
  }

  const handleSubmit = async (status) => {
    if (user?.name === '' || user?.name === null) {
      enqueueSnackbar('Please add your name before creating a post!', {
        variant: 'error',
      })
      return
    }
    if (title === '') {
      enqueueSnackbar('Title is empty', { variant: 'error' })
      return
    }
    if (selectedCategoryIds.length === 0) {
      enqueueSnackbar('Select at least one category', { variant: 'error' })
      return
    }
    if (content === '') {
      enqueueSnackbar('Blog content is empty', { variant: 'error' })
      return
    }

    try {
      const response = await axios.post('/api/posts', {
        title,
        content,
        author_id: user.id,
        status: status,
        category_ids: selectedCategoryIds,
        tags: tags,
      })

      enqueueSnackbar(response.data.message, { variant: 'success' })
      router.push('/user/my-posts')
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
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

  // Remove tag function
  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className='p-6 md:p-10 bg-gray-50'>
      <div className='flex flex-col md:px-12 lg:px-48 gap-6'>
        <h1 className='text-3xl font-bold text-center mb-5 text-gray-700'>
          Create a New Post
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
          <label className='text-sm font-medium text-gray-700'>
            Upload Thumbnail
          </label>
          <div className='flex gap-3'>
            <input
              id='image'
              type='file'
              accept='image/*'
              onChange={handleImage}
              className='border border-gray-300 w-full md:w-72 bg-white rounded-sm py-2 px-4 cursor-pointer hover:border-blue-400 transition duration-150'
            />
            {/* Remove Thumbnail Button */}
            {thumbnail && (
              <button
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
            {categories &&
              categories.map((category, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    name={category.name}
                    value={selectedCategoryIds}
                    id={category.slug}
                    onChange={handleCheckboxChange}
                    className='h-5 w-5 accent-blue-500'
                  />
                  <label
                    className='capitalize text-gray-600'
                    htmlFor={category.id}
                  >
                    {category.name}
                  </label>
                </div>
              ))}
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
          <Button label={'Save Post'} onClick={() => handleSubmit('draft')} />
          <Button
            label={'Submit Post'}
            onClick={() => handleSubmit('pending')}
            variant={'success'}
          />
        </div>

        {/* Post Preview */}
        <div className='p-6 border border-zinc-200 bg-white rounded-md mt-5 shadow-lg'>
          <p className='text-center text-4xl mb-5 font-semibold text-gray-400'>
            Post Preview
          </p>
          <p className='font-semibold pb-4 text-3xl'>{title}</p>
          {thumbnail && (
            <Image
              src={thumbnail}
              alt='Thumbnail preview'
              className='mb-4 rounded-lg'
              width={300}
              height={150}
              layout='responsive'
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: content }} />
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

export default CreatePost
