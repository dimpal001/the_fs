'use client'
import dynamic from 'next/dynamic'

import { useEffect, useState } from 'react'
import ManageLogos from '@/app/Components/components/ManageLogos'
import useAuth from '@/app/context/useAuth'
import { Helmet } from 'react-helmet'
import { enqueueSnackbar } from 'notistack'
import { useRouter } from 'next/navigation'
import { useUserContext } from '@/app/context/UserContext'
import Button from '@/app/Components/Button'
import Link from 'next/link'
import Loading from '@/app/Components/Loading'

const ContactManagement = dynamic(
  () => import('../../Components/components/ContactManagement'),
  {
    ssr: false,
  }
)
const Sidebar = dynamic(() => import('../../Components/components/Sidebar'), {
  ssr: false,
})
const Header = dynamic(() => import('../../Components/components/Header'), {
  ssr: false,
})
const UserManagement = dynamic(
  () => import('../../Components/components/UserManagement'),
  { ssr: false }
)
const PostManagement = dynamic(
  () => import('../../Components/components/PostManagement'),
  { ssr: false }
)
const CategoryManagement = dynamic(
  () => import('../../Components/components/CategoryManagement'),
  { ssr: false }
)
const ReplyManagement = dynamic(
  () => import('../../Components/components/ReplyManagement'),
  { ssr: false }
)
const SubscriberManagement = dynamic(
  () => import('../../Components/components/SubscriberManagement'),
  { ssr: false }
)
const AboutUsManagement = dynamic(
  () => import('../../Components/components/AboutUsManagement'),
  { ssr: false }
)
const PrivacyPolicyManagement = dynamic(
  () => import('../../Components/components/PrivacyPlolicyManagement'),
  { ssr: false }
)
const TermsAndConditionManagement = dynamic(
  () => import('../../Components/components/TermsAndConditionManagement'),
  { ssr: false }
)
const HeroPostManagement = dynamic(
  () => import('../../Components/components/HeroPostManagement'),
  { ssr: false }
)

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('users')
  const [showDrawer, setShowDrawer] = useState(true)
  const { user, setUser } = useUserContext()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useAuth()

  useEffect(() => {
    if (user) {
      setLoading(false)
    } else {
      setTimeout(() => {
        setLoading(false)
      }, 4000)
    }
  }, [user])

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      {user && user.role === 'admin' ? (
        <div className='flex h-screen bg-gray-100'>
          <Helmet>
            <title>Admin Dashboard - The Fashion Salad</title>
          </Helmet>
          {/* Sidebar */}
          {showDrawer && (
            <Sidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          )}

          {/* Main content */}
          <div className='flex-1 flex flex-col'>
            <Header setShowDrawer={setShowDrawer} showDrawer={showDrawer} />

            {/* Dynamic content */}
            <main className='p-4 overflow-y-scroll'>
              {activeSection === 'users' && <UserManagement />}
              {activeSection === 'posts' && <PostManagement />}
              {activeSection === 'categories' && <CategoryManagement />}
              {activeSection === 'replies' && <ReplyManagement />}
              {activeSection === 'subscribers' && <SubscriberManagement />}
              {activeSection === 'about-us' && <AboutUsManagement />}
              {activeSection === 'privacy-policy' && (
                <PrivacyPolicyManagement />
              )}
              {activeSection === 'terms-and-condition' && (
                <TermsAndConditionManagement />
              )}
              {activeSection === 'hero-posts' && <HeroPostManagement />}
              {activeSection === 'contact' && <ContactManagement />}
              {activeSection === 'logos' && <ManageLogos />}
            </main>
          </div>
        </div>
      ) : (
        <div className='h-screen flex flex-col gap-3 justify-center items-center'>
          <p>You are not permitted to access this page.</p>
          <Link href={'/'}>
            <Button label='Back to home' />
          </Link>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
