export const ClickItem = ({ label, onClick, className, icon }) => {
  return (
    <div
      onClick={onClick}
      className={`p-2 hover:text-first flex justify-start gap-2 items-center font-semibold cursor-pointer ${className}`}
    >
      <div className='text-neutral-600'>{icon}</div>
      {label}
    </div>
  )
}
