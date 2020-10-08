const fs = require('fs');
const product_model = require('../../model/admin/product');
const upload_image = require('../../middleware/admin/upload_image');

exports.upload_product_images = (req, res, next) => {
    upload_image.upload_product_image(req, res, (err) => {
        if (err) {
            req.flash(`flash`, {
                msg: err, type: `error`
            });
            req.session.save(function (err) {
                if (req.params.id) res.redirect(`/api/product/${req.params.id}`);
                else res.redirect(`/api/product/new`);
            })
        } else if (req.files == undefined) {
            req.flash(`flash`, {
                msg: `無法獲取产品圖檔路徑，請重新上傳。`, type: `error`
            });
            req.session.save(function (err) {
                if (req.params.id) res.redirect(`/api/product/${req.params.id}`);
                else res.redirect(`/api/product/new`);
            })
        } else if (req.files.length <= 0) {
            req.flash(`flash`, {
                msg: `沒有圖片`, type: `error`
            });
            req.session.save(function (err) {
                if (req.params.id) res.redirect(`/api/product/${req.params.id}`);
                else res.redirect(`/api/product/new`);
            })
        } else {
            next();
        }
    })
}

exports.product_create = (req, res) => {

    product_info = {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_member_price: req.body.product_member_price,
        product_stock: req.body.product_stock,
        category_id: req.body.category_id,
        product_rating: req.body.product_rating,
        product_description: req.body.product_description,
        company_id: req.session.company,
        product_latest_price: req.body.product_price,
    }

    product_model.product_create(product_info)
        .then((product_id) => {
            var image_path = [];
            for (var i = 0; i < (req.files).length; i++) {
                image_path.push([product_id, `/image/admin/${req.session.company}/product/${req.files[i].filename}`])
            }
            return product_model.insert_product_image(image_path)
        })
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/product');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/product');
            })
        })
}

exports.product_display = (req, res) => {
    var category, image;
    product_model.category_list(req.session.company)
        .then((result) => {
            category = result;
            return product_model.product_image(req.params.id)
        })
        .then((result) => {
            image = result;
            return product_model.product(req.params.id, req.session.company)
        })
        .then((result) => {
            var product_info_temp = req.session.product_info;
            req.session.product_info = null;
            res.render('product_edit', {
                title: "產品",
                icon: '<span class="glyphicon glyphicon-book" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/product">產品</a></li><li class="active">更新產品</li>',
                message: req.flash(`flash`),
                validation: req.flash(`validation`),
                data: result,
                category: category,
                product_info: product_info_temp,
                image: image
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/product');
            })
        })
}

exports.product_publish = (req, res) => {
    product_model.product_publish(req.params.product_id, req.params.category_id, req.session.company).then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        res.status(404).send(err);
    })
}

exports.product_unpublish = (req, res) => {
    product_model.product_unpublish(req.params.product_id, req.session.company).then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        res.status(404).send(err);
    })
}

exports.product_display_list = (req, res) => {
    product_model.product_list(req.session.company, req.query).then((result) => {
        res.render('product', {
            title: "產品",
            icon: '<span class="glyphicon glyphicon-book" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">產品</li>',
            message: req.flash(`flash`),
            data: result.rows,
            pagination: result.pagination,
            pagination_path: 'product'
        });
    }).catch((err) => {
        req.flash(`flash`, {
            msg: err.message, type: `error`
        });
        req.session.save(function (err) {
            res.redirect('/api/dashboard');
        })
    })
}

exports.product_new = (req, res) => {
    product_model.category_list(req.session.company).then((result => {
        var product_info = req.session.product_info;
        req.session.product_info = null;
        res.render('product_add', {
            title: "產品",
            icon: '<span class="glyphicon glyphicon-book" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/product">產品</a></li><li class="active">新增產品</li>',
            message: req.flash(`flash`),
            validation: req.flash(`validation`),
            data: result,
            product_info: product_info
        });
    })).catch((err) => {
        req.flash(`flash`, {
            msg: err.message, type: `error`
        });
        req.session.save(function (err) {
            res.redirect('/api/product');
        })
    })
}

exports.product_update = (req, res) => {

    var product_info = {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_member_price: req.body.product_member_price,
        product_stock: req.body.product_stock,
        category_id: req.body.category_id,
        product_rating: req.body.product_rating,
        product_description: req.body.product_description,
        product_latest_price: req.body.product_price,
    }

    product_model.product_update(req.params.id, product_info)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect(`/api/product/${req.params.id}`);
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect(`/api/product/${req.params.id}`);
            })
        })
}

exports.product_delete = (req, res) => {
    product_model.product_delete(req.params.id)
        .then((result) => {
            try {
                for (var i = 0; i < result.length; i++) {
                    fs.unlinkSync(`public${result[i].image_path}`)
                }
                req.flash(`flash`, {
                    msg: '已停止销售该产品', type: 'success'
                });
                req.session.save(function (err) {
                    res.redirect(`/api/product`);
                })
            } catch (error) {
                console.log(error)
                throw new Error(`該圖片已從資料庫移除，但不在服務器内。`)
            }
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/product');
            })
        })
}

exports.image_delete = (req, res) => {
    product_model.image_delete(req.params.id)
        .then((result) => {
            try {
                fs.unlinkSync(`public${result[0].image_path}`);
                req.flash(`flash`, {
                    msg: '产品图片删除成功', type: 'success'
                });
                req.session.save(function (err) {
                    res.redirect(`/api/product/${req.params.product}`);
                })
            } catch (error) {
                console.log(error)
                throw new Error(`該圖片已從資料庫移除，但不在服務器内。`)
            }
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect(`/api/product/${req.params.product}`);
            })
        })
}

exports.product_image_update = (req, res) => {
    var image_path = [];
    for (var i = 0; i < (req.files).length; i++) {
        image_path.push([req.params.id, `/image/admin/${req.session.company}/product/${req.files[i].filename}`]);
    }
    product_model.insert_product_image(image_path)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect(`/api/product/${req.params.id}`);
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect(`/api/product/${req.params.id}`);
            })
        })
}

exports.product_image_total = (req, res, next) => {
    product_model.product_image_total(req.params.id)
        .then((result) => {
            if (result[0].total_image >= 3) throw new Error(`已超出可以添加的图片上限，请先删除部分图片后再进行添加。`)
            else next()
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect(`/api/product/${req.params.id}`);
            })
        })
}