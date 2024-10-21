import { NextResponse } from 'next/server'
import { db } from '../../../utils/db'

export async function POST(request) {
  const { follower_id, following_id } = await request.json()

  if (!follower_id || !following_id || follower_id === following_id) {
    return NextResponse.json(
      { message: 'Invalid follow request' },
      { status: 400 }
    )
  }

  try {
    // Insert follower-following relationship
    await db.query(
      'INSERT INTO Followers (follower_id, following_id) VALUES (?, ?)',
      [follower_id, following_id]
    )

    return NextResponse.json({ message: 'User followed successfully' })
  } catch (error) {
    console.error('Error adding follower:', error)
    return NextResponse.json(
      { message: 'Error adding follower' },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  const { follower_id, following_id } = await request.json()

  if (!follower_id || !following_id) {
    return NextResponse.json(
      { message: 'Invalid unfollow request' },
      { status: 400 }
    )
  }

  try {
    // Remove the follower-following relationship
    await db.query(
      'DELETE FROM Followers WHERE follower_id = ? AND following_id = ?',
      [follower_id, following_id]
    )

    return NextResponse.json({ message: 'User unfollowed successfully' })
  } catch (error) {
    console.error('Error unfollowing user:', error)
    return NextResponse.json(
      { message: 'Error unfollowing user' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const user_id = searchParams.get('user_id')
  const loggedInUserId = searchParams.get('loggedInUserId')

  if (!user_id) {
    return NextResponse.json(
      { message: 'User ID is required' },
      { status: 400 }
    )
  }

  try {
    // Fetch user details excluding password, role, otp, otp_expiration, email
    const [userRows] = await db.query(
      'SELECT id, name, image_url, created_at, updated_at FROM Users WHERE id = ?',
      [user_id]
    )

    if (userRows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const userDetails = userRows[0]

    // Fetch number of followers
    const [followerRows] = await db.query(
      'SELECT COUNT(*) as followerCount FROM Followers WHERE following_id = ?',
      [user_id]
    )

    // Fetch number of blog posts by the user
    const [blogPostRows] = await db.query(
      'SELECT COUNT(*) as blogPostCount FROM BlogPosts WHERE author_id = ? AND status = "approve"',
      [user_id]
    )

    // Check if the logged-in user is following the specified user
    let isFollowing = false
    if (loggedInUserId) {
      const [followCheckRows] = await db.query(
        'SELECT COUNT(*) as isFollowing FROM Followers WHERE follower_id = ? AND following_id = ?',
        [loggedInUserId, user_id]
      )
      isFollowing = followCheckRows[0].isFollowing > 0
    }

    // Return user details along with follower, following, blog post counts, and follow status
    return NextResponse.json({
      user: userDetails,
      followerCount: followerRows[0].followerCount,
      blogPostCount: blogPostRows[0].blogPostCount,
      isFollowing,
    })
  } catch (error) {
    console.error('Error fetching follow data:', error)
    return NextResponse.json(
      { message: 'Error fetching follow data' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  const { follower_id, following_id } = await request.json()

  if (!follower_id || !following_id) {
    return NextResponse.json(
      { message: 'Both follower_id and following_id are required' },
      { status: 400 }
    )
  }

  try {
    // Remove the follower relationship from the database
    await db.query(
      'DELETE FROM Followers WHERE follower_id = ? AND following_id = ?',
      [follower_id, following_id]
    )

    return NextResponse.json(
      { message: 'Successfully unfollowed the user' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error unfollowing user:', error)
    return NextResponse.json(
      { message: 'Error unfollowing user' },
      { status: 500 }
    )
  }
}
