import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Italic,
  Heading as HeadingIcon,
  List,
  ListOrdered,
  ImagePlus,
} from 'lucide-react'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Image from '@tiptap/extension-image'
import React, { useEffect, useRef, useState } from 'react'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const MenuBar = ({ editor, images }) => {
  const fileInputRef = useRef(null)
  if (!editor) return null

  const s3Client = new S3Client({
    endpoint: 'https://blr1.digitaloceanspaces.com',
    forcePathStyle: false,
    region: 'blr1',
    credentials: {
      accessKeyId: 'DO00TK892YLJBW7MV82Y',
      secretAccessKey: '9a1ueUXe6X+ngKZoZEyvnfjQw5PI7t3bzbquBCWc2bY',
    },
  })

  const handleImageUplaod = async (fileName, file) => {
    const params = {
      Bucket: 'the-fashion-salad',
      Key: `blog-post-images/${fileName}`,
      Body: file,
      ACL: 'public-read',
    }
    try {
      images.push(fileName)
      await s3Client.send(new PutObjectCommand(params))
      const url = `https://the-fashion-salad.blr1.cdn.digitaloceanspaces.com/blog-post-images/${fileName}`
      console.log(url)

      editor.chain().focus().setImage({ src: url }).run()
    } catch (error) {}
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    const sanitizedFileName = file.name.replace(/\s+/g, '')
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
    const customFileName = `blog-${timestamp}-${sanitizedFileName}`
    handleImageUplaod(customFileName, file)
  }

  return (
    <div className='flex gap-2 border border-dotted p-2 bg-gray-100'>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1 rounded-md ${
          editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
        }`}
        type='button'
      >
        <HeadingIcon size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded-md ${
          editor.isActive('bold') ? 'bg-gray-300' : ''
        }`}
        type='button'
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded-md ${
          editor.isActive('italic') ? 'bg-gray-300' : ''
        }`}
        type='button'
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded-md ${
          editor.isActive('bulletList') ? 'bg-gray-300' : ''
        }`}
        type='button'
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1 rounded-md ${
          editor.isActive('orderedList') ? 'bg-gray-300' : ''
        }`}
        type='button'
      >
        <ListOrdered size={18} />
      </button>

      <input
        type='file'
        ref={fileInputRef}
        accept='image/*'
        className='hidden'
        onChange={handleFileChange}
      />

      <button
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <ImagePlus size={18} />
      </button>
    </div>
  )
}

const CustomEditor = ({ value, onChange, images }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        HTMLAttributes: {
          class: 'text-2xl max-md:text-xl font-bold',
          levels: [2],
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc ml-2',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal ml-2',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'my-3',
        },
        inline: true,
      }),
    ],
    content: value || '', // Ensure initial content is set
    editorProps: {
      attributes: {
        class: 'p-3 focus:outline-none',
      },
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor) {
      const handleUpdate = () => {
        const htmlContent = editor.getHTML()
        onChange(htmlContent)
      }
      editor.on('update', handleUpdate)

      return () => {
        editor.off('update', handleUpdate)
      }
    }
  }, [editor, onChange])

  // Update the editor content when the value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '') // Set content when value changes
    }
  }, [editor, value])

  if (!isClient) return null

  return (
    <div className='w-full'>
      <MenuBar images={images} editor={editor} />

      <EditorContent
        editor={editor}
        className='min-h-[150px] editor-content mt-2 bg-white border border-dotted border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   resize-none text-sm text-gray-800 placeholder-gray-400'
      />
    </div>
  )
}

export default CustomEditor
