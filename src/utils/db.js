import mysql from 'mysql2/promise'

let pool

export const connectToDatabase = async () => {
  if (!pool) {
    try {
      console.log('Initializing MySQL connection pool...') // Debugging log
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      })
      console.log('MySQL connection pool created successfully.')
    } catch (error) {
      console.error('Error creating MySQL connection pool:', error)
      throw new Error('Could not create a connection pool')
    }
  }
  return pool
}

export const db = {
  query: async (queryString, params) => {
    const pool = await connectToDatabase()
    try {
      console.log('Executing query:', queryString, params) // Debugging log
      const rows = await pool.execute(queryString, params)
      console.log('Query result:', rows) // Debugging log
      return rows
    } catch (error) {
      console.error('Database query error:', error)
      throw new Error(`Query failed: ${error.message}`)
    }
  },
}
