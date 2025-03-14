const fs = require('fs');
const company_model = require('../../model/admin/company');
const upload_image = require('../../middleware/admin/upload_image');
const UUID = require('uuid');

exports.upload_company_logo = (req, res, next) => {
    upload_image.upload_company_logo(req, res, (err) => {
        if (err) {
            req.flash('flash', {
                msg: err, type: 'error'
            });
            req.session.company_info = req.body
            req.session.save(function (err) {
                if (req.params.id) res.redirect(`/api/company/${req.params.id}`);
                else res.redirect(`/api/company/new`);
            })
        } else if (req.file == undefined) {
            req.flash('flash', {
                msg: '無法獲取公司商標路徑，請重新上傳。', type: 'error'
            });
            req.session.save(function (err) {
                if (req.params.id) res.redirect(`/api/company/${req.params.id}`);
                else res.redirect(`/api/company/new`);
            })
        } else if (req.file.length <= 0) {
            req.flash('flash', {
                msg: '沒有圖片', type: 'error'
            });
            req.session.save(function (err) {
                if (req.params.id) res.redirect(`/api/company/${req.params.id}`);
                else res.redirect('/api/company/new');
            })
        } else {
            next();
        }
    })
}

exports.upload_company_bank_image = (req, res, next) => {
    upload_image.upload_company_bank_image(req, res, (err) => {
        if (err) {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.company_info = req.body
            req.session.save(function (err) {
                if (req.params.id) res.redirect(`/api/company/${req.params.id}`);
                else res.redirect(`/api/company/new`);
            })
        } else if (req.file == undefined) {
            req.flash(`flash`, {
                msg: `無法獲取公司商標路徑，請重新上傳。`, type: `error`
            });
            req.session.save(function (err) {
                if (req.params.id) res.redirect(`/api/company/${req.params.id}`);
                else res.redirect(`/api/company/new`);
            })
        } else if (req.file.length <= 0) {
            req.flash(`flash`, {
                msg: `沒有圖片`, type: `error`
            });
            req.session.save(function (err) {
                if (req.params.id) res.redirect(`/api/company/${req.params.id}`);
                else res.redirect(`/api/company/new`);
            })
        } else {
            next();
        }
    })
}

exports.company_create = (req, res) => {
    company_info = {
        company_id: UUID.v4(),
        company_name: req.body.company_name,
        company_phone: req.body.company_phone,
        company_address: req.body.company_address,
        company_address_another: req.body.company_address_another,
        company_description: req.body.company_description,
        company_official_id: req.body.company_official_id,
        company_remarks: req.body.company_remarks,
        company_product_max: req.body.company_product_max,
        company_contact_fax: req.body.company_contact_fax,
        company_contact_name: req.body.company_contact_name,
        company_contact_phone: req.body.company_contact_phone,
        company_contact_position: req.body.company_contact_position,
        company_email: req.body.company_email,
        company_website: req.body.company_website,
        company_bank_name: req.body.company_bank_name,
        company_bank_name_code: req.body.company_bank_name_code,
        company_bank_branch: req.body.company_bank_branch,
        company_bank_branch_code: req.body.company_bank_branch_code,
        company_bank_account: req.body.company_bank_account,
        company_bank_account_holder: req.body.company_bank_account_holder
    }
    company_model.addNewCompany(company_info)
        .then((result) => {
            req.flash(`flash`, {
                msg: '接下來，請上傳 公司商標 以及 銀行存摺封面影本。', type: 'success'
            });
            req.session.save(function (err) {
                res.redirect(`/api/company/${result}`);
            })
        }).catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/company');
            })
        })
}

exports.company_display = (req, res) => {
    company_model.getCompany(req.params.id).then((result) => {
        var company_edit_page;
        var company_info = req.session.company_info;
        req.session.company_info = null;
        if (req.session.isAdmin) company_edit_page = 'company_edit'
        else company_edit_page = 'company_edit_client'
        res.render(company_edit_page, {
            title: "公司",
            icon: '<span class="glyphicon glyphicon-home" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/company">公司</a></li><li class="active">更新公司</li>',
            message: req.flash(`flash`),
            validation: req.flash(`validation`),
            data: result,
            company_info: company_info
        })
    }).catch((err) => {
        req.flash(`flash`, {
            msg: err.message, type: `error`
        });
        req.session.save(function (err) {
            res.redirect('/api/company');
        })
    })
}

exports.company_display_list = (req, res) => {
    company_model.getCompanyList(req.query).then((result) => {
        res.render('company', {
            title: "公司",
            icon: '<span class="glyphicon glyphicon-home" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">公司</li>',
            message: req.flash(`flash`),
            data: result.rows,
            pagination: result.pagination,
            pagination_path: 'company'
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

exports.company_new = (req, res) => {
    var company_info = req.session.company_info;
    req.session.company_info = null;
    res.render('company_add', {
        title: "公司",
        icon: '<span class="glyphicon glyphicon-home" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/company">公司</a></li><li class="active">新增公司</li>',
        message: req.flash(`flash`),
        validation: req.flash(`validation`),
        company_info: company_info
    });
}

exports.updateCompany = (req, res) => {
    company_id = req.params.id;
    company_info = {}
    if (!req.session.isAdmin) {
        company_info = {
            company_remarks: req.body.company_remarks,
            company_description: req.body.company_description
        };
    } else {
        company_info = {
            company_name: req.body.company_name,
            company_phone: req.body.company_phone,
            company_address: req.body.company_address,
            company_address_another: req.body.company_address_another,
            company_description: req.body.company_description,
            company_official_id: req.body.company_official_id,
            company_remarks: req.body.company_remarks,
            company_product_max: req.body.company_product_max,
            company_contact_fax: req.body.company_contact_fax,
            company_contact_name: req.body.company_contact_name,
            company_contact_phone: req.body.company_contact_phone,
            company_contact_position: req.body.company_contact_position,
            company_email: req.body.company_email,
            company_website: req.body.company_website,
            company_bank_name: req.body.company_bank_name,
            company_bank_name_code: req.body.company_bank_name_code,
            company_bank_branch: req.body.company_bank_branch,
            company_bank_branch_code: req.body.company_bank_branch_code,
            company_bank_account: req.body.company_bank_account,
            company_bank_account_holder: req.body.company_bank_account_holder
        }
    }
    company_model.updateCompany(company_id, company_info).then((result) => {
        req.flash(`flash`, {
            msg: result, type: 'success'
        });
        req.session.save(function (err) {
            res.redirect(`/api/company/${req.params.id}`);
        })
    }).catch((err) => {
        req.flash(`flash`, {
            msg: err.message, type: `error`
        });
        req.session.save(function (err) {
            res.redirect(`/api/company/${req.params.id}`);
        })
    })
}

exports.deleteCompany = (req, res) => {
    if (req.params.id === '1') {
        req.flash(`flash`, {
            msg: `注意！此管理臺公司不可以被刪除。`, type: `error`
        });
        req.session.save(function (err) {
            res.redirect('/api/company');
        })
    } else {
        company_model.deleteCompany(req.params.id)
            .then((result) => {
                req.flash(`flash`, {
                    msg: result, type: 'success'
                });
                req.session.save(function (err) {
                    res.redirect('/api/company');
                })
            })
            .catch((err) => {
                req.flash(`flash`, {
                    msg: err.message, type: `error`
                });
                req.session.save(function (err) {
                    res.redirect('/api/company');
                })
            })
    }
}

exports.updateCompanyLogo = (req, res) => {
    image_info = {
        company_logo: `/image/admin/${req.params.id}/${req.file.filename}`
    }
    company_model.updateCompanyLogo(image_info, req.params.id)
        .then((result) => {
            try {
                fs.unlinkSync(`public${result[0].company_logo}`)
            } catch (error) {
                console.log(error)
                throw new Error(`該圖片已從資料庫移除，但不在服務器内。`)
            }
            req.flash(`flash`, {
                msg: `商標圖檔更新成功`, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect(`/api/company/${req.params.id}`);
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect(`/api/company/${req.params.id}`);
            })
        })
}

exports.updateCompanyBankImage = (req, res) => {
    image_info = {
        company_bank_image: `/image/admin/${req.params.id}/${req.file.filename}`
    }
    company_model.updateCompanyBankImage(image_info, req.params.id)
        .then((result) => {
            if (result[0].company_bank_image != null) {
                try {
                    fs.unlinkSync(`public${result[0].company_bank_image}`)
                } catch (error) {
                    console.log(error)
                    throw new Error(`該圖片已從資料庫移除，但不在服務器内。`)
                }
            }
            req.flash(`flash`, {
                msg: `商標圖檔更新成功`, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect(`/api/company/${req.params.id}`);
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect(`/api/company/${req.params.id}`);
            })
        })
}