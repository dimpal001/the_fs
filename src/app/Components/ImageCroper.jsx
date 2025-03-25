import React, { useState, useRef } from 'react'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from './useDebounceEffect'
import 'react-image-crop/dist/ReactCrop.css'
import { Modal, ModalBody, ModalCloseButton } from './Modal'

// This is to demonstrate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

export default function ImageCroper({ isOpen, onClose, onCropComplete }) {
  const [imgSrc, setImgSrc] = useState('')
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const hiddenAnchorRef = useRef(null)
  const blobUrlRef = useRef('')
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState(16 / 9)
  const [fileName, setFileName] = useState(null)

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name)
      setCrop(undefined)
      const reader = new FileReader()
      reader.addEventListener('load', () => setImgSrc(reader.result || ''))
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  async function onDownloadCropClick() {
    const image = imgRef.current
    const previewCanvas = previewCanvasRef.current
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    // Use regular canvas as fallback
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = completedCrop.width * scaleX
    tempCanvas.height = completedCrop.height * scaleY
    const ctx = tempCanvas.getContext('2d')
    if (!ctx) {
      throw new Error('No 2D context')
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      tempCanvas.width,
      tempCanvas.height
    )

    const blob = await new Promise((resolve) => {
      tempCanvas.toBlob(resolve, 'image/jpeg', 1)
    })

    if (!blob) {
      throw new Error('Failed to create blob')
    }

    const croppedImageUrl = URL.createObjectURL(blob)
    onCropComplete(blob, croppedImageUrl, fileName)
    onClose()
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // Use canvasPreview for fast rendering
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        )
      }
    },
    100,
    [completedCrop, scale, rotate]
  )

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined)
    } else {
      setAspect(16 / 9)

      if (imgRef.current) {
        const { width, height } = imgRef.current
        const newCrop = centerAspectCrop(width, height, 16 / 9)
        setCrop(newCrop)
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height))
      }
    }
  }

  return (
    <Modal isOpen={isOpen} size={'4xl'}>
      <ModalCloseButton onClick={onClose} />
      <ModalBody>
        <div className='App'>
          <div className='Crop-Controls'>
            <input
              className='p-2 border-[2px] mb-5 border-dotted'
              type='file'
              accept='image/*'
              onChange={onSelectFile}
            />
            {fileName && (
              <button
                onClick={onDownloadCropClick}
                className='rounded-sm p-2 px-4 bg-blue-600 text-white ml-4'
              >
                Upload
              </button>
            )}
            {/* <div>
              <label htmlFor='scale-input'>Scale: </label>
              <input
                id='scale-input'
                type='number'
                step='0.1'
                value={scale}
                disabled={!imgSrc}
                onChange={(e) => setScale(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor='rotate-input'>Rotate: </label>
              <input
                id='rotate-input'
                type='number'
                value={rotate}
                disabled={!imgSrc}
                onChange={(e) =>
                  setRotate(
                    Math.min(180, Math.max(-180, Number(e.target.value)))
                  )
                }
              />
            </div> */}
            {/* <div>
              <button onClick={handleToggleAspectClick}>
                Toggle aspect {aspect ? 'off' : 'on'}
              </button>
            </div> */}
          </div>
          {!!imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minHeight={100}
            >
              <img
                ref={imgRef}
                alt='Crop me'
                src={imgSrc}
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
          {!!completedCrop && (
            <>
              <div>
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    border: '1px solid black',
                    objectFit: 'contain',
                    width: completedCrop.width,
                    height: completedCrop.height,
                  }}
                />
              </div>
              <div>
                {/* <button onClick={onDownloadCropClick}>Download Crop</button> */}
              </div>
            </>
          )}
        </div>
      </ModalBody>
    </Modal>
  )
}
