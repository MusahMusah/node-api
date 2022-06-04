const cloudinary = require('cloudinary').v2;

const fileUpload = async (file, path, callback) => {

    let err = null;
    let response = null;
    const extensionName = file.mimetype; // fetch the file extension
    const allowedExtension = ['image/png', 'image/jpg', 'image/jpeg'];

    if (!file) {
        err = 'No files were uploaded';
    }

    //check if the size is allowed.. limited to 1MB
    else if (file.size > 5000000) {
        err = 'File size is too large';
    }

    //check if the extension is allowed
    else if (!allowedExtension.includes(extensionName)) {
        err = 'Invalid file type';
    }

    else
    {
        await cloudinary.uploader.upload(file.tempFilePath, {folder: path}, async (error, result) => {
            if (error) {
                err = error.message
            } else {
                response = result.secure_url;
            }
        })
    }
    return callback(err, response);
}

module.exports = fileUpload;
