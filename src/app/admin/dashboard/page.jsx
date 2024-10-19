// 'use client'

// import Sidebar from '../../Components/components/Sidebar'
// import Header from '../../Components/components/Header'
// import UserManagement from '../../Components/components/UserManagement'
// import PostManagement from '../../Components/components/PostManagement'
// import CategoryManagement from '../../Components/components/CategoryManagement'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useUserContext } from '@/app/context/UserContext'
// import { enqueueSnackbar } from 'notistack'
// import ReplyManagement from '../../Components/components/ReplyManagement'
// import SubscriberManagement from '../../Components/components/SubscriberManagement'
// import Loading from '@/app/Components/Loading'
// import AboutUsManagement from '../../Components/components/AboutUsManagement'
// import PrivacyPolicyManagement from '../../Components/components/PrivacyPlolicyManagement'
// import TermsAndConditionManagement from '../../Components/components/TermsAndConditionManagement'
// import HeroPostManagement from '../../Components/components/HeroPostManagement'

// const AdminDashboard = () => {
//   const [activeSection, setActiveSection] = useState('posts')
//   const [loading, setLoading] = useState(true)
//   const [showDrawer, setShowDrawer] = useState(true)
//   const router = useRouter()
//   const { user } = useUserContext()

//   useEffect(() => {
//     // Check if the code is running in the browser
//     if (typeof window !== 'undefined') {
//       if (user) {
//         if (user.role === 'admin') {
//           console.log('Admin user detected.')
//           setLoading(false)
//         } else {
//           console.log('Guest user detected.')
//           router.push('/')
//         }
//       } else {
//         console.log('No user found. Redirecting.')
//         router.push('/')
//         enqueueSnackbar('You are not allowed to enter this page.', {
//           variant: 'error',
//         })
//       }
//     }
//   }, [user, router])

//   if (loading) {
//     return <Loading />
//   }

//   return (
//     <div className='flex h-screen bg-gray-100'>
//       {/* Sidebar */}
//       {showDrawer && (
//         <Sidebar
//           activeSection={activeSection}
//           setActiveSection={setActiveSection}
//         />
//       )}

//       {/* Main content */}
//       <div className='flex-1 flex flex-col'>
//         <Header setShowDrawer={setShowDrawer} showDrawer={showDrawer} />

//         {/* Dynamic content */}
//         <main className='p-4 overflow-y-scroll'>
//           {activeSection === 'users' && <UserManagement />}
//           {activeSection === 'posts' && <PostManagement />}
//           {activeSection === 'categories' && <CategoryManagement />}
//           {activeSection === 'replies' && <ReplyManagement />}
//           {activeSection === 'subscribers' && <SubscriberManagement />}
//           {activeSection === 'about-us' && <AboutUsManagement />}
//           {activeSection === 'privacy-policy' && <PrivacyPolicyManagement />}
//           {activeSection === 'terms-and-condition' && (
//             <TermsAndConditionManagement />
//           )}
//           {activeSection === 'hero-posts' && <HeroPostManagement />}
//         </main>
//       </div>
//     </div>
//   )
// }

// export default AdminDashboard

import React from 'react'

const page = () => {
  return <div>page</div>
}

export default page
