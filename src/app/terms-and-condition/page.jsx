// src/app/about/page.server.jsx
import axios from 'axios'
import TermsAndConditionPage from './TermsAndCondition'

const fetchTermsAndConditionData = async () => {
  try {
    const response = await axios.get(
      'https://thefashionsalad.com/api/terms-and-condition'
    )
    return response.data.content
  } catch (err) {
    console.error(err)
    return ''
  }
}

const AboutServerPage = async () => {
  const initialContent = await fetchTermsAndConditionData()

  return <TermsAndConditionPage initialContent={initialContent} />
}

export default AboutServerPage
