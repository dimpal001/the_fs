'use client'

import Button from '@/app/Components/Button'
import Input from '@/app/Components/Input'
import { useUserContext } from '@/app/context/UserContext'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState, useRef } from 'react'
import UserImg from '../../assets/user.svg'

import { Helmet } from 'react-helmet'
import Loading from '@/app/Components/Loading'

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import Image from 'next/image'
import DataNotFound from '@/app/Components/DataNotFound'
import useAuth from '@/app/context/useAuth'

const AccountPage = () => {
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [oldPassword, setOldPassword] = useState('')
  const [oldPasswordError, setOldPasswordError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [changing, setChanging] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [posts, setPosts] = useState([])
  const { user, setUser } = useUserContext()
  const [fetchUser, setFetchUser] = useState(null)
  const router = useRouter()
  const postsSectionRef = useRef(null)

  useAuth()

  useEffect(() => {
    fetchUserData()
  }, [router])

  const handleFileChange = (event) => {
    const files = event.target.files[0]
    const sanitizedFileName = files.name.replace(/\s+/g, '')
    setFile(files)
    setFileName(sanitizedFileName)
  }

  const s3Client = new S3Client({
    endpoint: 'https://blr1.digitaloceanspaces.com',
    forcePathStyle: false,
    region: 'blr1',
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
    },
  })

  // Generate the custom file name (profile-{user_name}-{timestamp})
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
  const customFileName = `profile-${
    user?.name || 'unknown'
  }-${timestamp}-${fileName}`

  const oldParams = {
    Bucket: 'the-fashion-salad',
    Key: `profile-pictures/${fetchUser?.image_url}`,
    Body: file,
    ACL: 'public-read',
  }

  const newParams = {
    Bucket: 'the-fashion-salad',
    Key: `profile-pictures/${customFileName}`,
    Body: file,
    ACL: 'public-read',
  }

  const handleProfileUpload = async () => {
    try {
      setUploading(true)
      if (fetchUser?.image_url !== '') {
        await s3Client.send(new DeleteObjectCommand(oldParams))
      }
      const data = await s3Client.send(new PutObjectCommand(newParams))

      const fileUrl = `https://cdn.thefashionsalad.com/profile-pictures/${customFileName}`

      const response = await axios.patch('/api/admin/users/', {
        id: user?.id,
        image_url: customFileName,
      })

      if (response.status === 200) {
        enqueueSnackbar('Profile picture updated', {
          variant: 'success',
        })
      }
      fetchUserData()
    } catch (err) {
    } finally {
      setUploading(false)
    }
  }

  const fetchUserData = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'))

    try {
      setFetching(true)
      const response = await axios.get('/api/admin/users/', {
        params: { id: storedUser.id },
        withCredentials: true,
      })
      setFetchUser(response.data)
      setName(response.data.name)
    } catch (error) {
      if (error.response.status === 401) {
        enqueueSnackbar('Session expired! Login again', { variant: 'error' })
        setUser(null)
        localStorage.removeItem('user')
        router.push('/')
      }
    } finally {
      setFetching(false)
    }
  }

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('/api/posts/', {
        params: { userId: user?.id },
      })
      setPosts(response.data)
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    }
  }

  useEffect(() => {
    setTimeout(() => {
      fetchUserPosts()
    }, 500)
  }, [])

  if (fetching) {
    return <Loading />
  }

  const passwordValidation = () => {
    let valid = true

    // Old Password error
    if (oldPassword === '') {
      setOldPasswordError('Old password should not be empty.')
      valid = false
    } else {
      setOldPasswordError('')
    }

    // New Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(newPassword)) {
      setNewPasswordError(
        'Password must be at least 8 characters long, with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.'
      )
      valid = false
    } else {
      setNewPasswordError('')
    }

    return valid
  }

  const nameValidation = () => {
    let valid = true

    if (name.length === 0) {
      setNameError('Name should not be empty.')
      valid = false
    } else if (name.length > 25) {
      setNameError('Your name is too long to update.')
      valid = false
    } else {
      setNameError('')
    }

    return valid
  }

  const handleUpdate = async () => {
    if (nameValidation()) {
      try {
        setUpdating(true)
        const response = await axios.patch('/api/admin/users/', {
          id: user?.id,
          name: name,
        })

        enqueueSnackbar('Information updated successfully!', {
          variant: 'success',
        })
        fetchUserData()
        const updatedUser = { ...user, name: response.data.user[0].name }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        setName(updatedUser.name)
      } catch (error) {
        // enqueueSnackbar(
        //   error?.response?.data?.message || 'An unexpected error occurred',
        //   { variant: 'error' }
        // )
      } finally {
        setUpdating(false)
      }
    }
  }

  const handleChangePassword = async () => {
    if (passwordValidation()) {
      try {
        setChanging(true)
        const response = await axios.patch('/api/admin/users/', {
          id: user?.id,
          oldPassword: oldPassword,
          newPassword: newPassword,
        })
        enqueueSnackbar('Password changed successfully!', {
          variant: 'success',
        })
      } catch (error) {
        enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
      } finally {
        setChanging(false)
      }
    }
  }

  return (
    <div>
      {fetchUser ? (
        <div className='container mx-auto p-5'>
          <Helmet>
            <title>{fetchUser?.name || 'User Account'}</title>
          </Helmet>
          {/* General Information */}
          <div className='bg-gray-100 shadow-md rounded-sm lg:p-14 p-10 mb-6'>
            <h2 className='text-2xl font-bold mb-4'>General Information</h2>
            <div className='flex justify-between max-md:flex-col gap-5'>
              <InfoCard
                label={'Account status'}
                data={fetchUser?.is_active ? 'Active' : 'Deactivated'}
                bg={'bg-first'}
              />
              {fetchUser?.name && (
                <InfoCard
                  label={'Name'}
                  data={fetchUser?.name}
                  bg={'bg-second'}
                />
              )}
              <InfoCard
                label={'Email'}
                data={fetchUser?.email}
                bg={'bg-blue-600'}
              />
              <InfoCard
                label={'Join from'}
                data={new Date(fetchUser?.created_at).toDateString()}
                bg={'bg-forth'}
              />
            </div>
          </div>
          {/* Account Info Section */}
          <div className='flex bg-gray-100 shadow-md mb-6 max-sm:flex-col w-full lg:p-14 p-10 gap-10'>
            {/* General Information */}
            <div className=' md:w-2/3 rounded-sm mb-6'>
              <h2 className='text-2xl font-bold mb-4'>Account Information</h2>

              <div className='space-y-5'>
                <div className='flex flex-col gap-3'>
                  <label className='text-gray-700'>Name</label>
                  <Input
                    error={nameError}
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Your Name'
                    required
                  />
                </div>
                <Button
                  onClick={handleUpdate}
                  label='Update Info'
                  loading={updating}
                />
              </div>

              <div className='flex justify-start max-md:flex-col mt-5 items-start lg:items-end gap-5'>
                <div>
                  <div className='flex flex-col gap-3 mb-2'>
                    <label className='text-gray-700'>Profile Picture</label>
                    <Input type='file' onChange={handleFileChange} />
                  </div>

                  <Button
                    loading={uploading}
                    onClick={handleProfileUpload}
                    label='Upload Profile'
                  />
                </div>
                <div>
                  <div className='w-[120px] border-4 border-blue-500 h-[120px] rounded-full lg:h-[180px] lg:w-[180px]'>
                    <Image
                      className='rounded-full w-full h-full object-cover cursor-pointer'
                      src={
                        fetchUser?.image_url
                          ? `https://cdn.thefashionsalad.com/profile-pictures/${fetchUser?.image_url}`
                          : UserImg
                      }
                      width={0}
                      height={0}
                      sizes='100vw'
                      alt={'User Profile'}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=' md:w-1/3 rounded-sm mb-6'>
              <h2 className='text-2xl font-bold mb-4'>Change Password</h2>

              <div className='space-y-5'>
                <div className='flex flex-col gap-3'>
                  <label className='text-gray-700'>Old Password</label>
                  <Input
                    error={oldPasswordError}
                    type='password'
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder='Old Password'
                    required
                  />
                </div>

                <div className='flex flex-col gap-3'>
                  <label className='text-gray-700'>New Password</label>
                  <Input
                    error={newPasswordError}
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='New Password'
                    required
                  />
                </div>

                <Button
                  loading={changing}
                  onClick={handleChangePassword}
                  label='Change Password'
                />
              </div>
            </div>
          </div>
          {/* Posts Management Section */}
          <div
            className='bg-gray-100 shadow-md rounded-lg lg:p-14 p-10'
            ref={postsSectionRef}
          >
            <h2 className='text-2xl font-bold mb-4'>Manage Your Posts</h2>

            {/* Post List - Dynamic */}
            <div className='space-y-4'>
              {fetching ? (
                <p>Loading content...</p>
              ) : (
                <div>
                  {posts.length > 0 ? (
                    posts.map((post, index) => (
                      <PostCard key={index} post={post} />
                    ))
                  ) : (
                    <p>No posts available.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className='container mx-auto'>
          <DataNotFound />
        </div>
      )}
    </div>
  )
}

const InfoCard = ({ label, data, bg }) => {
  return (
    <div className={`px-10 text-white py-6 flex flex-col rounded-3xl ${bg}`}>
      <p className='text-sm'>{label}</p>
      <p className='text-3xl max-md:text-xl pt-1 font-semibold'>{data}</p>
    </div>
  )
}

const PostCard = ({ post }) => {
  const router = useRouter()
  const handleClickEdit = () => {
    router.push(`/user/edit-post/${post.id}`)
  }

  const handleOpenBlog = (slug) => {
    router.push(`/blogs/${slug}`)
  }

  return (
    <div className='flex max-md:flex-col justify-between lg:items-center border-b pb-3'>
      <div>
        <h3
          onClick={() => handleOpenBlog(post?.slug)}
          className='text-lg hover:text-first cursor-pointer font-semibold'
        >
          {post?.title}
        </h3>
        <p className='text-sm text-gray-500'>
          Posted on: {new Date(post?.created_at).toDateString()} &nbsp; | &nbsp;
          {post.status}
        </p>
      </div>
      <div className='flex gap-3'>
        <button
          title='Edit'
          onClick={handleClickEdit}
          className='text-blue-500 hover:underline'
        >
          Edit
        </button>
        <button title='Delete' className='text-red-500 hover:underline'>
          Delete
        </button>
      </div>
    </div>
  )
}

export default AccountPage
