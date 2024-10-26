import React, { useState, useRef } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Modal, ModalBody, ModalCloseButton, ModalHeader } from './Modal'
import { enqueueSnackbar } from 'notistack'

const ImageCropper = ({ onCropComplete, onClose, isOpen }) => {
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const [crop, setCrop] = useState({
    unit: 'px',
    width: 160,
    height: 90,
    aspect: 16 / 9,
  })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [fileName, setFileName] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    const validFormats = ['image/jpeg', 'image/jpg']
    if (!validFormats.includes(file.type)) {
      enqueueSnackbar('Please select a JPG or JPEG image.')
      return
    }

    setFileName(file.name)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImgSrc(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onDownloadCropClick() {
    const image = imgRef.current
    const previewCanvas = previewCanvasRef.current

    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist')
    }

    const offscreen = new OffscreenCanvas(
      completedCrop.width,
      completedCrop.height
    )
    const ctx = offscreen.getContext('2d')
    // ctx.imageSmoothingEnabled = true

    if (!ctx) {
      throw new Error('No 2d context')
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    )

    const blob = await offscreen.convertToBlob({
      type: 'image/jpeg',
      quality: 1,
    })

    const croppedImageUrl = URL.createObjectURL(blob)

    onClose()

    onCropComplete(blob, croppedImageUrl, fileName)
  }

  React.useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      const canvas = previewCanvasRef.current
      const ctx = canvas.getContext('2d')
      canvas.width = completedCrop.width
      canvas.height = completedCrop.height

      ctx.drawImage(
        imgRef.current,
        completedCrop.x,
        completedCrop.y,
        completedCrop.width,
        completedCrop.height,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      )
    }
  }, [completedCrop])

  // Handle crop changes to maintain aspect ratio
  const onCropChange = (newCrop) => {
    // Calculate new dimensions while maintaining the aspect ratio
    if (newCrop.width && newCrop.height) {
      const aspectRatio = 16 / 9
      if (newCrop.width / newCrop.height > aspectRatio) {
        // Too wide, adjust width
        newCrop.width = newCrop.height * aspectRatio
      } else {
        // Too tall, adjust height
        newCrop.height = newCrop.width / aspectRatio
      }
    }
    setCrop(newCrop)
  }

  return (
    <Modal size={'4xl'} isOpen={isOpen}>
      <ModalHeader>
        <div className='flex items-center gap-5'>Upload Thumbnail</div>
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
      <ModalBody>
        {imgSrc ? (
          <div className='ImageCropper bg-white max-md:flex-col flex gap-5'>
            <ReactCrop
              className='bg-transparent'
              crop={crop}
              onChange={onCropChange} // Adjust crop dimensions
              onComplete={(newCrop) => setCompletedCrop(newCrop)} // Final crop area
              ruleOfThirds // Optional: Adds grid lines for better cropping
            >
              <img
                ref={imgRef}
                alt='Crop me'
                src={imgSrc}
                style={{ maxWidth: '100%' }}
                className='bg-transparent'
              />
            </ReactCrop>
            {!!completedCrop && (
              <div>
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    border: '1px solid black',
                    objectFit: 'cover',
                    width: completedCrop.width,
                    height: completedCrop.height,
                  }}
                />
                <button
                  className='w-full bg-blue-600 p-1 text-white rounded-sm mt-3'
                  onClick={onDownloadCropClick}
                >
                  Upload
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <input
              type='file'
              onChange={handleFileChange}
              className='p-2 border border-dotted'
            />
          </div>
        )}
      </ModalBody>
    </Modal>
  )
}

export default ImageCropper
