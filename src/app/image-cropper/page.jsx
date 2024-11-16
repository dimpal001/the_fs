'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import ImageCropper from '../Components/ImageCroper'
import Button from '../Components/Button'

const Home = () => {
  const [croppedImage, setCroppedImage] = useState(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [isShowImageCroper, setIsShowImageCroper] = useState(false)

  const handleCropComplete = (image) => {
    setCroppedImage(image)
  }

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>Upload and Crop Your Image</h2>
      <Button
        onClick={() => setIsShowImageCroper(true)}
        label={'Upload Image'}
      />
      {isShowImageCroper && (
        <ImageCropper
          isOpen={true}
          fixedWidth={1280}
          fixedHeight={720}
          onCropComplete={handleCropComplete}
          onClose={() => setIsShowImageCroper(false)}
        />
      )}
      {croppedImage && (
        <div className='mt-4'>
          <h3 className='text-xl font-bold'>Cropped Image Result:</h3>
          <Image
            src={croppedImage}
            width={80}
            height={45}
            alt='Cropped image'
          />
        </div>
      )}
    </div>
  )
}

export default Home
