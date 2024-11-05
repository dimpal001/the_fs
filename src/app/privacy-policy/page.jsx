// src/app/about/page.server.jsx
import axios from 'axios'
import PrivacyPolicyPage from './PrivacyPolicy'

const fetchPrivacyPolicyData = async () => {
  try {
    const response = await axios.get(
      'https://thefashionsalad.com/api/privacy-policy'
    )
    return response.data.content
  } catch (err) {
    console.error(err)
    return ''
  }
}

const AboutServerPage = async () => {
  const initialContent = await fetchPrivacyPolicyData()

  return <PrivacyPolicyPage initialContent={initialContent} />
}

export default AboutServerPage
