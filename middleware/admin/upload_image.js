const fs = require('fs');
const path = require('path');
const multer = require('multer');

const company_logo_storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var path = `public/image/admin/${req.params.id}`;
        if (!fs.existsSync(path)) { 
            fs.mkdirSync(path);
        }
        callback(null, path);
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}_${file.originalname}`);
    }
})

const company_bank_image_storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var path = `public/image/admin/${req.params.id}`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        callback(null, path);
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}_${file.originalname}`);
    }
})

const ads_storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var path = `public/image/admin/${req.session.company}`;
        if (!fs.existsSync(path)) { 
            fs.mkdirSync(path);
        }
        var path = `public/image/admin/${req.session.company}/ads`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        callback(null, path);
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}_${file.originalname}`);
    }
})

const product_storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var path = `public/image/admin/${req.session.company}/product`;
        if (!fs.existsSync(path)) { 
            fs.mkdirSync(path);
        }
        callback(null, path);
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}_${file.originalname}`);
    }
})

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

exports.upload_company_logo = multer({
    storage: company_logo_storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback);
    }
}).single('company_logo');

exports.upload_ads_image = multer({
    storage: ads_storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback);
    }
}).single('advertisement_image');

exports.upload_product_image = multer({
    storage: product_storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback);
    }
}).array('image_path', 8);

exports.upload_company_bank_image = multer({
    storage: company_bank_image_storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback);
    }
}).single('company_bank_image');

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