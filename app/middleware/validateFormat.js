const fileType = require('file-type');
const fs = require('fs');
const path = require('path');
const readChunk  = require('read-chunk');

/**
 * Middleware for validating file format
 */
const accepted_extensions = ['jpg', 'png', 'gif'];
module.exports = (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }
        // For MemoryStorage, validate the format using `req.file.buffer`
        // For DiskStorage, validate the format using `fs.readFile(req.file.path)` from Node.js File System Module
        const filePath = path.join(process.env.PWD,req.file.path);
        const buffer = readChunk.sync(filePath, 0, 4100);
        let mime = fileType(buffer);
        // if can't be determined or format not accepted
        if(!mime || !accepted_extensions.includes(mime.ext)){
            fs.unlink(filePath, function(err) {
            if (err) throw err;
            console.log('file deleted');
            });
    
            return next('The uploaded file is not in ' + accepted_extensions.join(", ") + ' format!');
        }
    
        return next();
    } catch (error) {
        return res.status(401).json({
            message: 'Error Validate File',
            error : error.message
        });
    }
    
}