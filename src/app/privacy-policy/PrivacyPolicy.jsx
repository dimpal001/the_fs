const PrivacyPolicyPage = ({ initialContent }) => {
  return (
    <div className='p-5 container mx-auto lg:px-56'>
      <h2 className='text-4xl lg:text-6xl py-4 font-bold mb-4 text-center'>
        Privacy Policy
      </h2>
      <p className='lg:leading-[35px] leading-7 tracking-wide'>
        <div dangerouslySetInnerHTML={{ __html: initialContent }} />
      </p>
    </div>
  )
}

export default PrivacyPolicyPage
