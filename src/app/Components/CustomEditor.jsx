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
import { Node, mergeAttributes } from '@tiptap/core'
import React, { useEffect, useRef, useState } from 'react'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

// Custom Image Extension to wrap image inside <picture> tag
const CustomImage = Node.create({
  name: 'customImage',
  group: 'inline',
  inline: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'picture',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'picture',
      {},
      [
        'source',
        { srcset: HTMLAttributes.src, type: 'image/webp' }, // Add more sources if needed
      ],
      [
        'img',
        mergeAttributes(
          { class: 'p-3 mx-auto w-[75%] max-md:w-full' }, // Add more CSS classes if needed
          HTMLAttributes
        ),
      ],
    ]
  },
  addCommands() {
    return {
      setPictureImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})

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

  const handleImageUpload = async (fileName, file) => {
    const params = {
      Bucket: 'the-fashion-salad',
      Key: `blog-post-images/${fileName}`,
      Body: file,
      ACL: 'public-read',
    }
    try {
      images.push(fileName)
      await s3Client.send(new PutObjectCommand(params))
      const url = `https://cdn.thefashionsalad.com/blog-post-images/${fileName}`

      editor.chain().focus().setPictureImage({ src: url }).run()
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    const sanitizedFileName = file.name.replace(/\s+/g, '')
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
    const customFileName = `blog-${timestamp}-${sanitizedFileName}`
    handleImageUpload(customFileName, file)
  }

  return (
    <div className='flex sticky top-0 z-20 gap-3 border border-dotted p-2 bg-first text-white'>
      {/* Toolbar Buttons */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        type='button'
      >
        <HeadingIcon size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        type='button'
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        type='button'
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        type='button'
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
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
        type='button'
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
      CustomImage, // Custom Image extension with Picture tag
    ],
    content: value || '',
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
        className='min-h-[150px] editor-content mt-2 bg-white border border-dotted border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-justify leading-[35px] text-sm text-gray-800 placeholder-gray-400'
      />
    </div>
  )
}

export default CustomEditor
