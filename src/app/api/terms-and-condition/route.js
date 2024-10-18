import { NextResponse } from 'next/server'
import { db } from '../../../utils/db'

export async function PATCH(request) {
  try {
    const { data } = await request.json()

    console.log(data)

    await db.query('UPDATE TermsAndCondition SET content = ? WHERE id = 1', [
      data,
    ])

    return NextResponse.json({ message: 'About us updated' }, { status: 200 })
  } catch (error) {
    console.error('Error updating data:', error)
    return NextResponse.json({ error: 'Error updating data' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const [about] = await db.query(
      'SELECT * FROM TermsAndCondition WHERE id = 1'
    )

    if (!about || about.length === 0) {
      return NextResponse.json({ error: 'About Us not found' }, { status: 404 })
    }

    return NextResponse.json(about[0], { status: 200 })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Error fetching post' }, { status: 500 })
  }
}
