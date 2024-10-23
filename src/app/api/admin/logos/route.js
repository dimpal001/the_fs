import { NextResponse } from 'next/server'
import { db } from '../../../../utils/db'
import jwt from 'jsonwebtoken'

// New Logo
export async function POST(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { message: 'Logo URL is required' },
      { status: 400 }
    )
  }

  try {
    // Insert new logo
    const [insertResult] = await db.query(
      'INSERT INTO Logos (url, is_active) VALUES (?, ?)',
      [url, 0]
    )

    if (insertResult.affectedRows > 0) {
      return NextResponse.json(
        { message: 'Logo uploaded successfully' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { message: 'Failed to upload logo' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error adding logo:', error)
    return NextResponse.json({ message: 'Error adding logo' }, { status: 500 })
  }
}

// Get all Logos and active logo
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const mainLogo = searchParams.get('mainLogo')
  try {
    if (mainLogo) {
      const [logo] = await db.query('SELECT * FROM Logos WHERE is_active = 1')

      return NextResponse.json(logo, { status: 200 })
    }

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

    // Fetch all logos
    const [logos] = await db.query('SELECT * FROM Logos')

    // Return all logos
    return NextResponse.json(logos, { status: 200 })
  } catch (error) {
    console.error('Error fetching logos:', error)
    return NextResponse.json(
      { message: 'Error fetching logos' },
      { status: 500 }
    )
  }
}

// Activate a Logo
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

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { message: 'Logo ID is required' },
      { status: 400 }
    )
  }

  try {
    // Deactivate all logos first
    const [deactivateResult] = await db.query(
      'UPDATE Logos SET is_active = FALSE'
    )

    // Check if deactivation was successful
    if (deactivateResult.affectedRows === 0) {
      return NextResponse.json(
        { message: 'No logos were deactivated. Please try again.' },
        { status: 500 }
      )
    }

    // Activate the selected logo
    const [activateResult] = await db.query(
      'UPDATE Logos SET is_active = TRUE WHERE id = ?',
      [id]
    )

    // Check if the logo was successfully activated
    if (activateResult.affectedRows > 0) {
      return NextResponse.json(
        { message: 'Logo activated successfully' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { message: 'No logo was activated. Please check the logo ID.' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error activating logo:', error)
    return NextResponse.json(
      { message: 'Error activating logo' },
      { status: 500 }
    )
  }
}

// Delete a Logo
export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { message: 'Logo ID is required' },
      { status: 400 }
    )
  }

  try {
    // Delete the logo
    const [deleteResult] = await db.query('DELETE FROM Logos WHERE id = ?', [
      id,
    ])

    if (deleteResult.affectedRows > 0) {
      return NextResponse.json(
        { message: 'Logo deleted successfully' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { message: 'No logo was deleted. Please check the logo ID.' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error deleting logo:', error)
    return NextResponse.json(
      { message: 'Error deleting logo' },
      { status: 500 }
    )
  }
}
