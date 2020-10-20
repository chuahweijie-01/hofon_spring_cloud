const zoneModel = require('../../model/admin/zone');

exports.displayZoneList = (req, res) => {
    zoneModel.displayZoneList(req.session.company)
        .then((result) => {
            res.render('zone', {
                title: "物流區域",
                icon: '<span class="glyphicon glyphicon-globe" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">物流區域</li>',
                message: req.flash(`flash`),
                data: result.rows,
                pagination: result.pagination,
                pagination_path: 'zone'
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

exports.openNewZone = (req, res) => {

}

exports.addNewZone = (req, res) => {

}

exports.updateZone = (req, res) => {

}

exports.deleteZone = (req, res) => {

}