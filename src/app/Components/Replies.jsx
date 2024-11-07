'use client'

import React, { useState, useRef, useEffect } from 'react'
import TextArea from './TextArea'
import Button from './Button'
import Avatar from './Avatar'
import { useUserContext } from '../context/UserContext'
import Input from './Input'
import { enqueueSnackbar } from 'notistack'
import axios from 'axios'

const Replies = ({ replies, postId }) => {
  const [replyContent, setReplyContent] = useState('')
  const [externalLink, setExternalLink] = useState('')
  const [replyToId, setReplyToId] = useState(null) // For nested replies
  const [name, setName] = useState('')
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })

  const popupRef = useRef(null)
  const { user } = useUserContext()

  const handleReplyToReply = (id, event) => {
    const buttonRect = event.target.getBoundingClientRect()
    setReplyToId(id)
    setIsPopupVisible(true)
    setPopupPosition({
      top: buttonRect.bottom + window.scrollY + 5,
      left: buttonRect.left + window.scrollX - 100,
    })
  }

  const handleSubmitReply = async ({ status }) => {
    if (replyContent === '') {
      enqueueSnackbar('Please leave a message...')
      return
    }
    if (externalLink && !externalLink.startsWith('https://')) {
      enqueueSnackbar('Link should start with https://', { variant: 'error' })
      return
    }

    try {
      const response = await axios.post('/api/replies', {
        blog_post_id: postId,
        reply_to_id: status === 'post' ? replyToId : null,
        content: replyContent,
        author_id: user?.id || null,
        name: name || 'Anonymous',
        link: externalLink || null,
      })

      setReplyContent('')
      setExternalLink('')
      setReplyToId(null)
      setIsPopupVisible(false)
    } catch (error) {}
  }

  const renderLink = (text) => {
    const urlRegex = /https?:\/\/[^\s]+/g // Regex to match URLs
    return text.split(urlRegex).map((part, index) => {
      const matchedUrl = text.match(urlRegex)
      if (matchedUrl && matchedUrl[index]) {
        return (
          <span key={index}>
            {part}
            <a
              href={matchedUrl[index]}
              target='_blank'
              rel='noopener noreferrer'
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              {matchedUrl[index]}
            </a>
          </span>
        )
      }
      return part
    })
  }

  // Hide popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const renderNestedReplies = (replies, parentReplyId) => {
    return replies
      .filter((reply) => reply.reply_to_id === parentReplyId)
      .map((reply) => (
        <div
          key={reply.id}
          className='shadow-sm p-2 rounded-sm bg-gray-200 mt-2'
        >
          <div className='flex gap-2 items-center'>
            <Avatar width={25} />
            <p className='font-semibold text-sm'>
              {reply.author_name || reply.name}
            </p>
            <p className='text-neutral-500 pl-2 lg:text-[12px] text-[10px]'>
              {new Date(reply.created_at).toDateString()}
            </p>
          </div>
          <p className='text-xs'>
            <div dangerouslySetInnerHTML={{ __html: reply.content }} />
          </p>
          <button
            title='Reply'
            className='text-blue-600 text-xs mt-2'
            onClick={(event) => handleReplyToReply(reply.id, event)}
          >
            Reply
          </button>

          {/* Render nested replies */}
          <div className='ml-5 mt-2'>
            {renderNestedReplies(replies, reply.id)}
          </div>
        </div>
      ))
  }

  return (
    <div className='mt-6'>
      <h2 className='text-2xl font-bold'>Replies ({replies.length})</h2>

      {/* Reply to Blog Post */}
      <div className='my-3'>
        <textarea
          placeholder='Leave your thoughts here...'
          rows={2}
          className='w-full rounded-none outline-none focus:border p-3 resize-none overflow-hidden' // Added 'overflow-hidden'
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          onInput={(e) => {
            e.target.style.height = 'auto'
            e.target.style.height = `${e.target.scrollHeight}px`
          }}
        ></textarea>

        <div className='flex gap-5'>
          {!user && (
            <input
              type='text'
              className='outline-none text-sm bg-gray-50 p-2'
              value={name} // Link to name state
              onChange={(e) => setName(e.target.value)} // Update name
              placeholder='Your name please...'
            />
          )}
          <input
            type='text'
            className='outline-none text-sm bg-gray-50 p-2'
            value={externalLink} // Link to externalLink state
            onChange={(e) => setExternalLink(e.target.value)} // Update externalLink
            placeholder='Paste your link...'
          />
        </div>
        <div className='mt-2'>
          <Button label={'Submit'} onClick={() => handleSubmitReply('post')} />{' '}
          {/* Trigger submission */}
        </div>
      </div>

      <div className='flex flex-col gap-3 mt-5'>
        {replies.length > 0 ? (
          replies
            .filter((reply) => !reply.reply_to_id) // Only show top-level replies
            .map((reply) => (
              <div
                key={reply.id}
                className='shadow-md p-2 rounded-sm bg-gray-100'
              >
                <div className='flex gap-2 items-center'>
                  <Avatar width={20} />
                  <p className='font-semibold text-sm'>
                    {reply.author_name || reply.name}
                  </p>
                  <p className='text-neutral-500 ps-2 lg:text-[12px] text-[10px]'>
                    {new Date(reply.created_at).toDateString()}
                  </p>
                </div>
                <p className='lg:text-sm mt-1 text-xs'>
                  <div dangerouslySetInnerHTML={{ __html: reply.content }} />
                </p>

                {/* Reply button */}
                <button
                  title='Reply'
                  className='text-blue-600 text-xs mt-2'
                  onClick={(event) => handleReplyToReply(reply.id, event)}
                >
                  Reply
                </button>

                {/* Render nested replies */}
                <div className='ml-5 mt-3'>
                  {renderNestedReplies(replies, reply.id)}
                </div>
              </div>
            ))
        ) : (
          <p className='text-zinc-500'>
            No replies yet. Be the first to reply!
          </p>
        )}
      </div>

      {/* Popup for replying to nested replies */}
      {isPopupVisible && (
        <div
          ref={popupRef}
          style={{
            position: 'absolute',
            top: popupPosition.top,
            left: popupPosition.left + 100,
            zIndex: 1000,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <textarea
            className='w-full text-sm focus:outline-none'
            rows={3}
            placeholder='Write your thoughts...'
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          ></textarea>
          {!user && (
            <input
              type='text'
              className='w-full focus:outline-none border-t text-sm mt-2'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Your name...'
            />
          )}
          <input
            type='text'
            className='w-full focus:outline-none border-t text-sm mt-2'
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
            placeholder='Paste URL...'
          />
          <div className='flex justify-end mt-3'>
            <button
              title='Send'
              className='p-2 text-sm text-white rounded-md px-4 bg-first'
              onClick={() => handleSubmitReply('reply')}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Replies
