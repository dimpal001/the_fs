import Button from '@/app/Components/Button'
import DeleteModal from '@/app/Components/DeleteModal'
import Input from '@/app/Components/Input'
import Loading from '@/app/Components/Loading'
import axios from 'axios'
import { X } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [filteredCategories, setFilteredCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [adding, setAdding] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true) // Track loading state
  const [filter, setFilter] = useState('') // Track filter input

  const handleFetchCategories = async () => {
    try {
      const response = await axios.get('/api/admin/category')
      setCategories(response.data)
      setFilteredCategories(response.data) // Initialize filtered categories
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false) // Stop loading when fetch completes
    }
  }

  const handleAddCategory = async () => {
    if (newCategory === '') {
      enqueueSnackbar('Enter a valid name', { variant: 'error' })
      return
    }

    try {
      setAdding(true)
      const response = await axios.post('/api/admin/category', {
        name: newCategory,
      })

      setCategories(response.data.allCategories)
      setFilteredCategories(response.data.allCategories)
      setNewCategory('')
      setSelectedCategory({})
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Error adding category', { variant: 'error' })
    } finally {
      setAdding(false)
    }
  }

  const handleEdit = (category) => {
    setIsEditing(true)
    setSelectedCategory(category)
    setNewCategory(category.name)
  }

  const handleUpdateCategory = async () => {
    if (newCategory === '') {
      enqueueSnackbar('Enter a valid name', { variant: 'error' })
      return
    }

    try {
      setSubmitting(true)
      const response = await axios.patch(`/api/admin/category`, {
        id: selectedCategory.id,
        name: newCategory,
      })

      enqueueSnackbar('Category updated successfully', { variant: 'success' })

      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === selectedCategory.id
            ? { ...category, name: newCategory }
            : category
        )
      )

      setFilteredCategories(
        (
          prevCategories // Update filtered categories
        ) =>
          prevCategories.map((category) =>
            category.id === selectedCategory.id
              ? { ...category, name: newCategory }
              : category
          )
      )

      setNewCategory('')
      setSelectedCategory({})
      setIsEditing(false)
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Error updating category', { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (category) => {
    setSelectedCategory(category)
    setDeleteModalOpen(true)
  }

  const handleDeleteCategory = async () => {
    if (!selectedCategory.id) {
      enqueueSnackbar('Category ID is missing. Please try again.', {
        variant: 'error',
      })
      return
    }

    try {
      setSubmitting(true)
      const response = await axios.delete(
        `/api/admin/category?id=${selectedCategory.id}`
      )
      enqueueSnackbar(response.data.message, { variant: 'success' })

      setCategories((previousData) =>
        previousData.filter((category) => category.id !== selectedCategory.id)
      )
      setFilteredCategories((previousData) =>
        previousData.filter((category) => category.id !== selectedCategory.id)
      )

      setSelectedCategory({})
      setDeleteModalOpen(false)
    } catch (error) {
      console.error(error)
      enqueueSnackbar(
        error.response?.data?.message || 'Error deleting category',
        { variant: 'error' }
      )
    } finally {
      setSubmitting(false)
      setSelectedCategory({})
    }
  }

  useEffect(() => {
    handleFetchCategories()
  }, [])

  // Filter categories based on user input
  useEffect(() => {
    if (filter) {
      setFilteredCategories(
        categories.filter((category) =>
          category.name.toLowerCase().includes(filter.toLowerCase())
        )
      )
    } else {
      setFilteredCategories(categories)
    }
  }, [filter, categories])

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Manage Categories</h2>
      {/* Filter Input */}
      <div className='w-72'>
        <Input
          placeholder='Filter Categories...'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <p className='pb-2 px-2 pt-3 text-gray-600'>
          {filteredCategories.length} Results found
        </p>
      </div>

      <div className='flex gap-5 max-md:overflow-x-scroll w-full'>
        {/* Category Table  */}
        <table className='w-3/4 table-auto bg-white h-full shadow-md'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='px-4 py-2'>Category Name</th>
              <th className='px-4 py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <tr key={index} className='hover:bg-gray-100'>
                  <td className='px-4 py-2 capitalize'>{category.name}</td>
                  <td className='px-4 py-2 flex justify-end'>
                    <button
                      title='Edit'
                      className='bg-blue-500 text-white px-4 py-1 rounded-sm'
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </button>
                    <button
                      title='Delete'
                      onClick={() => handleDelete(category)}
                      className='bg-red-500 text-white px-4 py-1 ml-2 rounded-sm'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <div className='flex justify-center items-center h-full'>
                <p className='p-10'>No category found</p>
              </div>
            )}
          </tbody>
        </table>

        {/* Add/Edit Category */}
        <div className='w-1/4'>
          <div className='w-full bg-gray-200 rounded-sm p-3 flex flex-col gap-1'>
            <p>{isEditing ? 'Edit' : 'Add'} category</p>
            <div className='flex relative w-full'>
              <Input
                placeholder={'Category name'}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              {isEditing && (
                <X
                  className='absolute right-2 cursor-pointer top-2'
                  onClick={() => {
                    setIsEditing(false)
                    setNewCategory('')
                  }}
                />
              )}
            </div>
            <Button
              loading={isEditing ? submitting : adding}
              onClick={isEditing ? handleUpdateCategory : handleAddCategory}
              label={isEditing ? 'Update Category' : 'Add Category'}
            />
          </div>
        </div>

        {/* Delete Modal  */}
        {deleteModalOpen && (
          <DeleteModal
            onOpen={true}
            onClose={() => setDeleteModalOpen(false)}
            onDelete={handleDeleteCategory}
          />
        )}
      </div>
    </div>
  )
}

export default CategoryManagement
