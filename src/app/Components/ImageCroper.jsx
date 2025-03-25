/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from './useDebounceEffect'
import 'react-image-crop/dist/ReactCrop.css'

import { CloudUpload, RefreshCw } from 'lucide-react'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from './Modal'

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

export default function ImageCroper({
  isOpen,
  onClose,
  onCropComplete,
  aspectRatio,
  altText,
}) {
  const [imgSrc, setImgSrc] = useState('')
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const scale = 1
  const rotate = 0
  const aspect = aspectRatio ? aspectRatio : 4 / 5
  const [fileName, setFileName] = useState(null)
  const [imageAltText, setImageAltText] = useState(altText || '')

  const [adding, setAdding] = useState(false)

  const fileInputRef = useRef(null)

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name)
      setCrop(undefined)

      const reader = new FileReader()
      reader.addEventListener('load', () => {
        const base64String = reader.result.split(',')[1]
        const binary = atob(base64String)
        const array = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i)
        }
        const blob = new Blob([array], { type: e.target.files[0].type })
        console.log('Blob:', blob)
        setImgSrc(reader.result || '')
      })

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
    setAdding(true)
    const image = imgRef.current
    const previewCanvas = previewCanvasRef.current
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    )
    const ctx = offscreen.getContext('2d')
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
      offscreen.width,
      offscreen.height
    )

    const blob = await offscreen.convertToBlob({
      type: 'image/jpeg',
      quality: 0.65,
    })

    const croppedImageUrl = URL.createObjectURL(blob)
    onCropComplete(blob, croppedImageUrl, fileName, imageAltText)
    onClose()
    setAdding(false)
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

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  return (
    <Modal isOpen={isOpen} size={'2xl'}>
      <ModalCloseButton onClick={onClose} />
      <ModalHeader>
        Upload File
        <div className='Crop-Controls text-sm flex gap-2'>
          <input
            ref={fileInputRef}
            className='px-2 py-[4px] hidden border-blue-800 border border-dotted'
            type='file'
            accept='image/*'
            onChange={onSelectFile}
          />
        </div>
      </ModalHeader>
      <ModalBody>
        {!fileName ? (
          <div>
            <div
              onClick={handleButtonClick}
              className='flex cursor-pointer items-center flex-col justify-center h-[200px] border-2 border-dashed rounded-xl border-neutral-400 w-full'
            >
              <CloudUpload size={80} className='text-blue-800 animate-bounce' />
              <p className='text-neutral-400'>No file choosen, yet!</p>
            </div>
          </div>
        ) : (
          <div className='App h-[400px] overflow-scroll'>
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
              </>
            )}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        {fileName && (
          <div className='flex items-center'>
            <RefreshCw
              onClick={handleButtonClick}
              strokeWidth={3}
              size={25}
              className='text-blue-800 cursor-pointer'
            />
          </div>
        )}
        {fileName && (
          <input
            className='px-2 py-[4px] border text-black border-neutral-400'
            type='text'
            placeholder='Image alt text'
            value={imageAltText}
            onChange={(e) => setImageAltText(e.target.value)}
          />
        )}
        {fileName && (
          <button
            disabled={adding}
            onClick={onDownloadCropClick}
            className={`rounded-sm ${
              adding && 'opacity-60'
            } p-2 px-4 bg-blue-600 text-white`}
          >
            Upload
          </button>
        )}
      </ModalFooter>
    </Modal>
  )
}
