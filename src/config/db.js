const mongoose = require('mongoose')

const mongoUri = process.env.MONGO_URI

const connectDb = async () => {
    try {
        await mongoose.connect(mongoUri)
        console.log("Database connection successful")
    }catch(error){
        console.error("Database connection failed: ", error.message)
        process.exit(1)
    }
}

module.exports = connectDb