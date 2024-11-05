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

const AboutServerPage = async () => {
  const initialContent = await fetchAboutData()

  return <AboutPage initialContent={initialContent} />
}

export default AboutServerPage
