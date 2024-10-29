import Input from './Input'
import { Modal, ModalBody, ModalCloseButton, ModalHeader } from './Modal'
import Button from './Button'
import { useState } from 'react'
import { useUserContext } from '../context/UserContext'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { useRouter } from 'next/navigation'

const LoginModal = ({ isOpen, onClose, setIsRegisterModalOpen }) => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [cPasswordError, setCPasswordError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isDeactivated, setIsDeactivated] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [showPassowrd, setShowPassword] = useState(false)
  const { setUser } = useUserContext()
  const router = useRouter()

  // Toggle between login and forgot password views
  const toggleForgotPassword = () => {
    setEmailError('')
    setPasswordError('')
    setOtpSent(false)
    setIsForgotPassword(!isForgotPassword)
    setIsDeactivated(false)
  }

  const validation = () => {
    let valid = true

    // Email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // if (!emailRegex.test(email)) {
    //   setEmailError('Please enter a valid email address.')
    //   valid = false
    // } else {
    //   setEmailError('')
    // }

    // Password Validation
    if (password === '') {
      setPasswordError('Password should not be empty!')
      valid = false
    } else {
      setPasswordError('')
    }

    return valid
  }

  // Handle user login
  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowPassword(false)
    if (validation()) {
      try {
        setIsDeactivated(false)
        setSubmitting(true)
        const response = await axios.post('/api/auth/login', {
          email,
          password,
        })

        if (response.data.user.is_active === 0) {
          setIsDeactivated(true)
          return
        }

        localStorage.setItem('user', JSON.stringify(response.data.user))

        setUser(response.data.user)
        router.push('/')
        onClose()
        enqueueSnackbar('Login successfull.', {
          variant: 'success',
          autoHideDuration: 1000,
        })
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          'Something went wrong. Please try again later.'
        enqueueSnackbar(errorMessage, { variant: 'error' })
      } finally {
        setSubmitting(false)
      }
    }
  }

  // OTP Validation
  const sendOtpValidation = () => {
    let valid = true

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.')
      valid = false
    } else {
      setEmailError('')
    }

    return valid
  }

  // Send OTP for password reset
  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (sendOtpValidation()) {
      try {
        setSubmitting(true)
        const response = await axios.post('/api/auth/forgot-password', {
          email,
        })
        enqueueSnackbar(response?.data?.message, { variant: 'success' })
        setOtpSent(true)
      } catch (error) {
        enqueueSnackbar(error.response?.data?.message || 'Error sending OTP', {
          variant: 'error',
        })
      } finally {
        setSubmitting(false)
      }
    }
  }

  const resetPasswordValidation = () => {
    let valid = true

    // OTP validation
    if (otp.length !== 6) {
      setOtpError('Please enter 6 digits OTP')
      valid = false
    } else {
      setOtpError('')
    }

    // // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(newPassword)) {
      setNewPasswordError(
        'Password must be at least 8 characters long, with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.'
      )
      valid = false
    } else {
      setNewPasswordError('')
    }

    // // Confirm password validation
    if (newPassword !== confirmPassword) {
      setCPasswordError('Passwords do not match.')
      valid = false
    } else {
      setCPasswordError('')
    }

    return valid
  }

  // Handle OTP verification and password reset
  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (resetPasswordValidation()) {
      try {
        setSubmitting(true)
        const response = await axios.post(
          '/api/auth/forgot-password/verify-otp',
          {
            email,
            otp,
            newPassword,
          }
        )
        enqueueSnackbar('Password reset successfully', { variant: 'success' })
        toggleForgotPassword()
        onClose()
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || 'Error resetting password',
          { variant: 'error' }
        )
      } finally {
        setSubmitting(false)
      }
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassowrd)
  }

  return (
    <Modal size={'sm'} isOpen={isOpen}>
      <ModalHeader>
        {isForgotPassword ? 'Reset Password' : 'Login to your account'}
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
      <ModalBody>
        {!isForgotPassword ? (
          <form
            onSubmit={(e) => handleSubmit(e)}
            className='flex flex-col gap-3'
          >
            <Input
              error={emailError}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError('')
              }}
              value={email}
              placeholder={'Your email address'}
            />
            <Input
              error={passwordError}
              type={showPassowrd ? 'text' : 'password'}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordError('')
              }}
              value={password}
              placeholder={'Your password'}
            />
            <div className='text-sm flex items-center gap-2'>
              <input
                type='checkbox'
                name='showPassword'
                value={showPassowrd}
                id='showPassword'
                onChange={toggleShowPassword}
              />
              <label htmlFor='showPassword' className='cursor-pointer'>
                Show Password
              </label>
            </div>
            {isDeactivated && (
              <p className='text-sm text-red-600 text-center p-2'>
                Your account has been <strong>deactivated</strong> by the admin.
              </p>
            )}
            <Button
              loading={submitting}
              onClick={handleSubmit}
              label={'Login'}
            />
            <button
              title='Forgot Password'
              className='text-sm text-blue-600'
              onClick={toggleForgotPassword}
            >
              Forgot Password?
            </button>
            <p className='text-sm text-center'>
              New to here?{' '}
              <span
                onClick={() => {
                  onClose()
                  setIsRegisterModalOpen(true)
                }}
                className='text-blue-600 cursor-pointer'
              >
                Join now
              </span>
            </p>
          </form>
        ) : !otpSent ? (
          <form
            onSubmit={(e) => handleSendOtp(e)}
            className='flex flex-col gap-3'
          >
            <Input
              error={emailError}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError('')
              }}
              value={email}
              placeholder={'Your email address'}
            />
            <Button
              loading={submitting}
              onClick={handleSendOtp}
              label={'Send OTP'}
            />
            <button
              title='Back to Login'
              className='text-sm text-blue-600'
              onClick={toggleForgotPassword}
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form
            onSubmit={(e) => handleResetPassword(e)}
            className='flex flex-col gap-3'
          >
            <Input
              error={otpError}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value)
                setOtpError('')
              }}
              placeholder={'Enter OTP'}
            />
            <Input
              error={newPasswordError}
              type={'password'}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setNewPasswordError('')
              }}
              placeholder={'New Password'}
            />
            <Input
              error={cPasswordError}
              type={'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setCPasswordError('')
              }}
              placeholder={'Confirm Password'}
            />
            <Button
              loading={submitting}
              onClick={handleResetPassword}
              label={'Reset Password'}
            />
            <button
              title='Back to Login'
              className='text-sm text-blue-600'
              onClick={toggleForgotPassword}
            >
              Back to Login
            </button>
          </form>
        )}
      </ModalBody>
    </Modal>
  )
}

export default LoginModal
