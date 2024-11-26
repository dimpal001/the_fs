// src/app/about/page.server.jsx
import axios from 'axios'
import AboutPage from './AboutPage'

const fetchAboutData = async () => {
  try {
    const response = await axios.get('https://thefashionsalad.com/api/about')
    return response.data.content
  } catch (err) {
    console.error(err)
    return ''
  }
}

export const metadata = {
  title: 'About Us - The Fashion Salad',
  description:
    'Learn more about The Fashion Salad, our mission, and what we do.',
  keywords: 'about, fashion salad, our mission, team, story',
}

const AboutServerPage = async () => {
  const initialContent = await fetchAboutData()

  return <AboutPage initialContent={initialContent} />
}

export default AboutServerPage
