const nodemailer = require('nodemailer')

const sendSubscriptionEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const mailOptions = {
      from: '"The Fashion Salad" <' + process.env.EMAIL + '>',
      to: email,
      subject: 'Welcome message',
      html: `<!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Welcome to The Fashion Salad!</title>
                  <style>
                    /* Reset styles */
                    body,
                    h1,
                    p {
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
                      background-color: #ff4081;
                      color: white;
                      text-decoration: none;
                      border-radius: 2px;
                    }

                    .text {
                      font-size: medium;
                      padding-right: 30px;
                      padding-top: 5px;
                      padding-bottom: 5px;
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
                      <h1>Welcome to The Fashion Salad!</h1>
                      <p class="text">
                        <strong>Dear ${email}</strong>, Thank you for subscribing to
                        <strong>The Fashion Salad</strong>. We’re excited to have you on
                        board! Get ready to explore the latest trends, styles, and tips
                        tailored just for you.
                      </p>
                      <p class="text">
                        Stay tuned for our updates, and don’t forget to check out our website
                        for the latest articles and features.
                      </p>
                      <p style="margin-bottom: 20px; margin-top: 20px">
                        Thanks,<br /><strong>The Fashion Salad Team</strong>
                      </p>
                    </div>
                    <div>
                      <div class="footer">
                        <p class="footer-text">
                          &copy; 2024
                          <a href="https://www.thefashionsalad.com/">The Fashion Salad</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </body>
              </html>
  `,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log(error)
  }
}

module.exports = { sendSubscriptionEmail }
