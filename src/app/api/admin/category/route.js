import { NextResponse } from 'next/server'
import { db } from '../../../../utils/db'
import slugify from 'slugify'
import jwt from 'jsonwebtoken'

// Create a new category
export async function POST(request) {
  // Authentication
  const token = request.cookies.get('token')
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const decoded = jwt.verify(token.value, process.env.JWT_SECRET)

  if (decoded.role !== 'admin') {
    return NextResponse.json(
      { message: 'Unauthorized access!.' },
      { status: 403 }
    )
  }

  try {
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        { message: 'Category name is required' },
        { status: 400 }
      )
    }

    // Generate a slug from the category name
    let slug = slugify(name, { lower: true, strict: true })

    // Check if the category name or slug already exists
    const [existingCategory] = await db.query(
      'SELECT * FROM Categories WHERE name = ? OR slug = ?',
      [name, slug]
    )

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { message: 'Category name or slug already exists' },
        { status: 400 }
      )
    }

    // Insert the category with the generated slug
    const [result] = await db.query(
      'INSERT INTO Categories (name, slug) VALUES (?, ?)',
      [name, slug]
    )

    if (result.affectedRows === 1) {
      const [allCategories] = await db.query(
        'SELECT name, slug FROM Categories ORDER BY name ASC'
      )
      return NextResponse.json(
        {
          message: 'Category created successfully',
          id: result.insertId,
          allCategories,
        },
        { status: 201 }
      )
    } else {
      console.error('Insertion did not affect any rows:', result)
      return NextResponse.json(
        { message: 'Failed to create category' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error creating category:', error.message)
    return NextResponse.json(
      { message: 'Error creating category' },
      { status: 500 }
    )
  }
}

// Get all categories or a specific category by ID
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const [category] = await db.query(
        'SELECT * FROM Categories WHERE id = ?',
        [id]
      )
      if (category.length === 0) {
        return NextResponse.json(
          { message: 'Category not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(category[0], { status: 200 })
    } else {
      const [categories] = await db.query(
        'SELECT * FROM Categories ORDER BY name DESC'
      )
      return NextResponse.json(categories, { status: 200 })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Error fetching categories' },
      { status: 500 }
    )
  }
}

// Update a category by ID
export async function PATCH(request) {
  // Authentication
  const token = request.cookies.get('token')
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const decoded = jwt.verify(token.value, process.env.JWT_SECRET)

  if (decoded.role !== 'admin') {
    return NextResponse.json(
      { message: 'Unauthorized access!.' },
      { status: 403 }
    )
  }
  try {
    const body = await request.json()
    const { id, name } = body

    if (!id || !name) {
      return NextResponse.json(
        { message: 'Category ID and new name are required' },
        { status: 400 }
      )
    }

    // Generate the new slug based on the new name
    const newSlug = slugify(name, { lower: true, strict: true })

    // Check if the new name or slug already exists (excluding the current category)
    const [existingCategory] = await db.query(
      'SELECT * FROM Categories WHERE (name = ? OR slug = ?) AND id != ?',
      [name, newSlug, id]
    )

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { message: 'Category name or slug already exists' },
        { status: 400 }
      )
    }

    // Update the category's name and slug
    const [result] = await db.query(
      'UPDATE Categories SET name = ?, slug = ? WHERE id = ?',
      [name, newSlug, id]
    )

    if (result.affectedRows === 1) {
      return NextResponse.json(
        { message: 'Category updated successfully' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { message: 'Category not found or not updated' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error updating category:', error.message)
    return NextResponse.json(
      { message: 'Error updating category' },
      { status: 500 }
    )
  }
}

// Delete a category by ID
export async function DELETE(request) {
  // Authentication
  const token = request.cookies.get('token')
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const decoded = jwt.verify(token.value, process.env.JWT_SECRET)

  if (decoded.role !== 'admin') {
    return NextResponse.json(
      { message: 'Unauthorized access!.' },
      { status: 403 }
    )
  }
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'Category ID is required' },
        { status: 400 }
      )
    }

    const [result] = await db.query('DELETE FROM Categories WHERE id = ?', [id])

    // Check if a row was affected
    if (result.affectedRows === 1) {
      return NextResponse.json(
        { message: 'Category deleted successfully' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { message: 'No category found with the given ID' },
        { status: 404 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting category' },
      { status: 500 }
    )
  }
}
