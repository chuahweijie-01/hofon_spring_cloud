exports.dashboard = (req, res) => {
    res.render('dashboard',{
        title: '管理總表',
        icon: '<span class="glyphicon glyphicon-cog" aria-hidden="true"></span>',
        navigation: '<li class="active">管理總表</li>',
        message: req.flash('flash')
    });
}