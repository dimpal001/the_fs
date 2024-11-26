const AboutPage = ({ initialContent }) => {
  return (
    <div className='p-5 container mx-auto lg:px-56'>
      <h2 className='text-4xl lg:text-6xl py-4 font-bold mb-4 text-center'>
        About Us
      </h2>
      <div
        className='lg:leading-[35px] leading-7 tracking-wide'
        dangerouslySetInnerHTML={{ __html: initialContent }}
      />
    </div>
  )
}

export default AboutPage
