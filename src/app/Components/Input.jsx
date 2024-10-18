const Input = ({ lefIcon, placeholder, type, onChange, value, error }) => {
  return (
    <div className='flex w-full flex-col'>
      <div
        className={`border flex items-center ${
          error ? 'border-red-500' : 'border-neutral-400'
        }`}
      >
        {lefIcon && <span className='ml-2'>{lefIcon}</span>}
        <input
          type={type ? type : 'text'}
          onChange={onChange}
          value={value}
          className={`p-2 w-full focus:outline-none px-4 ${
            error ? 'border-red-500' : ''
          }`}
          placeholder={placeholder}
        />
      </div>
      {/* Display error message if error exists */}
      {error && <span className='text-red-500 text-xs mt-[1px]'>{error}</span>}
    </div>
  )
}

export default Input
