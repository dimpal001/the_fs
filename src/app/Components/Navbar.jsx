import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { AlignJustify } from 'lucide-react'

import { useCategoryContext } from '../context/CategoryContext'
import { usePathname, useRouter } from 'next/navigation'
import { useUserContext } from '../context/UserContext'
import { enqueueSnackbar } from 'notistack'
import axios from 'axios'

const Navbar = () => {
  const router = useRouter()
  const { setSelectedCategoryId } = useCategoryContext()
  const pathname = usePathname()
  const [isShow, setIsShow] = useState(true)
  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    if (pathname.includes('admin/dashboard') || pathname.includes('user/')) {
      setIsShow(false)
    } else {
      setIsShow(true)
    }
  }, [pathname])

  useEffect(() => {
    handleFetchCategory()
  }, [])

  const handleFetchCategory = async () => {
    try {
      const response = await axios.get('/api/admin/category')
      console.log(response.data)
      setCategoryList(response.data)
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    }
  }

  const handleClick = (item) => {
    const formattedTitle = item.name
      .toLowerCase()
      .replace(/[?/:;'&*$#%.,!]/g, '')
      .replace(/ /g, '-')
      .replace(/--+/g, '-')
      .trim()

    setSelectedCategoryId(item.id)
    localStorage.setItem('selectedCategoryId', item.id)
    localStorage.setItem('selectedCategoryName', JSON.stringify(item.name))
    router.push(`/category/${formattedTitle}`)
  }

  return (
    <div>
      {isShow && (
        <div className='h-20 flex items-center px-5'>
          {/* <AlignJustify className='h-6 w-6 sm:hidden text-black' /> */}
          <div className='flex w-full justify-center gap-12 items-center tracking-wider'>
            {categoryList.length > 0 &&
              categoryList.map((item, index) => (
                <NavItem
                  key={index}
                  name={item.name}
                  onClick={() => handleClick(item)}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar

const NavItem = ({ name, onClick }) => {
  return (
    <div>
      <p
        onClick={onClick}
        className='uppercase text-first cursor-pointer text-md tracking-[2px]'
      >
        {name}
      </p>
    </div>
  )
}
