'use client'
import dynamic from 'next/dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserContext } from '@/app/context/UserContext'
import { enqueueSnackbar } from 'notistack'

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
  const [activeSection, setActiveSection] = useState('posts')
  const [loading, setLoading] = useState(true)
  const [showDrawer, setShowDrawer] = useState(true)
  const router = useRouter()
  const { user } = useUserContext()

  useEffect(() => {
    if (!user) {
      enqueueSnackbar('You are not allowed to enter this page.', {
        variant: 'error',
      })
      router.push('/')
    }
  }, [router])

  return (
    <div className='flex h-screen bg-gray-100'>
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
          {activeSection === 'privacy-policy' && <PrivacyPolicyManagement />}
          {activeSection === 'terms-and-condition' && (
            <TermsAndConditionManagement />
          )}
          {activeSection === 'hero-posts' && <HeroPostManagement />}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
