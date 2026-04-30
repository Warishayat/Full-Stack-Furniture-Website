const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('MongoDB connected');
    }catch(error){
        console.error('DATABASE CONNECTION ERROR:', error.message || error);
        process.exit(1);
    }
}

module.exports = connectDB;