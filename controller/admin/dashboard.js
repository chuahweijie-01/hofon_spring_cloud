const dashboardModel = require('../../model/admin/dashboard');

exports.dashboard = (req, res) => {
    var companyId = req.session.company;
    var panelBoardSummary, userRecord;
    var orderDailyReport = [];
    var orderDay = [];
    var orderSummary = [];
    var revenueMonthlyReport = [];
    var revenueMonth = [];

    dashboardModel.orderReport(companyId)
        .then((result) => {
            for (var item in result) {
                var date = result[item].tradeDate + '/' + result[item].tradeMonth + '/' + result[item].tradeYear;
                orderDailyReport.push(result[item].totalOrder);
                orderDay.push(date);
            }
            return dashboardModel.orderSummary(companyId);
        })
        .then((result) => {
            orderSummary = result;
            return dashboardModel.getPanelBoardSummary(companyId);
        })
        .then((result) => {
            panelBoardSummary = result;
            return dashboardModel.getUserRecord(companyId);
        })
        .then((result) => {
            userRecord = result;
            return dashboardModel.getRevenueReport(companyId);
        })
        .then((result) => {
            for (var item in result) {
                var month = result[item].month + '/' + result[item].year;
                revenueMonthlyReport.push(result[item].total);
                revenueMonth.push(month);
            }

            res.render('dashboard', {
                title: '管理總表',
                icon: '<span class="glyphicon glyphicon-cog" aria-hidden="true"></span>',
                navigation: '<li class="active">管理總表</li>',
                message: req.flash(`flash`),
                panelBoardSummary: panelBoardSummary,
                orderSummary: orderSummary,
                orderDailyReport: orderDailyReport,
                orderDay: orderDay,
                userRecord: userRecord,
                revenueMonthlyReport: revenueMonthlyReport,
                revenueMonth: revenueMonth
            });
        })
        .catch((err) => {
            console.log(err.message)
            res.redirect('/api/error');
        })
}

exports.orderstatistic = (req, res) => {
    var companyId = req.session.company;
    var year, month;
    var orderDailyReport = [];
    var orderDay = [];

    req.query.year ? year = req.query.year : year = new Date().getFullYear();
    req.query.month ? month = req.query.month : month = new Date().getMonth() + 1;

    dashboardModel.orderStatistic(companyId, month, year)
        .then((result) => {
            for (var item in result) {
                var date = result[item].tradeDate + '/' + result[item].tradeMonth + '/' + result[item].tradeYear;
                orderDailyReport.push(result[item].totalOrder);
                orderDay.push(date);
            }
            res.send({ orderDailyReport: orderDailyReport, orderDay: orderDay });
        })
        .catch((err) => {
            console.log(err.message)
            res.redirect('/api/error');
        })
}

exports.getRevenueReportByYear = (req, res) => {
    var companyId = req.session.company;
    var revenueMonthlyReport = [];
    var revenueMonth = [];
    dashboardModel.getRevenueReport(companyId)
        .then((result) => {
            for (var item in result) {
                var month = result[item].month + '/' + result[item].year;
                revenueMonthlyReport.push(result[item].total);
                revenueMonth.push(month);
            }
            res.send({ revenueMonthlyReport: revenueMonthlyReport, revenueMonth: revenueMonth });
        })
}

exports.getRevenueReportByMonth = (req, res) => {
    var companyId = req.session.company;
    var year, month;
    var revenueMonthlyReport = [];
    var revenueMonth = [];

    year = req.query.year;
    month = req.query.month;

    dashboardModel.getRevenueReportByMonth(companyId, year, month)
        .then((result) => {
            for (var item in result) {
                var month = result[item].day + '/' + result[item].month + '/' + result[item].year;
                revenueMonthlyReport.push(result[item].total);
                revenueMonth.push(month);
            }
            res.send({ revenueMonthlyReport: revenueMonthlyReport, revenueMonth: revenueMonth })
        })
        .catch((err) => {
            console.log(err.message)
            res.redirect('/api/error');
        })
}