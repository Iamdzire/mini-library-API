require('dotenv').config()
const connectDb = require('./src/config/db')
const app = require('./app')
const port = process.env.PORT || 5000

const startServer = async () => {
    try {
        await connectDb()
        app.listen(port, () => console.log(`Server running and listening on port ${port}`))
    }catch(error){
        console.error("Failed to start server: ", error.message)
        process.exit(1)
    }
}

startServer() 