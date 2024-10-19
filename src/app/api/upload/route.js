// pages/api/upload.js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'

const client = new S3Client({
  region: 'blr1',
  endpoint: 'https://the-fashion-salad.blr1.digitaloceanspaces.com',
  credentials: {
    accessKeyId: 'DO00AREQYJDZ4KNKJ6AT',
    secretAccessKey: 'SWPRt+2D3e2fYSp6E8g1zfivrPCi3JkH+w9ggKBG5Sg',
  },
})

export default async function POST(request) {
  const { file } = request.body
  const params = {
    Bucket: 'the-fashion-salad',
    Key: `profile-pictures/${file.name}`,
    Body: file.data,
    ACL: 'public-read',
  }

  try {
    const command = new PutObjectCommand(params)
    await client.send(command)
    const fileUrl = `https://${params.Bucket}.${client.config.endpoint}/${params.Key}`
    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
