import mysql from 'mysql2/promise'

let pool

export const connectToDatabase = async () => {
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      })
    } catch (error) {
      throw new Error('Could not create a connection pool')
    }
  }
  return pool
}

export const db = {
  query: async (queryString, params) => {
    const pool = await connectToDatabase() // Ensure pool is ready
    try {
      const [rows] = await pool.execute(queryString, params)
      return rows
    } catch (error) {
      throw new Error(`Query failed: ${error.message}`)
    }
  },
}
