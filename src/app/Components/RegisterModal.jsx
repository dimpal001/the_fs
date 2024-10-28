import Input from './Input'
import { Modal, ModalBody, ModalCloseButton, ModalHeader } from './Modal'
import Button from './Button'
import { useState } from 'react'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'

const RegisterModal = ({ isOpen, onClose, setIsLoginModalOpen }) => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [cPassword, setCPassword] = useState('')
  const [cPasswordError, setCPasswordError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [isTypeOtp, setIsTypeOtp] = useState(false)
  const [showPassowrd, setShowPassword] = useState(false)
  const [otp, setOtp] = useState('')

  const validation = () => {
    let valid = true

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.')
      valid = false
    } else {
      setEmailError('')
    }

    // // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must be at least 8 characters long, with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.'
      )
      valid = false
    } else {
      setPasswordError('')
    }

    // // Confirm password validation
    if (cPassword !== password) {
      setCPasswordError('Passwords do not match.')
      valid = false
    } else {
      setCPasswordError('')
    }

    return valid
  }

  const handleSubmit = async () => {
    setShowPassword(false)
    if (validation()) {
      try {
        setSubmitting(true)
        const response = await axios.post(`/api/auth/register`, {
          email,
          password,
        })
        setIsTypeOtp(true)
        enqueueSnackbar(response.data.message, { variant: 'success' })
      } catch (error) {
        enqueueSnackbar(error.response.data.message, { variant: 'error' })
      } finally {
        setSubmitting(false)
      }
    }
  }

  const verifyOtp = async () => {
    if (otp === '') {
      enqueueSnackbar('Enter a valid OTP', { variant: 'error' })
      return
    }
    if (otp.length !== 6) {
      enqueueSnackbar('Enter 6-digit OTP', { variant: 'error' })
      return
    }
    try {
      setVerifying(true)
      const response = await axios.post('/api/auth/register/verify-otp', {
        email: email,
        userInputOTP: otp,
      })
      onClose()
      enqueueSnackbar(response?.data?.message, { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message, { variant: 'error' })
    } finally {
      setVerifying(false)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassowrd)
  }

  return (
    <Modal size={'sm'} isOpen={isOpen}>
      <ModalHeader>
        {isTypeOtp ? 'Enter OTP' : 'Registed here'}

        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
      <ModalBody>
        {isTypeOtp ? (
          <div className='flex flex-col gap-3'>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder={'Enter 6-digit OTP'}
            />
            <Button loading={verifying} onClick={verifyOtp} label={'Submit'} />
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            <Input
              error={emailError}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError('')
              }}
              value={email}
              placeholder={'Your mail address'}
            />
            <Input
              type={showPassowrd ? 'text' : 'password'}
              error={passwordError}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordError('')
              }}
              value={password}
              placeholder={'A strong password'}
            />
            <Input
              type={showPassowrd ? 'text' : 'password'}
              error={cPasswordError}
              onChange={(e) => {
                setCPassword(e.target.value)
                setCPasswordError('')
              }}
              value={cPassword}
              placeholder={'Confirm password'}
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
            <Button
              loading={submitting}
              onClick={handleSubmit}
              label={'Register now'}
            />
            <button
              title='Back to Login'
              className='text-sm text-blue-600'
              onClick={() => {
                onClose()
                setIsLoginModalOpen(true)
              }}
            >
              Back to Login
            </button>
          </div>
        )}
      </ModalBody>
    </Modal>
  )
}

export default RegisterModal
