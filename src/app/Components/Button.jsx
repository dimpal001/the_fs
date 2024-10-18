const Button = ({
  label,
  color,
  onClick,
  loading,
  className,
  width,
  variant,
  disabled,
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'warning':
        return 'bg-yellow-500 border-yellow-500'
      case 'second':
        return 'bg-gray-500 border-gray-500'
      case 'success':
        return 'bg-green-500 border-green-500'
      case 'error':
        return 'bg-red-500 border-red-500'
      default:
        return 'bg-first border-first'
    }
  }

  return (
    <button
      onClick={!disabled && !loading ? onClick : undefined}
      className={`border capitalize rounded-sm flex justify-center ${
        (loading || disabled) && 'cursor-not-allowed opacity-65'
      } ${getVariantClass()} ${className} ${
        width ? 'w-full' : ''
      } p-2 px-5 text-white`}
      disabled={disabled} // Disable button
    >
      {loading ? 'Please wait...' : label}
    </button>
  )
}

export default Button
