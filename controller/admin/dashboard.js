const dashboardModel = require('../../model/admin/dashboard');

exports.dashboard = (req, res) => {
    if (!req.session.isAdmin) {
        var companyId = req.session.company;
        var panelBoardSummary, userRecord;
        var orderDailyReport = [];
        var orderDay = [];
        var orderSummary = [];
        var revenueMonthlyReport = [];
        var revenueMonth = [];

        dashboardModel.getOrderReport(companyId)
            .then((result) => {
                for (var item in result) {
                    var date = result[item].tradeDate + '/' + result[item].tradeMonth + '/' + result[item].tradeYear;
                    orderDailyReport.push(result[item].totalOrder);
                    orderDay.push(date);
                }
                return dashboardModel.getOrderSummary(companyId);
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
    } else {
        var databaseName = [];
        var databaseSize = [];
        var databaseTables = [];
        var orderDailyReport = [];
        var orderDay = [];
        var panelBoardSummary;

        dashboardModel.getDatabaseCondition()
            .then((result) => {
                var dbChineseName;
                for (var item in result) {
                    switch (result[item].db) {
                        case 'analysisdb':
                            dbChineseName = "分析資料";
                            break;
                        case 'companydb':
                            dbChineseName = "公司";
                            break;
                        case 'orderdb':
                            dbChineseName = "訂單";
                            break;
                        case 'productdb':
                            dbChineseName = "產品";
                            break;
                        case 'userdb':
                            dbChineseName = "用戶";
                            break;
                        default:
                            dbChineseName = result[item].db;
                            break;
                    }
                    databaseName.push(dbChineseName);
                    databaseSize.push(result[item].Mb);
                    databaseTables.push(result[item].tb);
                }
                return dashboardModel.getAdminPanelBoardSummary()
            })
            .then((result) => {
                panelBoardSummary = result;
                return dashboardModel.getOverallOrderReport()
            })
            .then((result) => {
                for (var item in result) {
                    var date = result[item].tradeDate + '/' + result[item].tradeMonth + '/' + result[item].tradeYear;
                    orderDailyReport.push(result[item].totalOrder);
                    orderDay.push(date);
                }

                res.render('dashboard_admin', {
                    title: '管理總表',
                    icon: '<span class="glyphicon glyphicon-cog" aria-hidden="true"></span>',
                    navigation: '<li class="active">管理總表</li>',
                    message: req.flash(`flash`),
                    databaseName: databaseName,
                    databaseSize: databaseSize,
                    databaseTables: databaseTables,
                    panelBoardSummary: panelBoardSummary,
                    orderDailyReport: orderDailyReport,
                    orderDay: orderDay,
                    userRecord: ''
                });
            })
            .catch((err) => {
                console.log(err.message)
                res.redirect('/api/error');
            })
    }
}

exports.orderstatistic = (req, res) => {
    var year, month;
    var orderDailyReport = [];
    var orderDay = [];

    req.query.year ? year = req.query.year : year = new Date().getFullYear();
    req.query.month ? month = req.query.month : month = new Date().getMonth() + 1;

    var statisticFunction;
    if (req.session.isAdmin) {
        statisticFunction = dashboardModel.getOverallOrderStatistic(month, year);
    } else {
        var companyId = req.session.company;
        statisticFunction = dashboardModel.orderStatistic(companyId, month, year);
    }

    statisticFunction
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