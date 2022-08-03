const dotenv = require('dotenv');
// for env variable access
dotenv.config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/connectdb.js');
const userRoutes = require('./routes/userRoute.js')
const app = express();

// CORS Policy
app.use(cors());

// Connect Database
const MONGO_URL = process.env.MONGO_URL
connectDB.connectDB(MONGO_URL);

//JSON
app.use(express.json());

// Load Routes
app.use('/api/user', userRoutes);

const port = process.env.PORT


app.listen(port,() => {
    console.log(`your server running in ${port}`);
})
