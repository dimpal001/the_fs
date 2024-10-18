export const ClickItem = ({ label, onClick }) => {
  return (
    <div onClick={onClick} className='p-2 hover:text-first cursor-pointer'>
      {label}
    </div>
  )
}
