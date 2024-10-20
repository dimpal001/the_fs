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
} from 'lucide-react'

const Sidebar = ({ activeSection, setActiveSection }) => {
  return (
    <div className='w-64 bg-white '>
      <div className='p-6'>
        <h1 className='text-2xl max-md:text-sm font-bold text-gray-800'>
          Admin Dashboard
        </h1>
      </div>
      <nav className='mt-10'>
        <ul className=''>
          <li>
            <button
              onClick={() => setActiveSection('users')}
              className={`px-6 py-3 w-full flex items-center gap-3 text-left ${
                activeSection === 'users'
                  ? 'bg-gray-100 font-semibold text-first'
                  : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              <Users
                size={20}
                className={`${
                  activeSection === 'users' ? 'text-first' : 'text-gray-800'
                }`}
              />
              Users
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('posts')}
              className={`px-6 py-3 w-full flex items-center gap-3 text-left ${
                activeSection === 'posts'
                  ? 'bg-gray-100 font-semibold text-first'
                  : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              <FileStack
                size={20}
                className={`${
                  activeSection === 'posts' ? 'text-first' : 'text-gray-800'
                }`}
              />
              Posts
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('categories')}
              className={`px-6 py-3 w-full flex items-center gap-3 text-left ${
                activeSection === 'categories'
                  ? 'bg-gray-100 font-semibold text-first'
                  : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              <List
                size={20}
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
              onClick={() => setActiveSection('replies')}
              className={`px-6 py-3 w-full flex items-center gap-3 text-left ${
                activeSection === 'replies'
                  ? 'bg-gray-100 font-semibold text-first'
                  : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              <MessageCircle
                size={20}
                className={`${
                  activeSection === 'replies' ? 'text-first' : 'text-gray-800'
                }`}
              />
              Replies
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('subscribers')}
              className={`px-6 py-3 w-full flex items-center gap-3 text-left ${
                activeSection === 'subscribers'
                  ? 'bg-gray-100 font-semibold text-first'
                  : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              <Bell
                size={20}
                className={`${
                  activeSection === 'subscribers'
                    ? 'text-first'
                    : 'text-gray-800'
                }`}
              />
              Subscribers
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('about-us')}
              className={`px-6 py-3 w-full flex items-center gap-3 text-left ${
                activeSection === 'about-us'
                  ? 'bg-gray-100 font-semibold text-first'
                  : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              <Info
                size={20}
                className={`${
                  activeSection === 'about-us' ? 'text-first' : 'text-gray-800'
                }`}
              />
              About Us
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('privacy-policy')}
              className={`px-6 py-3 w-full flex items-center gap-3 text-left ${
                activeSection === 'privacy-policy'
                  ? 'bg-gray-100 font-semibold text-first'
                  : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              <Lock
                size={20}
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
              onClick={() => setActiveSection('terms-and-condition')}
              className={`px-6 py-3 w-full flex items-center gap-3 text-left ${
                activeSection === 'terms-and-condition'
                  ? 'bg-gray-100 font-semibold text-first'
                  : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              <CheckCircle
                size={20}
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
              onClick={() => setActiveSection('hero-posts')}
              className={`px-6 py-3 w-full flex items-center gap-3 text-left ${
                activeSection === 'hero-posts'
                  ? 'bg-gray-100 font-semibold text-first'
                  : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              <Star
                size={20}
                className={`${
                  activeSection === 'hero-posts'
                    ? 'text-first'
                    : 'text-gray-800'
                }`}
              />
              Hero Posts
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
