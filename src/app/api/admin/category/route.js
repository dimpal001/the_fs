import { NextResponse } from 'next/server'
import { db } from '../../../../utils/db'

// Create a new category
export async function POST(request) {
  try {
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        { message: 'Category name is required' },
        { status: 400 }
      )
    }

    const [result] = await db.query(
      'INSERT INTO Categories (name) VALUES (?)',
      [name]
    )

    if (result.affectedRows === 1) {
      const [allCategories] = await db.query(
        'SELECT name FROM Categories ORDER BY name ASC'
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
      const [categories] = await db.query('SELECT * FROM Categories')
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
  try {
    const body = await request.json()
    const { id, name } = body
    console.log(id)
    console.log(name)

    if (!id || !name) {
      return NextResponse.json(
        { message: 'Category ID and new name are required' },
        { status: 400 }
      )
    }

    const [result] = await db.query(
      'UPDATE Categories SET name = ? WHERE id = ?',
      [name, id]
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
    console.error(error)
    return NextResponse.json(
      { message: 'Error updating category' },
      { status: 500 }
    )
  }
}

// Delete a category by ID
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    console.log(searchParams)

    if (!id) {
      return NextResponse.json(
        { message: 'Category ID is required' },
        { status: 400 }
      )
    }

    const [result] = await db.query('DELETE FROM Categories WHERE id = ?', [id])
    console.log(result)

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
    console.log(error)
    return NextResponse.json(
      { message: 'Error deleting category' },
      { status: 500 }
    )
  }
}
