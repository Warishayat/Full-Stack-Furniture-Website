const User = require("../../Schemas/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const RegisterUser = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message: "Please fill all the required fields"});
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });
        await newUser.save();
        res.status(201).json({message: "User registered successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const LoginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Please fill all the required fields"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid password"});
        }
        const token = jwt.sign({id: user._id, role: user.role,email:user.email}, process.env.JWT_SECRET, {expiresIn: "7d"});
        res.status(200).json({
            message: "User logged in successfully", 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isAdmin: user.role === 'admin'
            }
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error.message || error);
        res.status(500).json({message: error.message || "Internal server error"});
    }
}


module.exports = {RegisterUser, LoginUser};