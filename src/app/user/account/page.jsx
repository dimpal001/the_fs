'use client'

import Button from '@/app/Components/Button'
import Input from '@/app/Components/Input'
import { useUserContext } from '@/app/context/UserContext'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState, useRef } from 'react'

import { Helmet } from 'react-helmet'
import Loading from '@/app/Components/Loading'

const AccountPage = () => {
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [updating, setUpdating] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [posts, setPosts] = useState([])
  const { user } = useUserContext()
  const [fetchUser, setFetchUser] = useState({})
  const router = useRouter()
  const postsSectionRef = useRef(null)

  useEffect(() => {
    if (!user) {
      router.push('/')
      enqueueSnackbar('You are not allowed to enter this page.', {
        variant: 'error',
      })
    } else {
      fetchUserData()
    }
  }, [user, router])

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleProfileUpload = async () => {
    if (!file) {
      enqueueSnackbar('Please select a file to upload.', { variant: 'error' })
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      enqueueSnackbar('Profile picture uploaded successfully!', {
        variant: 'success',
      })
      console.log('Upload Response:', response.data)
    } catch (err) {
      console.error('Upload Error:', err)
      enqueueSnackbar('Error uploading profile picture', { variant: 'error' })
    }
  }

  const fetchUserData = async () => {
    try {
      setFetching(true)
      const response = await axios.get('/api/admin/users/', {
        params: { id: user.id },
      })
      setFetchUser(response.data)
      setName(response.data.name)
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    } finally {
      setFetching(false)
    }
  }

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('/api/posts/', {
        params: { userId: user.id },
      })
      setPosts(response.data)
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchUserPosts()
          observer.disconnect()
        }
      },
      { threshold: 1.0 }
    )

    if (postsSectionRef.current) {
      observer.observe(postsSectionRef.current)
    }

    return () => {
      if (postsSectionRef.current) {
        observer.unobserve(postsSectionRef.current)
      }
    }
  }, [])

  if (fetching) {
    return <Loading />
  }

  const handleUpdate = async () => {
    if (name === '') {
      enqueueSnackbar('Name field cannot be empty!', { variant: 'error' })
      return
    }
    try {
      setUpdating(true)
      const response = await axios.patch('/api/admin/users/', {
        id: user.id,
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
      enqueueSnackbar(
        error?.response?.data?.message || 'An unexpected error occurred',
        { variant: 'error' }
      )
    } finally {
      setUpdating(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      setUpdating(true)
      const response = await axios.patch('/api/admin/users/', {
        id: user.id,
        oldPassword: password,
        newPassword: confirmPassword,
      })
      enqueueSnackbar('Password changed successfully!', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div>
      {user && (
        <div className='container mx-auto p-5'>
          <Helmet>
            <title>Profile</title>
          </Helmet>
          {/* General Information */}
          <div className='bg-gray-100 rounded-sm lg:p-14 p-5 mb-6'>
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
          <div className='flex max-sm:flex-col w-full gap-10'>
            {/* General Information */}
            <div className='bg-gray-100 md:w-2/3 shadow-md rounded-sm p-14 mb-6'>
              <h2 className='text-2xl font-bold mb-4'>Account Information</h2>

              <div className='space-y-5'>
                <div className='flex flex-col gap-3'>
                  <label className='text-gray-700'>Name</label>
                  <Input
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

              <div className='flex max-md:flex-col mt-5 items-start lg:items-end gap-5'>
                <div className='flex flex-col gap-3'>
                  <label className='text-gray-700'>Profile Picture</label>
                  <Input type='file' onChange={handleFileChange} />
                </div>

                <Button onClick={handleProfileUpload} label='Update Profile' />
              </div>
            </div>
            <div className='bg-gray-100 md:w-1/3 shadow-md rounded-sm p-14 mb-6'>
              <h2 className='text-2xl font-bold mb-4'>Change Password</h2>

              <div className='space-y-5'>
                <div className='flex flex-col gap-3'>
                  <label className='text-gray-700'>Old Password</label>
                  <Input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Old Password'
                    required
                  />
                </div>

                <div className='flex flex-col gap-3'>
                  <label className='text-gray-700'>New Password</label>
                  <Input
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='New Password'
                    required
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  label='Change Password'
                />
              </div>
            </div>
          </div>
          {/* Posts Management Section */}
          <div
            className='bg-gray-100 shadow-md rounded-lg p-14'
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
      )}
    </div>
  )
}

export default AccountPage

const InfoCard = ({ label, data, bg }) => {
  return (
    <div className={`px-10 text-white py-6 flex flex-col rounded-3xl ${bg}`}>
      <p className='text-sm'>{label}</p>
      <p className='text-3xl pt-1 font-semibold'>{data}</p>
    </div>
  )
}

const PostCard = ({ post }) => {
  const router = useRouter()
  const handleClickEdit = () => {
    router.push(`/user/edit-post/${post.id}`)
  }
  return (
    <div className='flex max-md:flex-col justify-between lg:items-center border-b pb-3'>
      <div>
        <h3 className='text-lg font-semibold'>{post?.title}</h3>
        <p className='text-sm text-gray-500'>
          Posted on: {new Date(post?.created_at).toDateString()} &nbsp; | &nbsp;
          {post.status}
        </p>
      </div>
      <div className='flex gap-3'>
        <button
          onClick={handleClickEdit}
          className='text-blue-500 hover:underline'
        >
          Edit
        </button>
        <button className='text-red-500 hover:underline'>Delete</button>
      </div>
    </div>
  )
}
