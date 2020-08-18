const company_model = require('../../model/admin/company')

exports.company_create = (req, res) => {

    company_info = {

        company_name: req.body.company_name,
        company_logo: req.body.company_logo,
        company_phone: req.body.company_phone,
        company_address: req.body.company_address,
        company_address_another: req.body.company_address_another,
        company_description: req.body.company_description,
        company_official_id: req.body.company_official_id,

        company_contact_fax: req.body.company_contact_fax,
        company_contact_name: req.body.company_contact_name,
        company_contact_phone: req.body.company_contact_phone,
        company_contact_position: req.body.company_contact_position,

        company_bank_image: req.body.company_bank_image,
        company_bank_name: req.body.company_bank_name,
        company_bank_name_code: req.body.company_bank_name_code,
        company_bank_branch: req.body.company_bank_branch,
        company_bank_branch_code: req.body.company_bank_branch_code,
        company_bank_account: req.body.company_bank_account,
        company_bank_account_holder: req.body.company_bank_account_holder

    }

    company_model.add_company(company_info).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/company');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/company');
        })
    })
}

exports.company_display = (req, res) => {
    company_model.company(req.params.id).then((result) => {
        if (req.session.role === 1) {
            res.render('company_edit', {
                title: "公司",
                icon: '<span class="glyphicon glyphicon-home" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/company">公司</a></li><li class="active">更新公司</li>',
                message: req.flash('flash'),
                validation: req.flash('validation'),
                value: result
            })
        } else {
            res.render('company_edit_client', {
                title: "公司",
                icon: '<span class="glyphicon glyphicon-home" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/company">公司</a></li><li class="active">更新公司</li>',
                message: req.flash('flash'),
                validation: req.flash('validation'),
                value: result
            })
        }

    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/company');
        })
    })
}

exports.company_display_list = (req, res) => {
    company_model.company_list().then((result) => {
        res.render('company', {
            title: "公司",
            icon: '<span class="glyphicon glyphicon-home" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">公司</li>',
            message: req.flash('flash'),
            data: result
        });
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/dashboard');
        })
    })
}

exports.company_new = (req, res) => {
    res.render('company_add', {
        title: "公司",
        icon: '<span class="glyphicon glyphicon-home" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/company">公司</a></li><li class="active">新增公司</li>',
        message: req.flash('flash'),
        validation: req.flash('validation'),
        value: ''
    });
}

exports.company_update = (req, res) => {

    company_id = req.params.id;
    company_info = {}

    if (req.session.role == 0) company_info = { company_description: req.body.company_description };
    else company_info = req.body;

    company_model.company_update(company_id, company_info).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/company');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/company');
        })
    })
}

exports.company_delete = (req, res) => {
    company_model.company_delete(req.params.id).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/company');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/company');
        })
    })
}