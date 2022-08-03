const mongoose = require('mongoose')

const connectDB = async (DATABASE_URL) => {
    try{
        const DB_OPTIONS = {
            dbName: 'my_auth'
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log("Connected Successfully")
    }
    catch (error){
        console.log(error);
    }
}

exports.connectDB = connectDB;

