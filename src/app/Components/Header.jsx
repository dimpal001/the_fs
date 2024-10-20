'use client'

import { CircleUserRound, Menu, Search, SearchCheck, X } from 'lucide-react'
import Button from './Button'
import { useEffect, useState } from 'react'
import RegisterModal from './RegisterModal'
import LoginModal from './LoginModal'
import { useUserContext } from '../context/UserContext'
import { DynamicMenu } from './DynamicMenu'
import { ClickItem } from './Customs'
import { usePathname, useRouter } from 'next/navigation'
import CreatePost from './CreatePost'
import { enqueueSnackbar } from 'notistack'
import axios from 'axios'
import { useCategoryContext } from '../context/CategoryContext'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, setUser } = useUserContext()
  const { setSelectedCategoryId } = useCategoryContext()
  const router = useRouter()

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState)
  }

  const pathname = usePathname()
  const [isShow, setIsShow] = useState(true)
  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    if (pathname.includes('admin/dashboard')) {
      setIsShow(false)
    } else {
      setIsShow(true)
    }
  }, [pathname])

  const handleFetchCategory = async () => {
    try {
      const response = await axios.get('/api/admin/category')
      setCategoryList(response.data)
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    }
  }

  const handleClick = (item) => {
    router.push(`/category/${item?.slug}`)
  }

  useEffect(() => {
    handleFetchCategory()
  }, [])

  return (
    <div>
      {isShow && (
        <div>
          <div className='lg:p-1 p-5 flex lg:px-16 lg:py-9 shadow-pink-200 shadow-md justify-between items-center'>
            {/* Categories  */}
            <div>
              <Menu
                size={40}
                className='cursor-pointer'
                onClick={() => setIsMenuOpen(true)}
              />
              <Drawer
                open={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                direction='left'
                className='w-full'
                size={300}
              >
                <div className='p-5'>
                  <X
                    className='m-3 absolute cursor-pointer top-0 right-0'
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className='flex flex-col w-full gap-5 p-5 tracking-wider'>
                    <p className='text-first text-3xl pb-5'>Categories</p>
                    {categoryList.length > 0 &&
                      categoryList.map((item, index) => (
                        <p
                          className='cursor-pointer hover:text-first uppercase font-extralight'
                          key={index}
                          name={item.name}
                          onClick={() => {
                            setIsMenuOpen(false)
                            handleClick(item)
                          }}
                        >
                          {item.name}
                        </p>
                      ))}
                    <div className='flex flex-col lg:hidden gap-4'>
                      <SearchBox
                        onClick={() => {
                          router.push('/search')
                          setIsMenuOpen(false)
                        }}
                      />
                      <CreatePost
                        setIsLoginModalOpen={setIsLoginModalOpen}
                        setIsMenuOpen={setIsMenuOpen}
                      />
                      {!user && (
                        // Login
                        <div
                          onClick={() => {
                            setIsMenuOpen(false)
                            setIsLoginModalOpen(true)
                          }}
                          className='flex items-center gap-2 cursor-pointer group'
                        >
                          <p className='font-semibold group-hover:text-first'>
                            Sign in
                          </p>
                          <CircleUserRound className='font-semibold group-hover:text-first' />
                        </div>
                      )}
                      {user && (
                        <DynamicMenu button={<CircleUserRound />}>
                          {user.role === 'admin' && (
                            <ClickItem
                              label={'Dashboard'}
                              onClick={() => {
                                setIsMenuOpen(false)
                                router.push('/admin/dashboard')
                              }}
                            />
                          )}
                          <ClickItem
                            label={'Profile'}
                            onClick={() => {
                              toggleDrawer()
                              router.push(`/profile/${user?.id}`)
                            }}
                          />
                          <ClickItem
                            label={'Account'}
                            onClick={() => {
                              setIsMenuOpen(false)
                              router.push('/user/account')
                            }}
                          />
                          <ClickItem
                            label={'Posts'}
                            onClick={() => {
                              setIsMenuOpen(false)
                              router.push('/user/my-posts')
                            }}
                          />
                          <ClickItem
                            label={'Logout'}
                            onClick={() => {
                              setIsMenuOpen(false)
                              localStorage.removeItem('user')
                              setUser(null)
                              router.push('/')
                            }}
                          />
                        </DynamicMenu>
                      )}
                    </div>
                  </div>
                </div>
              </Drawer>
            </div>

            <Link href={'/'}>
              <Image
                className='lg:ms-28 max-md:w-[160px]'
                src={
                  'https://the-fashion-salad.blr1.cdn.digitaloceanspaces.com/logos/The%20Fashion%20Salad%20(3).png'
                }
                width={250}
                height={10}
                alt='The fashion salad'
              />
            </Link>

            {/* User  */}
            <div className='flex max-md:hidden items-center gap-4'>
              <SearchBox
                onClick={() => {
                  router.push('/search')
                }}
              />
              <CreatePost setIsLoginModalOpen={setIsLoginModalOpen} />
              {!user && (
                // Login
                <div
                  onClick={() => setIsLoginModalOpen(true)}
                  className='flex items-center gap-2 cursor-pointer group p-2'
                >
                  <p className='font-semibold group-hover:text-first'>
                    Sign in
                  </p>
                  <CircleUserRound className='font-semibold group-hover:text-first' />
                </div>
              )}
              {user && (
                <DynamicMenu button={<CircleUserRound />}>
                  {user.role === 'admin' && (
                    <ClickItem
                      label={'Dashboard'}
                      onClick={() => {
                        router.push('/admin/dashboard')
                      }}
                    />
                  )}
                  <ClickItem
                    label={'Profile'}
                    onClick={() => {
                      toggleDrawer()
                      router.push(`/profile/${user?.id}`)
                    }}
                  />
                  <ClickItem
                    label={'Account'}
                    onClick={() => {
                      router.push('/user/account')
                    }}
                  />
                  <ClickItem
                    label={'Posts'}
                    onClick={() => {
                      router.push('/user/my-posts')
                    }}
                  />
                  <ClickItem
                    label={'Logout'}
                    onClick={() => {
                      localStorage.removeItem('user')
                      setUser(null)
                      router.push('/')
                    }}
                  />
                </DynamicMenu>
              )}
            </div>
          </div>
          {isRegisterModalOpen && (
            <RegisterModal
              isOpen={true}
              onClose={() => setIsRegisterModalOpen(false)}
              setIsLoginModalOpen={setIsLoginModalOpen}
            />
          )}
          {isLoginModalOpen && (
            <LoginModal
              isOpen={true}
              onClose={() => setIsLoginModalOpen(false)}
              setIsRegisterModalOpen={setIsRegisterModalOpen}
            />
          )}
        </div>
      )}
    </div>
  )
}

const NavItem = ({ name, onClick }) => {
  return (
    <div>
      <p
        onClick={onClick}
        className='uppercase text-first lg:font-thin hover:underline cursor-pointer text-sm tracking-[2px]'
      >
        {name}
      </p>
    </div>
  )
}

const SearchBox = ({ onClick }) => {
  return (
    <div onClick={onClick}>
      <div className='flex items-center gap-2 cursor-pointer group lg:p-2'>
        <p className='font-semibold group-hover:text-first'>Search</p>
        <Search className='font-semibold group-hover:text-first' />
      </div>
    </div>
  )
}

export default Header
