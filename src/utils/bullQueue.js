// bullQueue.js
const Queue = require('bull')
const { sendBlogPostAlert } = require('./sendBlogPostAlert')
const emailQueue = new Queue('emailQueue', 'redis://127.0.0.1:6379')

emailQueue.process(async (job) => {
  try {
    const { emails, link } = job.data
    await sendBlogPostAlert(emails, link)
    console.log('Email notification sent in the background')
  } catch (error) {
    console.error('Failed to send email notification:', error)
  }
})

// Expose the email queue
module.exports = emailQueue
