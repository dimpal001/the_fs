'use client'

import Button from '@/app/Components/Button'
import Loading from '@/app/Components/Loading'
import { useUserContext } from '@/app/context/UserContext'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import axios from 'axios'
import Image from 'next/image'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import DeleteModal from '../DeleteModal'

const ManageLogos = () => {
  const { user } = useUserContext()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [activating, setActivating] = useState(false)
  const [logos, setLogos] = useState([])
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [selectedLogo, setSelectedLogo] = useState({})
  const [isDeleteModal, setisDeleteModal] = useState(false)

  const fetchLogos = async () => {
    try {
      const response = await axios.get('/api/admin/logos')
      setLogos(response.data)
    } catch (error) {
      console.error('Error fetching logos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogos()
  }, [])

  // Generate the custom file name (logo-{timestamp})
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
  const customFileName = `logo-${timestamp}-${fileName}`

  const handleFileChange = (event) => {
    const files = event.target.files[0]

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']
    if (files && allowedTypes.includes(files.type)) {
      const sanitizedFileName = files.name.replace(/\s+/g, '')
      setFile(files)
      setFileName(sanitizedFileName) // Set the file name in the state
    } else {
      enqueueSnackbar('Please upload a valid image file (PNG, JPG, or WEBP)', {
        variant: 'error',
      })
      setFile(null)
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

  const uploadParams = {
    Bucket: 'the-fashion-salad',
    Key: `logos/${customFileName}`,
    Body: file,
    ACL: 'public-read',
  }

  const handleUploadLogo = async () => {
    if (!file) {
      enqueueSnackbar('Select an image file')
      return
    }
    if (uploading) {
      return null
    }
    try {
      setUploading(true)
      const data = await s3Client.send(new PutObjectCommand(uploadParams))
      const response = await axios.post(
        '/api/admin/logos',
        {},
        {
          params: { url: customFileName },
        }
      )
      if (response.status === 200) {
        enqueueSnackbar(response.data.message, { variant: 'success' })
        fetchLogos()
        setFile(null)
        setFileName('')
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleActive = async (id) => {
    try {
      setActivating(true)
      const response = await axios.patch(
        '/api/admin/logos',
        {},
        {
          params: { id: id },
        }
      )
      if (response.status === 200) {
        enqueueSnackbar('This image is activated', { variant: 'success' })
        setSelectedLogo(null)
        fetchLogos()
      }
    } catch (error) {
    } finally {
      setActivating(false)
    }
  }

  const handleDeleteLogo = async () => {
    try {
      setisDeleteModal(false)
      const params = {
        Bucket: 'the-fashion-salad',
        Key: `logos/${selectedLogo.url}`,
        Body: file,
        ACL: 'public-read',
      }

      console.log(selectedLogo)
      const data = await s3Client.send(new DeleteObjectCommand(params))
      const response = await axios.delete('/api/admin/logos', {
        params: { id: selectedLogo.id },
      })

      if (response.status) {
        enqueueSnackbar(response.data.message, { variant: 'success' })
        setSelectedLogo(null)
        fetchLogos()
      }
    } catch (error) {
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Manage Logos</h2>
      <div className='lg:flex gap-3'>
        <div className='lg:w-2/3 w-full flex flex-col gap-2'>
          {logos.map((logo) => (
            <div
              key={logo.id}
              className='p-2 rounded-sm flex items-center justify-between bg-white'
            >
              <div className='w-[150px]'>
                <Image
                  className='rounded-sm shadow-md'
                  src={`https://the-fashion-salad.blr1.cdn.digitaloceanspaces.com/logos/${logo.url}`}
                  width={150}
                  height={150}
                  alt={'Logo'}
                />
              </div>
              <p className='text-sm text-neutral-600'>
                Added on {new Date(logo.created_at).toDateString()}
              </p>
              {logo.is_active ? (
                <p className='text-sm text-green-700'>Activated</p>
              ) : (
                <button
                  disabled={activating}
                  onClick={() => {
                    handleActive(logo.id)
                  }}
                  className={`p-2 px-5 ${
                    activating && 'opacity-60'
                  } rounded-sm bg-first text-white`}
                >
                  {activating ? 'Activating...' : 'Activate'}
                </button>
              )}
              <button
                disabled={deleting}
                onClick={() => {
                  setSelectedLogo(logo)
                  setisDeleteModal(true)
                }}
                className={`p-2 px-5 ${
                  deleting && 'opacity-60'
                } rounded-sm bg-red-600 text-white`}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
        <div className='lg:w-1/3 w-full'>
          <div className='bg-white rounded-sm p-4 flex flex-col gap-6'>
            <div>
              <label
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                for='default_size'
              >
                Default size
              </label>
              <input
                onChange={handleFileChange}
                className='block w-full p-2 mb-5 text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
                id='default_size'
                type='file'
              />
            </div>
            {/* <input
              type='file'
              onChange={handleFileChange}
              className='p-2 w-full px-5 rounded-xl border'
            /> */}
            {fileName && (
              <p className='text-sm text-gray-500'>Selected File: {fileName}</p> // Show file name
            )}
            <button
              onClick={handleUploadLogo}
              className='p-2 w-full px-5 rounded-sm bg-blue-600 text-white'
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
        {isDeleteModal && (
          <DeleteModal
            onOpen={true}
            onClose={() => setisDeleteModal(false)}
            onDelete={handleDeleteLogo}
          />
        )}
      </div>
    </div>
  )
}

export default ManageLogos
