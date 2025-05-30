'use client'

import {
  CircleUser,
  CircleUserRound,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  Search,
  SquarePen,
  UserRoundPen,
  X,
} from 'lucide-react'
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
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
  const { user, setUser } = useUserContext()
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
      enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
    }
  }

  const handleFetchLogo = async () => {
    try {
      const response = await axios.get('/api/admin/logos', {
        params: { mainLogo: 'logo' },
      })
      setLogoUrl(response.data[0].url)
    } catch (error) {}
  }

  const handleClick = (item) => {
    router.push(`/category/${item?.slug}`)
  }

  useEffect(() => {
    handleFetchLogo()
    handleFetchCategory()
  }, [])

  return (
    <div>
      {isShow && (
        <div>
          <div className='lg:p-1 p-5 flex lg:px-16 lg:py-6 shadow-pink-200 shadow-md justify-between items-center'>
            {/* Categories  */}
            <div>
              <div className='flex items-center gap-2'>
                <Menu
                  size={30}
                  className='cursor-pointer'
                  onClick={() => setIsMenuOpen(true)}
                />
              </div>
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
                  <div className='flex flex-col w-full gap-4 p-5 tracking-wider'>
                    <p className='text-first text-3xl pb-5'>Categories</p>
                    {categoryList.length > 0 &&
                      categoryList.map((item, index) => (
                        <Link href={`/category/${item.slug}`} key={index}>
                          <p
                            className={`cursor-pointer text-balance hover:text-first capitalize font-semibold`}
                            name={item.name}
                            onClick={() => {
                              setIsMenuOpen(false)
                              // handleClick(item)
                            }}
                          >
                            {item.name}
                          </p>
                        </Link>
                      ))}
                    <div className='flex flex-col lg:hidden gap-4'>
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
                    </div>
                  </div>
                </div>
              </Drawer>
            </div>

            <Link href={'/'}>
              {logoUrl && (
                <Image
                  className='lg:ms-28 max-md:w-[160px] max-md:-mt-4'
                  // src={
                  //   'https://cdn.thefashionsalad.com/logos/logo-20241022T042118571Z-TheFashionSalad(3).png'
                  // }
                  src={`https://cdn.thefashionsalad.com/logos/${logoUrl}`}
                  width={250}
                  height={10}
                  alt='The fashion salad'
                />
              )}
            </Link>

            {/* User  */}
            <div className='flex lg:hidden items-center gap-3'>
              <Search
                onClick={() => router.push('/search')}
                className='text-neutral-600 cursor-pointer'
                size={25}
              />
              {user && (
                <DynamicMenu
                  button={
                    user?.image_url ? (
                      <Image
                        src={`https://cdn.thefashionsalad.com/profile-pictures/${user?.image_url}`}
                        alt={user?.name || 'User'}
                        width={30}
                        height={30}
                        className='rounded-full'
                      />
                    ) : (
                      <CircleUserRound />
                    )
                  }
                >
                  {user.role === 'admin' && (
                    <ClickItem
                      icon={<LayoutDashboard size={20} />}
                      label={'Dashboard'}
                      onClick={() => {
                        router.push('/admin/dashboard')
                      }}
                    />
                  )}

                  <ClickItem
                    icon={<CircleUser size={20} />}
                    label={'Profile'}
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.push(`/profile/${user?.id}`)
                    }}
                  />

                  <ClickItem
                    icon={<UserRoundPen size={20} />}
                    label={'Account'}
                    onClick={() => {
                      router.push('/user/account')
                    }}
                  />
                  <ClickItem
                    icon={<SquarePen size={20} />}
                    label={'Create Post'}
                    onClick={() => {
                      router.push('/user/create-post')
                    }}
                  />
                  <ClickItem
                    icon={<ListTodo size={20} />}
                    label={'Posts'}
                    onClick={() => {
                      router.push('/user/my-posts')
                    }}
                  />
                  <ClickItem
                    icon={<LogOut size={20} className={'text-red-600'} />}
                    className={'text-red-600 font-semibold'}
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
                      icon={<LayoutDashboard size={20} />}
                      label={'Dashboard'}
                      onClick={() => {
                        router.push('/admin/dashboard')
                      }}
                    />
                  )}
                  <ClickItem
                    icon={<CircleUser size={20} />}
                    label={'Profile'}
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.push(`/profile/${user?.id}`)
                    }}
                  />
                  <ClickItem
                    icon={<UserRoundPen size={20} />}
                    label={'Account'}
                    onClick={() => {
                      router.push('/user/account')
                    }}
                  />
                  <ClickItem
                    icon={<SquarePen size={20} />}
                    label={'Create Post'}
                    onClick={() => {
                      router.push('/user/create-post')
                    }}
                  />
                  <ClickItem
                    icon={<ListTodo size={20} />}
                    label={'Posts'}
                    onClick={() => {
                      router.push('/user/my-posts')
                    }}
                  />
                  <ClickItem
                    icon={<LogOut size={20} className={'text-red-600'} />}
                    className={'text-red-600 font-semibold'}
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
