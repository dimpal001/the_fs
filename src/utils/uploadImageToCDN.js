/* eslint-disable no-undef */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export const uploadImageToCDN = async (image, name, prefix) => {
  const s3Client = new S3Client({
    forcePathStyle: false,
    endpoint: 'https://blr1.digitaloceanspaces.com',
    region: 'blr1',
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
    },
  })

  const extension = name.split('.').pop()
  const randomCode = Math.floor(10000 + Math.random() * 90000)
  let imageName

  if (prefix) {
    imageName = `${prefix}-image-${Date.now()}-${randomCode}.${extension}`
  } else {
    imageName = `image-${Date.now()}-${randomCode}.${extension}`
  }

  const file = new File([image], name, { type: image.type })

  if (!file) return

  const params = {
    Bucket: 'clothes2wear',
    Key: `images/${imageName}`,
    Body: await image.arrayBuffer(),
    ACL: 'public-read',
  }

  try {
    await s3Client.send(new PutObjectCommand(params))
    const imageUrl = imageName

    return imageUrl
  } catch (error) {
    console.log(error.message)
    throw new Error('Image upload failed')
  }
}
