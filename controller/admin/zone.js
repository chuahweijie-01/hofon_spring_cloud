const zoneModel = require('../../model/admin/zone');
const UUID = require('uuid');

exports.getZoneList = (req, res) => {
    zoneModel.getZoneList(req.query, req.session.company)
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
    var countryInfo, cityInfo;
    zoneModel.getCountry()
        .then((result) => {
            countryInfo = result;
            return zoneModel.getCity(1);
        })
        .then((result) => {
            cityInfo = result;
            var zoneInput = req.session.zoneInput;
            req.session.zoneInput = null;
            res.render('zone_add', {
                title: "區域",
                icon: '<span class="glyphicon glyphicon-globe" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/zone">物流區域</a></li><li class="active">新增物流區域</li>',
                message: req.flash(`flash`),
                validation: req.flash(`validation`),
                zone_info: zoneInput,
                data: countryInfo,
                cityInfo: cityInfo
            });
        })

        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/zone');
            })
        })

}

exports.addNewZone = (req, res) => {
    var city_id;
    var zoneId = UUID.v4();
    Array.isArray(req.body.city_id) ? city_id = req.body.city_id : city_id = [req.body.city_id];
    var zoneInfo = {
        zone_id: zoneId,
        company_id: req.session.company,
        zone_name: req.body.zone_name,
        zone_charge: req.body.zone_charge
    }
    zoneModel.addNewZone(zoneInfo, city_id)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/zone');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/zone');
            })
        })
}

exports.getZone = (req, res) => {
    var countryInfo, cityInfo, cityInCurrentZone;
    zoneModel.getCountry()
        .then((result) => {
            countryInfo = result;
            return zoneModel.getCity(1);
        })
        .then((result) => {
            cityInfo = result;
            return zoneModel.getZone(req.params.id);
        })
        .then((result) => {
            cityInCurrentZone = result;
            var zoneInput = req.session.zoneInput;
            req.session.zoneInput = null;

            res.render('zone_edit', {
                title: "物流區域",
                icon: '<span class="glyphicon glyphicon-globe" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/zone">物流區域</a></li><li class="active">更新物流區域</li>',
                message: req.flash(`flash`),
                validation: req.flash(`validation`),
                zone_info: zoneInput,
                data: countryInfo,
                cityInfo: cityInfo,
                cityInCurrentZone: cityInCurrentZone
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/zone');
            })
        })
}

exports.updateZone = (req, res) => {
    var city_id;
    Array.isArray(req.body.city_id) ? city_id = req.body.city_id : city_id = [req.body.city_id];
    var zoneInfo = {
        zone_name: req.body.zone_name,
        zone_charge: req.body.zone_charge
    }
    zoneModel.updateZone(zoneInfo, req.params.id, city_id)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/zone');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/zone');
            })
        })
}

exports.deleteZone = (req, res) => {
    zoneModel.deleteZone(req.params.id)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/zone');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/zone');
            })
        })
}