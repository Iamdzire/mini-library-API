const express = require('express')
const cors = require('cors')
const app = express()
const authRoutes = require('./src/routes/authRoutes')
const bookRoutes = require('./src/routes/bookRoutes')
const readingListRoutes = require('./src/routes/readingListRoutes')



app.use(express.json()) 
app.use(cors())

// Health check
app.get('/', (req, res) => res.status(200).json({
    messgae: "Mini Library API running."
}))

// Register API Routes
app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/reading-lists', readingListRoutes)

// Handles Unknown Routes(keep last)
app.use((req, res) => res.status(404).json({
    error: "Route not found"
}))

module.exports = app