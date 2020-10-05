const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var path = `public/image/admin/${req.params.id}`;
        if (!fs.existsSync(path)) { 
            fs.mkdirSync(path);
        }
        callback(null, path);
    },
    filename: function (req, file, callback) {
        callback(null, 'company_logo.jpg');
    }
})

function checkFileType(file, callback) {
    const filetypes = /jpeg|jpg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return callback(null, true);
    } else {
        callback(`只允許上載圖片`);
    }
}

exports.company_logo = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback);
    }
}).single('company_logo');
