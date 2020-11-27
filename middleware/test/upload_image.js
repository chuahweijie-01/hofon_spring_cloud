const fs = require('fs');
const path = require('path');
const multer = require('multer');

function checkFileType(file, callback) {
    const filetypes = /jpeg|png|jpg|image\/*/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) return callback(null, true);
    else callback(`只允許上載圖片`);
}

function storage(folderName) {
    return multer.diskStorage({
        destination: (req, file, callback) => {
            var path = `public/`;
            if (!fs.existsSync(path)) fs.mkdirSync(path);
            callback(null, path);
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    })
}

function testImageUpload(folderName) {
    return multer({
        storage: storage(folderName),
        limits: { fileSize: 100000000 },
        fileFilter: function (req, file, callback) {
            checkFileType(file, callback);
        }
    }).array('upload', 8);
}

module.exports = { testImageUpload };