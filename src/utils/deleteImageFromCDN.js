/* eslint-disable no-undef */
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'

export const deleteImageFromCDN = async (imageUrl) => {
  const s3Client = new S3Client({
    endpoint: 'https://blr1.digitaloceanspaces.com',
    forcePathStyle: false,
    region: 'blr1',
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
    },
  })

  const deleteParams = {
    Bucket: 'clothes2wear',
    Key: `images/${imageUrl}`,
    ACL: 'public-read',
  }
  try {
    const data = await s3Client.send(new DeleteObjectCommand(deleteParams))

    return data
  } catch {
    throw new Error('Image deletion failed')
  }
}
