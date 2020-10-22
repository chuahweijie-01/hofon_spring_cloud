const fs = require('fs');
const ads_model = require(`../../model/admin/ads`);
const upload_image = require('../../middleware/admin/upload_image')

exports.upload_ads_image = (req, res, next) => {
    var adsId = req.params.id;
    upload_image.upload_ads_image(req, res, (err) => {
        if (err) {
            req.flash(`flash`, {
                msg: err, type: `error`
            });
            req.session.save(function (err) {
                if (adsId) res.redirect(`/api/ads/${adsId}`);
                else res.redirect(`/api/ads/new`);
            })
        } else if (req.file == undefined) {
            req.flash(`flash`, {
                msg: `無法獲取廣告圖檔路徑，請重新上傳。`, type: `error`
            });
            req.session.save(function (err) {
                if (adsId) res.redirect(`/api/ads/${adsId}`);
                else res.redirect(`/api/ads/new`);
            })
        } else if (req.file.length <= 0) {
            req.flash(`flash`, {
                msg: `沒有圖片`, type: `error`
            });
            req.session.save(function (err) {
                if (adsId) res.redirect(`/api/ads/${adsId}`);
                else res.redirect(`/api/ads/new`);
            })
        } else {
            next();
        }
    })
}

exports.addNewAds = (req, res) => {

    adsInfo = {
        company_id: req.session.company,
        advertisement_name: req.body.advertisement_name,
        advertisement_image: `/image/admin/${req.session.company}/ads/${req.file.filename}`,
        advertisement_link: req.body.advertisement_link
    }

    ads_model.addNewAds(adsInfo)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/ads');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/ads');
            })
        })
}

exports.getAds = (req, res) => {
    var adsId = req.params.id;
    ads_model.getAds(adsId)
        .then((result) => {
            var ads_info = req.session.ads_info;
            req.session.ads_info = null;
            res.render('ads_edit', {
                title: "廣告",
                icon: '<span class="glyphicon glyphicon-comment" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/ads">廣告管理</a></li><li class="active">更新廣告</li>',
                message: req.flash(`flash`),
                validation: req.flash(`validation`),
                data: result,
                ads_info: ads_info
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/admin');
            })
        })
}

exports.getAdsList = (req, res) => {
    ads_model.getAdsList(req.session.company)
        .then((result) => {
            res.render('ads', {
                title: "廣告",
                icon: '<span class="glyphicon glyphicon-comment" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">廣告管理</li>',
                message: req.flash(`flash`),
                data: result
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/dashboard');
            })
        })
}

exports.ads_new = (req, res) => {
    var ads_info = req.session.ads_info;
    req.session.ads_info = null;
    res.render('ads_add', {
        title: "廣告",
        icon: '<span class="glyphicon glyphicon-comment" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/ads">廣告管理</a></li><li class="active">新增廣告</li>',
        message: req.flash(`flash`),
        validation: req.flash(`validation`),
        ads_info: ads_info
    });
}


exports.updateAds = (req, res) => {
    adsInfo = {
        advertisement_name: req.body.advertisement_name,
        advertisement_link: req.body.advertisement_link
    }

    ads_model.updateAds(req.params.id, adsInfo)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/ads');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/ads');
            })
        })
}

exports.deleteAds = (req, res) => {
    ads_model.deleteAds(req.params.id)
        .then((result) => {
            try {
                fs.unlinkSync(`public${result[0].advertisement_image}`)
                req.flash(`flash`, {
                    msg: `資料刪除成功`, type: 'success'
                });
                req.session.save(function (err) {
                    res.redirect('/api/ads');
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
                res.redirect('/api/ads');
            })
        })
}

exports.updateAdsImage = (req, res) => {
    ads_model.getAdsImage(req.params.id)
        .then((result) => {
            try {
                fs.unlinkSync(`public${result[0].advertisement_image}`)
            } catch (error) {
                console.log(error)
                throw new Error(`該圖片已從資料庫移除，但不在服務器内。`)
            }
            image_path = `/image/admin/${req.session.company}/ads/${req.file.filename}`
            return ads_model.updateAdsImage(req.params.id, image_path)
        })
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect(`/api/ads/${req.params.id}`);
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect(`/api/ads/${req.params.id}`);
            })
        })
}


