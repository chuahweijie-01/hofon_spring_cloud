const fs = require('fs');
const album_model = require('../../model/admin/album');
const upload_product_image = require('../../middleware/admin/upload_product_image');

exports.album_display_list = (req, res) => {
    album_model.album_display_list(req.session.company)
        .then((result) => {
            res.render('album', {
                title: "相簿功能",
                icon: '<span class="glyphicon glyphicon-film" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">相簿功能</li>',
                message: req.flash(`flash`),
                data: result
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/dashboard');
            })
        })
}

exports.album_category = (req, res) => {
    album_model.album_category(req.session.company, req.params.id, req.query)
        .then((result) => {
            req.session.category_id = result.rows[0].category_id;
            res.render('album_manage', {
                title: "相簿功能",
                icon: '<span class="glyphicon glyphicon-film" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/album">相簿功能</a></li><li class="active">' + result.rows[0].category_name + '</li>',
                message: req.flash(`flash`),
                data: result.rows,
                album_name: result.rows[0].category_name,
                pagination: result.pagination,
                pagination_path: `album/${req.session.category_id}`
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/dashboard');
            })
        })
}

exports.album_add = (req, res) => {
    upload_product_image.upload_product_image(req, res, (err) => {
        if (err) {
            req.flash(`flash`, {
                msg: err,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect(`/api/album/${req.session.category_id}`);
            })
        } else {
            var image_path = [];
            for (var i = 0; i < (req.files).length; i++) {
                image_path.push([req.session.category_id, `/image/admin/${req.session.company}/product/${req.session.category_id}/${req.files[i].filename}`])
            }
            album_model.album_add(image_path, req.session.category_id, req.session.company)
                .then((result) => {
                    res.redirect(`/api/album/${req.session.category_id}`);
                })
                .catch((err) => {
                    for (var i = 0; i < (req.files).length; i++) {
                        fs.unlinkSync(`${req.files[i].destination}/${req.files[i].filename}`);
                    }
                    req.flash(`flash`, {
                        msg: err.message,
                        type: `error`
                    });
                    req.session.save(function (err) {
                        res.redirect(`/api/album/${req.session.category_id}`)
                    })
                })
        }
    })
}

exports.album_image_delete = (req, res) => {
    album_model.album_image_delete(req.params.id, req.session.company)
        .then((result) => {
            try {
                fs.unlinkSync(`public${result}`)
                res.redirect(`/api/album/${req.session.category_id}`);
            } catch (error) {
                throw new Error(`該圖片已從資料庫移除，但不在服務器内。`)
            }
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect(`/api/album/${req.session.category_id}`)
            })
        })
}