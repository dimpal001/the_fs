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

export const metadata = {
  title: 'Privacy Policy - The Fashion Salad',
}

const AboutServerPage = async () => {
  const initialContent = await fetchPrivacyPolicyData()

  return <PrivacyPolicyPage initialContent={initialContent} />
}

export default AboutServerPage
