const nodemailer = require('nodemailer')

const sendBlogPostAlert = async (emails, link) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Iterate over emails and send individually
    for (const email of emails) {
      const mailOptions = {
        from: `"The Fashion Salad" <${process.env.EMAIL}>`,
        to: email,
        subject: 'New Blog Post Alert!',
        html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>New Blog Post Alert from The Fashion Salad!</title>
              <style>
                /* Reset styles */
                body, h1, p {
                  margin: 0;
                  padding: 0;
                  font-family: Arial, sans-serif;
                }
                h1 {
                  padding-bottom: 25px;
                  font-size: 30px;
                  color: #b20660;
                }
                /* Container styles */
                .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 12px;
                  border: 1px solid #e0e0e0;
                }
                .content {
                  padding: 15px;
                  font-size: medium;
                  padding-top: 30px;
                }
                /* Button styles */
                .button {
                  font-size: 16px;
                  font-weight: bold;
                  margin-top: 15px;
                  margin-bottom: 15px;
                  border-color: transparent;
                  padding: 12px 24px;
                  background-color: #b20660;
                  color: white;
                  text-decoration: none;
                  border-radius: 2px;
                  display: inline-block;
                }
                .footer {
                  margin-top: 20px;
                  font-size: medium;
                  color: rgb(56, 55, 55);
                  padding: 30px;
                  background: #eeecec;
                }
                a {
                  color: rgb(56, 55, 55);
                  text-decoration: none;
                }
                .footer-text {
                  text-align: center;
                }
                /* Button hover effect */
                .button:hover {
                  background-color: #c51162;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="content">
                  <h1>New Blog Post Alert!</h1>
                  <p>
                    Hi there! We're excited to let you know that a new blog post has been
                    published on <strong>The Fashion Salad</strong>!
                  </p>
                  <p>
                    <strong>Blog Post Title:</strong> <em>Your Latest Style Guide</em>
                  </p>
                  <a href="${link}" class="button">Read the Full Blog</a>
                  <p>
                    Thank you for being a valued subscriber,<br /><strong>The Fashion Salad Team</strong>
                  </p>
                  <p class="footer-text">
                    If you don't want to receive these emails, you can unsubscribe at any
                    time.
                  </p>
                </div>
                <div class="footer">
                  <p class="footer-text">
                    &copy; 2024 <a href="https://www.thefashionsalad.com/">The Fashion Salad</a>
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      }

      // Send email
      await transporter.sendMail(mailOptions)
    }
  } catch (error) {}
}

module.exports = { sendBlogPostAlert }
