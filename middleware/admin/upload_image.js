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