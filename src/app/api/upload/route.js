import { PutObjectCommand } from '@aws-sdk/client-s3'
import AWS from 'aws-sdk'
import formidable from 'formidable'
import { NextResponse } from 'next/server'

const client = new AWS.S3({
  region: 'blr1',
  endpoint: 'https://the-fashion-salad.blr1.digitaloceanspaces.com',
  credentials: {
    accessKeyId: 'DO00AREQYJDZ4KNKJ6AT',
    secretAccessKey: 'SWPRt+2D3e2fYSp6E8g1zfivrPCi3JkH+w9ggKBG5Sg',
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request) {
  const form = formidable({ multiples: false })
  const formData = await new Promise((resolve, reject) => {
    form.parse(request.body, (err, fields, files) => {
      if (err) {
        reject(err)
      }
      resolve({ fields, files })
    })
  })

  const file = formData.files.file

  if (!file) {
    return NextResponse.json({ message: 'File not found' }, { status: 400 })
  }

  const uploadParams = {
    Bucket: 'the-fashion-salad',
    Key: `profile-pictures/${file.originalFilename}`,
    Body: file.filepath,
    ACL: 'public-read',
  }

  try {
    console.log('Uploading to S3...')

    return (
      client.putObject({
        Bucket: 'the_fashion_salad',
        Key: `profile-pictures/${file.originalFilename}`,
        Body: file.filepath,
        ACL: 'public-read',
      }),
      async () => NextResponse.json({ message: 'Done' }, { status: 201 })
    )

    // console.log('Upload response:', response)

    // const fileUrl = `https://${uploadParams.Bucket}.${client.config.endpoint}/${uploadParams.Key}`

    // return NextResponse.json({ url: fileUrl }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
