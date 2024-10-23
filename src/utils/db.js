import mysql from 'mysql2/promise'

let connection

export const connectToDatabase = async () => {
  if (!connection) {
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      })
    } catch (error) {
      console.error('Database connection failed:', error.message)
      throw new Error('Could not connect to the database')
    }
  }
  return connection
}

export const db = {
  query: async (queryString, params) => {
    const conn = await connectToDatabase() // Ensure connection
    return conn.execute(queryString, params)
  },
}
