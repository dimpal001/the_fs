'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import Image from 'next/image'
import axios from 'axios'
import { useUserContext } from '@/app/context/UserContext'
import Button from '@/app/Components/Button'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import Input from '@/app/Components/Input'
import CustomEditor from '@/app/Components/CustomEditor'
import useAuth from '@/app/context/useAuth'
import { Upload } from 'lucide-react'
import ImageCropper from '@/app/Components/ImageCroper'
import { Helmet } from 'react-helmet'

const EditPost = () => {
  useAuth()

  const { user } = useUserContext()
  const router = useRouter()
  const { id } = useParams()

  const editor = useRef(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const [tags, setTags] = useState([])
  const [image_url, setImage_url] = useState('')
  const [fileName, setFileName] = useState('')
  const [images, setImages] = useState([])
  const [showCropModal, setShowCropModal] = useState(false)

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value
    setSelectedCategoryIds([selectedValue])
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

  // Function to extract image URLs from HTML content
  const extractImageFilenames = (htmlContent) => {
    const regex = /src="([^"]+\.(jpg|jpeg|png|gif|svg|webp))"/g
    const filenames = []
    let match

    while ((match = regex.exec(htmlContent)) !== null) {
      const url = match[1] // The full URL
      const filename = url.substring(url.lastIndexOf('/') + 1)
      filenames.push(filename)
    }

    return filenames
  }

  const updateImagesBasedOnContent = () => {
    const imageFilenamesInContent = extractImageFilenames(content)

    const imagesToDelete = images.filter(
      (image) => !imageFilenamesInContent.includes(image)
    )

    imagesToDelete.forEach((image) => {
      deleteImageFromCDN(image)
    })
  }

  const deleteImageFromCDN = async (image) => {
    const deleteParams = {
      Bucket: 'the-fashion-salad',
      Key: `blog-post-images/${image}`,
      // Body: thumbnail,
      ACL: 'public-read',
    }
    try {
      const data = await s3Client.send(new DeleteObjectCommand(deleteParams))
    } catch (error) {}
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

      const fileNames = extractImageFilenames(content)

      setImages(fileNames)
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

  const handleImage = async (event) => {
    const files = event.target.files[0]

    if (!files) return

    const sanitizedFileName = files.name.replace(/\s+/g, '')
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
    const customFileName = `thumbnail-${timestamp}-${sanitizedFileName}`

    setFile(files)
    setFileName(customFileName)

    handleThumbnailUpload(files, customFileName)
  }

  const handleThumbnailUpload = async (blob, image, name) => {
    let newName
    if (name) {
      const sanitizedFileName = name.replace(/\s+/g, '')
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
      newName = `thumbnail-${timestamp}-${sanitizedFileName}`
      setFileName(newName)
      console.log(newName)
    }

    const file = new File([blob], name, { type: blob.type })
    setFile(image)

    if (!file || !file) return

    const params = {
      Bucket: 'the-fashion-salad',
      Key: `blog-post-images/${newName}`,
      Body: file,
      ACL: 'public-read',
    }

    const data = await s3Client.send(new PutObjectCommand(params))
  }

  const handleThumbnailDelete = async () => {
    const params = {
      Bucket: 'the-fashion-salad',
      Key: `blog-post-images/${fileName}`,
      // Body: file,
      ACL: 'public-read',
    }
    try {
      const data = await s3Client.send(new DeleteObjectCommand(params))
      setFile(null)
    } catch (error) {}
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

    if (!file) {
      if (!image_url) {
        enqueueSnackbar('Add a thumbnail image', { variant: 'error' })
        return
      }
    }

    if (file) {
      const params = {
        Bucket: 'the-fashion-salad',
        Key: `blog-post-images/${image_url}`,
        // Body: file,
        ACL: 'public-read',
        CacheControl: 'no-cache',
      }
      const data = await s3Client.send(new DeleteObjectCommand(params))
    }

    updateImagesBasedOnContent()

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
          image_url: file ? fileName : image_url,
        },
        {
          params: { id: id },
        }
      )

      enqueueSnackbar(response.data.message, { variant: 'success' })
      router.push('/user/my-posts')
    } catch (error) {
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
    <div className='p-6 md:p-10 bg-gray-50 flex max-lg:flex-col gap-3'>
      <Helmet>
        <title>Edit Post - The Fashion Salad</title>
      </Helmet>
      <div className='flex border shadow-md p-5 bg-white rounded-xl flex-col gap-3 lg:w-1/2 w-full'>
        <h1 className='text-2xl font-bold text-center mb-5 text-gray-700'>
          Edit Post
        </h1>

        {/* Title Input */}
        <Input
          value={title}
          placeholder='Your title...'
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className='flex gap-5'>
          {/* Upload Thumbnail Button */}
          <div className='flex gap-1 flex-col'>
            <label className='text-sm text-gray-700'>Upload Thumbnail</label>
            <div className='flex gap-3'>
              <button
                onClick={() => setShowCropModal(true)}
                className='w-full md:w-72 rounded-sm p-2 border border-dotted flex items-center justify-center gap-2 text-sm'
              >
                <Upload />
                Upload Thumbnail
              </button>
              {/* <Input
                type='file'
                // accept='image/*'
                onChange={handleImage}
                // className='border border-dotted border-gray-300 w-full md:w-72 bg-white rounded-sm py-2 px-4 cursor-pointer hover:border-blue-400 transition duration-150'
              /> */}
              {/* Remove Thumbnail Button */}
            </div>
          </div>

          {/* Categories Selection */}
          <div className='flex flex-col gap-1 w-full'>
            <p className='text-sm text-gray-700'>Select Categories</p>
            <div className='flex flex-wrap gap-4 w-full'>
              {categories && (
                <div className='flex w-full flex-col'>
                  <select
                    value={selectedCategoryIds[0] || ''}
                    onChange={handleSelectChange}
                    className='max-md:w-full p-3 border-dotted capitalize border bg-white rounded-sm w-full'
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
        </div>
        <div className='lg:w-2/3'>
          <Image
            src={
              file
                ? file
                : `https://cdn.thefashionsalad.com/blog-post-images/${image_url}`
            }
            width={300}
            height={60}
            alt='Blog post image'
          />
          {file && (
            <button
              title='Remove Thumbnail'
              onClick={handleThumbnailDelete} // Clear the thumbnail state
              className='text-sm bg-red-600 text-white px-4 py-2 rounded-sm hover:bg-red-500 transition duration-150'
            >
              Remove
            </button>
          )}
        </div>

        {/* Tag Input */}
        <div className='flex flex-col gap-1'>
          <p className='text-sm text-gray-700'>Tags</p>
          <Input
            type='text'
            onKeyDown={handleAddTag}
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

        <CustomEditor
          value={content}
          onChange={(newContent) => setContent(newContent)}
          images={images}
        />

        <div className='flex gap-3 justify-end mt-3'>
          <Button label={'Save Post'} onClick={() => handleSubmit('draft')} />
          <Button
            label={'Submit Post'}
            onClick={() => handleSubmit('pending')}
            variant={'success'}
          />
        </div>
      </div>
      <div className='lg:w-1/2 w-full border bg-white shadow-md p-5 rounded-xl'>
        {/* Post Preview */}
        <p className='text-center text-2xl mb-5 font-semibold text-gray-700'>
          Post Preview
        </p>
        <p className='font-semibold pb-4 text-3xl'>{title}</p>
        <div
          className='editor-content'
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <p>{content}</p>
        {showCropModal && (
          <ImageCropper
            isOpen={true}
            onClose={() => setShowCropModal(false)}
            onCropComplete={handleThumbnailUpload}
          />
        )}
      </div>
    </div>
  )
}

export default EditPost
