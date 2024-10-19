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
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isDeactivated, setIsDeactivated] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const { setUser } = useUserContext()
  const router = useRouter()

  // Toggle between login and forgot password views
  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword)
    setIsDeactivated(false)
  }

  // Handle user login
  const handleSubmit = async () => {
    try {
      setIsDeactivated(false)
      setSubmitting(true)
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      })

      if (response.data.user[0].is_active === 0) {
        setIsDeactivated(true)
        return
      }

      localStorage.setItem('token', JSON.stringify(response.data.token))
      localStorage.setItem('user', JSON.stringify(response.data.user[0]))
      setUser(response.data.user[0])
      router.push('/')
      onClose()
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  // Send OTP for password reset
  const handleSendOtp = async () => {
    try {
      setSubmitting(true)
      const response = await axios.post('/api/auth/forgot-password', { email })
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

  // Handle OTP verification and password reset
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      enqueueSnackbar('Passwords do not match', { variant: 'error' })
      return
    }

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

  return (
    <Modal size={'sm'} isOpen={isOpen}>
      <ModalHeader>
        {isForgotPassword ? 'Reset Password' : 'Login to your account'}
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
      <ModalBody>
        {!isForgotPassword ? (
          <div className='flex flex-col gap-3'>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder={'Your email address'}
            />
            <Input
              type={'password'}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder={'Your password'}
            />
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
          </div>
        ) : !otpSent ? (
          <div className='flex flex-col gap-3'>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder={'Your email address'}
            />
            <Button
              loading={submitting}
              onClick={handleSendOtp}
              label={'Send OTP'}
            />
            <button
              className='text-sm text-blue-600'
              onClick={toggleForgotPassword}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder={'Enter OTP'}
            />
            <Input
              type={'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={'New Password'}
            />
            <Input
              type={'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={'Confirm Password'}
            />
            <Button
              loading={submitting}
              onClick={handleResetPassword}
              label={'Reset Password'}
            />
            <button
              className='text-sm text-blue-600'
              onClick={toggleForgotPassword}
            >
              Back to Login
            </button>
          </div>
        )}
      </ModalBody>
    </Modal>
  )
}

export default LoginModal
