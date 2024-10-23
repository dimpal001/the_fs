import {
  FileStack,
  Users,
  List,
  MessageCircle,
  Bell,
  Info,
  Lock,
  CheckCircle,
  Star,
  Mail,
  ChevronDown,
  ChevronUp,
  FileImage,
} from 'lucide-react'
import { useState } from 'react'

const Sidebar = ({ activeSection, setActiveSection }) => {
  const [expandedSections, setExpandedSections] = useState({
    users: true,
    blogPosts: false,
    policies: false,
  })

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }))
  }

  return (
    <div className='w-64 bg-white '>
      <div className='p-6'>
        <h1 className='text-2xl max-md:text-sm font-bold text-gray-800'>
          Admin Dashboard
        </h1>
      </div>
      <nav className='mt-10'>
        <ul className=''>
          {/* Users Section */}
          <li>
            <button
              title='Users'
              onClick={() => toggleSection('users')}
              className='px-6 py-3 w-full flex items-center justify-between text-left text-gray-800 hover:bg-gray-200'
            >
              <div className='flex items-center gap-3'>
                <Users size={20} className='text-gray-800' />
                Users
              </div>
              {expandedSections.users ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
            {expandedSections.users && (
              <ul className='ml-8 mt-2'>
                <li>
                  <button
                    title='Users'
                    onClick={() => setActiveSection('users')}
                    className={`px-6 flex items-center gap-2 py-2 w-full text-left ${
                      activeSection === 'users'
                        ? 'bg-gray-100 font-semibold text-first'
                        : 'text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <Users
                      size={16}
                      className={`${
                        activeSection === 'users'
                          ? 'text-first'
                          : 'text-gray-800'
                      }`}
                    />
                    Users
                  </button>
                </li>
                <li>
                  <button
                    title='Subscribers'
                    onClick={() => setActiveSection('subscribers')}
                    className={`px-6 flex items-center gap-2 py-2 w-full text-left ${
                      activeSection === 'subscribers'
                        ? 'bg-gray-100 font-semibold text-first'
                        : 'text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <Bell
                      size={16}
                      className={`${
                        activeSection === 'subscribers'
                          ? 'text-first'
                          : 'text-gray-800'
                      }`}
                    />
                    Subscribers
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Blog Posts Section */}
          <li>
            <button
              title='Blog Posts'
              onClick={() => toggleSection('blogPosts')}
              className='px-6 py-3 w-full flex items-center justify-between text-left text-gray-800 hover:bg-gray-200'
            >
              <div className='flex items-center gap-3'>
                <FileStack size={20} className='text-gray-800' />
                Blog Posts
              </div>
              {expandedSections.blogPosts ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
            {expandedSections.blogPosts && (
              <ul className='ml-8 mt-2'>
                <li>
                  <button
                    title='Categories'
                    onClick={() => setActiveSection('categories')}
                    className={`px-6 flex items-center gap-2 py-2 w-full text-left ${
                      activeSection === 'categories'
                        ? 'bg-gray-100 font-semibold text-first'
                        : 'text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <List
                      size={16}
                      className={`${
                        activeSection === 'categories'
                          ? 'text-first'
                          : 'text-gray-800'
                      }`}
                    />
                    Categories
                  </button>
                </li>
                <li>
                  <button
                    title='Posts'
                    onClick={() => setActiveSection('posts')}
                    className={`px-6 flex items-center gap-2 py-2 w-full text-left ${
                      activeSection === 'posts'
                        ? 'bg-gray-100 font-semibold text-first'
                        : 'text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <FileStack
                      size={16}
                      className={`${
                        activeSection === 'posts'
                          ? 'text-first'
                          : 'text-gray-800'
                      }`}
                    />
                    Posts
                  </button>
                </li>
                <li>
                  <button
                    title='Hero Posts'
                    onClick={() => setActiveSection('hero-posts')}
                    className={`px-6 py-2 w-full flex items-center gap-2 text-left ${
                      activeSection === 'hero-posts'
                        ? 'bg-gray-100 font-semibold text-first'
                        : 'text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <Star
                      size={16}
                      className={`${
                        activeSection === 'hero-posts'
                          ? 'text-first'
                          : 'text-gray-800'
                      }`}
                    />
                    Hero Posts
                  </button>
                </li>
                <li>
                  <button
                    title='Replies'
                    onClick={() => setActiveSection('replies')}
                    className={`px-6 flex items-center gap-2 py-2 w-full text-left ${
                      activeSection === 'replies'
                        ? 'bg-gray-100 font-semibold text-first'
                        : 'text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <MessageCircle
                      size={16}
                      className={`${
                        activeSection === 'replies'
                          ? 'text-first'
                          : 'text-gray-800'
                      }`}
                    />
                    Replies
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Policies Section */}
          <li>
            <button
              title='Plicies'
              onClick={() => toggleSection('policies')}
              className='px-6 py-3 w-full flex items-center justify-between text-left text-gray-800 hover:bg-gray-200'
            >
              <div className='flex items-center gap-3'>
                <Lock size={20} className='text-gray-800' />
                Policies
              </div>
              {expandedSections.policies ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
            {expandedSections.policies && (
              <ul className='ml-8 mt-2'>
                <li>
                  <button
                    title='Privacy Policy'
                    onClick={() => setActiveSection('privacy-policy')}
                    className={`px-6 flex items-center gap-2 py-2 w-full text-left ${
                      activeSection === 'privacy-policy'
                        ? 'bg-gray-100 font-semibold text-first'
                        : 'text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <Lock
                      size={16}
                      className={`${
                        activeSection === 'privacy-policy'
                          ? 'text-first'
                          : 'text-gray-800'
                      }`}
                    />
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    title='Terms and Condition'
                    onClick={() => setActiveSection('terms-and-condition')}
                    className={`px-6 flex items-center gap-2 py-2 w-full text-left ${
                      activeSection === 'terms-and-condition'
                        ? 'bg-gray-100 font-semibold text-first'
                        : 'text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle
                      size={16}
                      className={`${
                        activeSection === 'terms-and-condition'
                          ? 'text-first'
                          : 'text-gray-800'
                      }`}
                    />
                    Terms & Condition
                  </button>
                </li>
                <li>
                  <button
                    title='About us'
                    onClick={() => setActiveSection('about-us')}
                    className={`px-6 flex items-center gap-2 py-2 w-full text-left ${
                      activeSection === 'about-us'
                        ? 'bg-gray-100 font-semibold text-first'
                        : 'text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <Info
                      size={16}
                      className={`${
                        activeSection === 'about-us'
                          ? 'text-first'
                          : 'text-gray-800'
                      }`}
                    />
                    About Us
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Messages Section */}
          <li>
            <button
              title='Contact'
              onClick={() => setActiveSection('contact')}
              className={`px-6 py-3 w-full flex items-center gap-3 text-left ${
                activeSection === 'contact'
                  ? 'bg-gray-100 font-semibold text-first'
                  : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              <Mail
                size={20}
                className={`${
                  activeSection === 'contact' ? 'text-first' : 'text-gray-800'
                }`}
              />
              Messages
            </button>
          </li>

          {/* Logo Section */}
          <li>
            <button
              title='Logo'
              onClick={() => setActiveSection('logos')}
              className={`px-6 py-3 w-full flex items-center gap-3 text-left ${
                activeSection === 'logos'
                  ? 'bg-gray-100 font-semibold text-first'
                  : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              <FileImage
                size={20}
                className={`${
                  activeSection === 'logos' ? 'text-first' : 'text-gray-800'
                }`}
              />
              Logos
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
