const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const cloudinary = require("cloudinary").v2;
require('dotenv').config();

// Establish Connection with mongoose
const app = express();
//create the express static middleware
app.use(express.static('../../public'));

mongoose.connect(process.env.DB_CONNECTION,() => {
    app.listen(process.env.PORT || 3000,() => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
});

//connect to cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//allow json data
app.use(express.json());

//allow file upload
app.use(fileUpload({
    useTempFiles: true,
}));

// if connection is closed
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection is disconnected due to application termination');
        process.exit(0);
    });
});

module.exports = app;
