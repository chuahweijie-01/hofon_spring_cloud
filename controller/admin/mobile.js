const mobile_model = require(`../../model/admin/mobile`)

exports.updateAppInterfaceSetting = (req, res) => {

    setting_info = {
        header_color: req.body.header_color,
        body_color: req.body.body_color,
        footer_color: req.body.footer_color,
        button_1_color: req.body.button_1_color
    }

    setting_info_company = {
        company_id:  req.session.company,
        header_color: req.body.header_color,
        body_color: req.body.body_color,
        footer_color: req.body.footer_color,
        button_1_color: req.body.button_1_color
    }

    mobile_model.updateAppInterfaceSetting(setting_info, req.session.company, setting_info_company).then((result) => {
        req.flash(`flash`, {
            msg : result,
            type: `success`
        });
        req.session.save(function (err) {
            res.redirect(`/api/mobile`);
        })
    }).catch((err) => { 
        req.flash(`flash`, { 
            msg : err.message,
            type: `error`
        });
        req.session.save(function (err) {
            res.redirect(`/api/mobile`);
        })
    })
}

exports.mobile_display = (req, res) => {

}

exports.getAppInterfaceSetting = (req, res) => {
    mobile_model.getAppInterfaceSetting(req.session.company).then((result) => {
        if (Object.keys(result).length === 0) {
            result = [
                TextRow = {
                    header_color: `#F24E4E`,
                    body_color: `#F9B6B6`,
                    footer_color: `#F24E4E`,
                    button_1_color: `#F6AEAD`
                }
            ]
        }
        res.render(`mobile_update`, {
            title: "軟體設定",
            icon: `<span class="glyphicon glyphicon-phone" aria-hidden="true"></span>`,
            navigation: `<li><a href="/api/dashboard">管理總表</a></li><li class="active">軟體設定</li>`,
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
                res.redirect(`/api/dashboard`);
            })
        })

}

exports.mobile_update = (req, res) => {

}



