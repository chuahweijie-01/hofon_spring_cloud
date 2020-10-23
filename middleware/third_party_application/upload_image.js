const fs = require('fs');
const path = require('path');
const multer = require('multer');

function checkFileType(file, callback) {
    const filetypes = /jpeg|png|jpg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return callback(null, true);
    } else {
        callback(`只允許上載圖片`);
    }
}

function storage(folderName) {
    return multer.diskStorage({
        destination: (req, file, callback) => {
            var path = `public/image/${folderName}_temp`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            callback(null, path);
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    })
}

function analysisImageFunction(folderName) {
    return multer({
        storage: storage(folderName),
        limits: { fileSize: 100000000 },
        fileFilter: function (req, file, callback) {
            checkFileType(file, callback);
        }
    }).array('analysisImage', 10);
}

module.exports = { analysisImageFunction };

/*
Concept 1 of uploading bulk image from 3rd party device
1. Get all the data (Format not yet determined)
2. Store analysis date into session to be called as file name
3. In storage, generate path according to the date session.
4. Store all image into path, update into database.
5. Clear session, complete image uploading and continue with raw data.
*/

/*
Concept 2 of uploading bulk image from 3rd party device
1. Get all the data (Format not yet determined)
2. Store all image into temp file.
3. Continue to process raw data, image path set as analysis date/image_name.
4. Then, move all temp file to new created file (According to analysis date).
5. When done, clear temp.
*/