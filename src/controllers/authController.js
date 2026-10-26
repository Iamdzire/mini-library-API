const authModel = require('../models/authModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {
        const {name, email, password, confirmPassword} = req.body
        if(!name || !email || !password || !confirmPassword){
            return res.status(400).json({
                error: "Please fill the required fields."
            })
        }
        const existingUser = await authModel.findOne({email})
        if(existingUser){
            return res.status(400).json({
                error: "A user with this email already exists."
            })
        }
        if(password !== confirmPassword){
            return res.status(400).json({
                error: "Passwords do not match."
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new authModel({
            name, email, password: hashedPassword
        })
        await newUser.save()

        return res.status(201).json({
            message: "User created successfully.",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}


const login = async (req, res) => {
    try{
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({
                error: "Please fill the required fields."
            })
        }
        const user = await authModel.findOne({
            email
        })
        if(!user){
            console.error("User not found.")
            return res.status(401).json({
                error: "Invalid email or password."
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            console.error("Password invalid.")
            return res.status(401).json({
                error: "Invalid email or password."
            })
        }
        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "24h"}
        )
        return res.status(200).json({
            message: "Login successful.",
            data: {
                id: user._id,
                token,
                name: user.name,
                email: user.email
            }
        })
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {register, login}