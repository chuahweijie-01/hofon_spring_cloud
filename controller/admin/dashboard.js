const dashboardModel = require('../../model/admin/dashboard');

exports.dashboard = (req, res) => {
    var companyId = req.session.company;
    var orderDailyReport = [];
    var orderDay = [];
    var orderSummary = [];

    var month, year;

    req.query.year ? year = req.query.year : year = new Date().getFullYear();
    req.query.month ? month = req.query.month : month = new Date().getMonth() + 1;

    dashboardModel.orderReport(companyId, month, year)
        .then((result) => {
            for (var item in result) {
                var date = result[item].tradeDate + '/' + result[item].tradeMonth + '/' + result[item].tradeYear;
                orderDailyReport.push(result[item].totalOrder);
                orderDay.push(date);
            }
            return dashboardModel.orderSummary(companyId)
        })
        .then((result) => {
            orderSummary = result;

            if (req.query.year || req.query.month) {
                res.send({orderDailyReport : orderDailyReport, orderDay: orderDay});
            } else {
                res.render('dashboard', {
                    title: '管理總表',
                    icon: '<span class="glyphicon glyphicon-cog" aria-hidden="true"></span>',
                    navigation: '<li class="active">管理總表</li>',
                    message: req.flash(`flash`),

                    orderSummary: orderSummary,
                    orderDailyReport: orderDailyReport,
                    orderDay: orderDay
                });
            }
        })
        .catch((err) => {
            console.log(err.message)
            res.redirect('/api/error');
        })

}